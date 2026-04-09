const express = require('express');
const multer = require('multer');
const path = require('path');
const Memory = require('../models/Memory');
const auth = require('../middleware/auth');
const router = express.Router();

// Multer config for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// Get all memories for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const memories = await Memory.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(memories);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single memory
router.get('/:id', auth, async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) return res.status(404).json({ message: 'Memory not found' });
    if (memory.user.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    // Check if it's a locked capsule
    if (memory.isLocked && memory.unlockDate && new Date() < new Date(memory.unlockDate)) {
      return res.json({
        ...memory.toObject(),
        content: '🔒 This time capsule is locked until ' + new Date(memory.unlockDate).toLocaleDateString(),
        isLocked: true
      });
    }

    res.json(memory);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a memory (with optional image upload)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, content, mood, tags, isCapsule, unlockDate } = req.body;

    // Build image URL if file was uploaded
    let mediaUrl = '';
    if (req.file) {
      mediaUrl = `/uploads/${req.file.filename}`;
    }

    const memory = new Memory({
      user: req.user.id,
      title,
      content,
      mood: mood || 'nostalgic',
      tags: tags ? (typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : tags) : [],
      mediaUrl,
      isCapsule: isCapsule === 'true' || isCapsule === true,
      unlockDate: unlockDate || null,
      isLocked: isCapsule === 'true' || isCapsule === true,
    });

    await memory.save();
    res.status(201).json(memory);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update a memory
router.put('/:id', auth, async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) return res.status(404).json({ message: 'Memory not found' });
    if (memory.user.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    const updated = await Memory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a memory
router.delete('/:id', auth, async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) return res.status(404).json({ message: 'Memory not found' });
    if (memory.user.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    await Memory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Memory deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
