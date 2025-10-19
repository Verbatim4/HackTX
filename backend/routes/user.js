import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { encrypt, decrypt } from '../utils/encryption.js';

const router = express.Router();

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.language = req.body.language || user.language;
      user.state = req.body.state || user.state;
      
      if (req.body.accessibility) {
        user.accessibility = { ...user.accessibility, ...req.body.accessibility };
      }
      
      if (req.body.financialProfile) {
        user.financialProfile = { ...user.financialProfile, ...req.body.financialProfile };
      }
      
      if (req.body.benefits) {
        user.benefits = { ...user.benefits, ...req.body.benefits };
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        state: updatedUser.state,
        language: updatedUser.language,
        accessibility: updatedUser.accessibility,
        financialProfile: updatedUser.financialProfile,
        benefits: updatedUser.benefits,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

