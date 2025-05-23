const express = require("express");
const { createEvent, getEvents, getEvent, updateEvent, deleteEvent, updateAttendance } = require("../controllers/eventController");

const router = express.Router();

const { protect } = require("../middleware/auth");
const fileUpload = require("../middleware/fileUpload");

// All routes are protected
router.use(protect);

// Routes
router.route("/").get(getEvents).post(fileUpload.single("image"), createEvent);

router.route("/:id").get(getEvent).put(fileUpload.single("image"), updateEvent).delete(deleteEvent);

router.put("/:id/attendance", updateAttendance);

module.exports = router;
