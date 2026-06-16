import User from '../models/User.js';
import Company from '../models/Company.js';
import { generateToken, generateRefreshToken } from '../utils/jwt.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create User (pre-save middleware hashes password)
    const user = await User.create({
      name,
      email,
      password,
      role
    });

    // If company role, create a Company document
    let companyId = null;
    if (role === 'company') {
      const company = await Company.create({
        owner: user._id,
        companyName: `${name}'s Company`,
        verificationStatus: 'pending' // Admin approval required
      });
      companyId = company._id;

      // Update User profile with company details
      user.companyProfile.companyName = company.companyName;
      await user.save();
    }

    if (user) {
      const token = generateToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto,
        status: user.status,
        candidateProfile: user.candidateProfile,
        companyProfile: user.companyProfile,
        companyId,
        token,
        refreshToken
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      if (user.status === 'blocked') {
        return res.status(403).json({ message: 'Your account is blocked. Please contact support.' });
      }

      // Check if they are a company owner, fetch company ID
      let companyId = null;
      if (user.role === 'company') {
        const company = await Company.findOne({ owner: user._id });
        if (company) {
          companyId = company._id;
        }
      }

      const token = generateToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto,
        status: user.status,
        candidateProfile: user.candidateProfile,
        companyProfile: user.companyProfile,
        companyId,
        token,
        refreshToken
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (req, res) => {
  const { token: clientRefreshToken } = req.body;

  if (!clientRefreshToken) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  try {
    const decoded = jwt.verify(clientRefreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found or token invalid' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'Account is blocked' });
    }

    const token = generateToken(user._id);
    res.json({ token });
  } catch (error) {
    res.status(401).json({ message: 'Refresh token expired or invalid' });
  }
};

// @desc    Forgot Password - mock mail link
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account with that email' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Hash it and set to resetPasswordToken field on user model
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire (1 hour)
    user.resetPasswordExpire = Date.now() + 3600000;

    await user.save();

    // Create reset url (mock local UI path)
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    
    // Simulated Mail Sending
    console.log(`========================================`);
    console.log(`SIMULATED EMAIL TO: ${email}`);
    console.log(`SUBJECT: CareerConnect Password Reset Request`);
    console.log(`BODY: You are receiving this because you requested a password reset. Please click on the following link, or paste it into your browser to complete the process:`);
    console.log(`LINK: ${resetUrl}`);
    console.log(`========================================`);

    res.json({ message: 'Reset password link generated. Check server console logs (simulated email).' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password/:resettoken
// @access  Public
export const resetPassword = async (req, res) => {
  const { password } = req.body;
  const resetToken = req.params.resettoken;

  try {
    // Hash token to compare with DB
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired password reset token' });
    }

    // Set new password (pre-save middleware will hash it)
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: 'Password reset successful. You can now login.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user && (await user.comparePassword(oldPassword))) {
      user.password = newPassword;
      await user.save();
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(401).json({ message: 'Incorrect current password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
