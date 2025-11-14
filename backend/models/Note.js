// backend/models/Note.js

const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    audioUri: {
      type: String,
      required: [true, 'Audio URI is required'],
    },
    duration: {
      type: Number, // in milliseconds
      required: true,
    },
    tagType: {
      type: String,
      required: [true, 'Tag type is required'],
      enum: ['location', 'time', 'mood'],
    },
    tagValue: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Tag value is required'],
      // For location: { latitude, longitude, radius, address }
      // For time: { date, time, timestamp }
      // For mood: { moodId, moodLabel, moodEmoji }
    },
    isTriggered: {
      type: Boolean,
      default: false,
    },
    triggeredAt: {
      type: Date,
    },
    userId: {
      type: String,
      required: true,
      // In future: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Index for faster queries
NoteSchema.index({ userId: 1, tagType: 1 });
NoteSchema.index({ createdAt: -1 });
NoteSchema.index({ 'tagValue.timestamp': 1 });

// Virtual for checking if note is expired (for time-based notes)
NoteSchema.virtual('isExpired').get(function() {
  if (this.tagType === 'time' && this.tagValue.timestamp) {
    return new Date() > new Date(this.tagValue.timestamp);
  }
  return false;
});

module.exports = mongoose.model('Note', NoteSchema);