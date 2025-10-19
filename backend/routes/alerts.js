import express from 'express';
import { protect } from '../middleware/auth.js';
import Alert from '../models/Alert.js';

const router = express.Router();

// @route   GET /api/alerts
// @desc    Get user alerts
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const alerts = await Alert.find({ userId: req.user._id })
      .sort({ dateIssued: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/alerts
// @desc    Create new alert
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { message, type, impactValue } = req.body;
    
    const alert = await Alert.create({
      userId: req.user._id,
      message,
      type,
      impactValue,
    });
    
    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/alerts/:id/viewed
// @desc    Mark alert as viewed
// @access  Private
router.put('/:id/viewed', protect, async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    if (alert.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    alert.viewed = true;
    await alert.save();
    
    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/alerts/:id
// @desc    Delete alert
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    if (alert.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await alert.deleteOne();
    res.json({ message: 'Alert deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

