const {
  registerUser,
  verifyOtp,
  loginUser,
  resendOtp,
} = require('../services/authService');

async function register(req, res, next) {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await registerUser({ email, password, role });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

async function verify(req, res, next) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const result = await verifyOtp({ email, otp });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await loginUser({ email, password });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function resend(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const result = await resendOtp({ email });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, verify, login, resend };