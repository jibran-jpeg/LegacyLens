const mongoose = require('mongoose');

const MemorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  mood: {
    type: String,
    enum: ['happy', 'sad', 'nostalgic', 'grateful', 'excited', 'peaceful', 'reflective'],
    default: 'nostalgic',
  },
  tags: [{
    type: String,
    trim: true,
  }],
  mediaUrl: {
    type: String,
    default: '',
  },
  isCapsule: {
    type: Boolean,
    default: false,
  },
  unlockDate: {
    type: Date,
    default: null,
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Memory', MemorySchema);
