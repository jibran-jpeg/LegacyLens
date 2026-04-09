const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Memory = require('../models/Memory');
const auth = require('../middleware/auth');
const router = express.Router();

// Cloudinary config (credentials should be in .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'legacylens',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit' }]
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
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

    // Use Cloudinary URL if file was uploaded
    const mediaUrl = req.file ? req.file.path : '';

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

    // If there was a cloudinary image, we might want to delete it here too
    // For now, just delete the record
    await Memory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Memory deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
