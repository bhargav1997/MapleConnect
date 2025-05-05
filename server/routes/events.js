const express = require('express');
const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  updateAttendance,
  getGroupEvents
} = require('../controllers/events');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router({ mergeParams: true });

// Protect all routes
router.use(protect);

router
  .route('/')
  .get(getEvents)
  .post(upload.single('image'), createEvent);

router
  .route('/:id')
  .get(getEvent)
  .put(upload.single('image'), updateEvent)
  .delete(deleteEvent);

router.route('/:id/attend').put(updateAttendance);

module.exports = router;
