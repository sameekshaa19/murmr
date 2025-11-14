// backend/controllers/noteController.js

const Note = require('../models/Note');

// @desc    Get all notes for a user
// @route   GET /api/notes
// @access  Public (will be protected later with auth)
exports.getNotes = async (req, res, next) => {
  try {
    const { userId, tagType } = req.query;

    let query = {};
    if (userId) query.userId = userId;
    if (tagType) query.tagType = tagType;

    const notes = await Note.find(query)
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single note by ID
// @route   GET /api/notes/:id
// @access  Public
exports.getNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found',
      });
    }

    res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new note
// @route   POST /api/notes
// @access  Public
exports.createNote = async (req, res, next) => {
  try {
    const { title, audioUri, duration, tagType, tagValue, userId } = req.body;

    // Validate required fields
    if (!audioUri || !duration || !tagType || !tagValue || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    const note = await Note.create({
      title,
      audioUri,
      duration,
      tagType,
      tagValue,
      userId,
    });

    res.status(201).json({
      success: true,
      data: note,
      message: 'Note created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Public
exports.updateNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found',
      });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: updatedNote,
      message: 'Note updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Public
exports.deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found',
      });
    }

    await note.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Note deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark note as triggered
// @route   PUT /api/notes/:id/trigger
// @access  Public
exports.triggerNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found',
      });
    }

    note.isTriggered = true;
    note.triggeredAt = new Date();
    await note.save();

    res.status(200).json({
      success: true,
      data: note,
      message: 'Note marked as triggered',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get notes by location proximity
// @route   POST /api/notes/nearby
// @access  Public
exports.getNearbyNotes = async (req, res, next) => {
  try {
    const { latitude, longitude, userId, maxDistance = 200 } = req.body;

    if (!latitude || !longitude || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Latitude, longitude, and userId are required',
      });
    }

    // Find all location-tagged notes for this user
    const locationNotes = await Note.find({
      userId,
      tagType: 'location',
    }).lean();

    // Filter notes within radius
    const nearbyNotes = locationNotes.filter(note => {
      const noteLat = note.tagValue.latitude;
      const noteLon = note.tagValue.longitude;
      const noteRadius = note.tagValue.radius || 150;

      const distance = calculateDistance(latitude, longitude, noteLat, noteLon);
      return distance <= noteRadius || distance <= maxDistance;
    });

    res.status(200).json({
      success: true,
      count: nearbyNotes.length,
      data: nearbyNotes,
    });
  } catch (error) {
    next(error);
  }
};

// Helper: Calculate distance between two coordinates (Haversine)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}