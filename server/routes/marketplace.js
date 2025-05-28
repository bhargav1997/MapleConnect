const express = require("express");
const router = express.Router();
const { getListings, getListing, createListing, updateListing, deleteListing, updateStatus } = require("../controllers/marketplace");
const { protect } = require("../middleware/auth");

router.route("/").get(getListings).post(protect, createListing);

router.route("/:id").get(getListing).put(protect, updateListing).delete(protect, deleteListing);

router.route("/:id/status").put(protect, updateStatus);

module.exports = router;
