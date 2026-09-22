const transporter = require('../config/emailConfig');

async function sendOtpEmail(toEmail, otp) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: toEmail,
      subject: 'Your Verification Code - AquaSentinel',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Email Verification</h2>
          <p>Your one-time verification code is:</p>
          <h1 style="letter-spacing: 4px;">${otp}</h1>
          <p>This code expires in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error('Failed to send OTP email:', err.message);
    throw new Error('Could not send verification email');
  }
}

module.exports = { sendOtpEmail };