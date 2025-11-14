// backend/routes/notes.js

const express = require('express');
const router = express.Router();
const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  triggerNote,
  getNearbyNotes,
} = require('../controllers/noteController');

// Basic CRUD routes
router.route('/')
  .get(getNotes)
  .post(createNote);

router.route('/:id')
  .get(getNote)
  .put(updateNote)
  .delete(deleteNote);

// Special routes
router.put('/:id/trigger', triggerNote);
router.post('/nearby', getNearbyNotes);

module.exports = router;