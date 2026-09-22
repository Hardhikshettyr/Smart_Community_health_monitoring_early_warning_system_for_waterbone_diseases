jest.mock('../src/models/User');
jest.mock('../src/services/emailService');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const User = require('../src/models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendOtpEmail } = require('../src/services/emailService');
const { registerUser, verifyOtp, loginUser } = require('../src/services/authService');

describe('registerUser', () => {
  test('throws if the email is already registered', async () => {
    User.findOne = jest.fn().mockResolvedValue({ email: 'test@example.com' });

    await expect(
      registerUser({ email: 'test@example.com', password: 'pass1234' })
    ).rejects.toThrow('Email already registered');
  });

  test('creates a new user and sends an OTP email on success', async () => {
    User.findOne = jest.fn().mockResolvedValue(null);
    bcrypt.hash = jest.fn().mockResolvedValue('hashedpassword');
    User.create = jest.fn().mockResolvedValue({ _id: 'newid123' });
    sendOtpEmail.mockResolvedValue(true);

    const result = await registerUser({ email: 'new@example.com', password: 'pass1234', role: 'user' });

    expect(User.create).toHaveBeenCalled();
    expect(sendOtpEmail).toHaveBeenCalled();
    expect(result.message).toContain('OTP sent');
  });
});

describe('verifyOtp', () => {
  test('throws if the OTP does not match', async () => {
    User.findOne = jest.fn().mockResolvedValue({
      isVerified: false, otp: '111111', otpExpiry: new Date(Date.now() + 10000),
    });

    await expect(verifyOtp({ email: 'test@example.com', otp: '999999' })).rejects.toThrow('Invalid OTP');
  });

  test('throws if the OTP has expired', async () => {
    User.findOne = jest.fn().mockResolvedValue({
      isVerified: false, otp: '111111', otpExpiry: new Date(Date.now() - 10000),
    });

    await expect(verifyOtp({ email: 'test@example.com', otp: '111111' })).rejects.toThrow('OTP has expired');
  });
});

describe('loginUser', () => {
  test('throws if the account is not yet verified', async () => {
    User.findOne = jest.fn().mockResolvedValue({ isVerified: false });

    await expect(
      loginUser({ email: 'test@example.com', password: 'pass1234' })
    ).rejects.toThrow('verify your email');
  });

  test('returns a JWT token on valid, verified login', async () => {
    User.findOne = jest.fn().mockResolvedValue({
      _id: 'id1', email: 'test@example.com', role: 'user', password: 'hashed', isVerified: true,
    });
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    jwt.sign = jest.fn().mockReturnValue('mocktoken123');

    const result = await loginUser({ email: 'test@example.com', password: 'pass1234' });

    expect(result.token).toBe('mocktoken123');
  });
});