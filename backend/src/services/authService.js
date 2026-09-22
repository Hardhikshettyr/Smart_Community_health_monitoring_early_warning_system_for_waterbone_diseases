const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateOtp, getOtpExpiry } = require('../utils/otpUtils');
const { sendOtpEmail } = require('./emailService');

async function registerUser({ email, password, role }) {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error('Email already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = generateOtp();

  const user = await User.create({
    email,
    password: hashedPassword,
    role: role || 'user',
    otp,
    otpExpiry: getOtpExpiry(),
    isVerified: false,
  });

  await sendOtpEmail(email, otp);

  return {
    message: 'Registration successful. OTP sent to email.',
    userId: user._id,
  };
}

async function verifyOtp({ email, otp }) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }
  if (user.isVerified) {
    throw new Error('Email already verified');
  }
  if (!user.otp || user.otp !== otp) {
    throw new Error('Invalid OTP');
  }
  if (!user.otpExpiry || user.otpExpiry < new Date()) {
    throw new Error('OTP has expired. Please request a new one.');
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  return { message: 'Email verified successfully. You can now log in.' };
}

async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }
  if (!user.isVerified) {
    throw new Error('Please verify your email before logging in');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  return {
    message: 'Login successful',
    token,
    user: { id: user._id, email: user.email, role: user.role },
  };
}

async function resendOtp({ email }) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }
  if (user.isVerified) {
    throw new Error('Email already verified');
  }

  const otp = generateOtp();
  user.otp = otp;
  user.otpExpiry = getOtpExpiry();
  await user.save();

  await sendOtpEmail(email, otp);

  return { message: 'A new OTP has been sent to your email' };
}

module.exports = { registerUser, verifyOtp, loginUser, resendOtp };