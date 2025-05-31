const express = require("express");
const {
   getAllUsers,
   deleteUser,
   getReportedPosts,
   deletePost,
   broadcastNotification,
   getStats,
} = require("../controllers/adminController");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// Protect all routes with admin authentication
router.use(adminAuth);

// User management routes
router.route("/users").get(getAllUsers);

router.route("/users/:id").delete(deleteUser);

// Post management routes
router.route("/posts/reported").get(getReportedPosts);

router.route("/posts/:id").delete(deletePost);

// Notification routes
router.route("/notifications/broadcast").post(broadcastNotification);

// Dashboard stats
router.route("/stats").get(getStats);

module.exports = router;
