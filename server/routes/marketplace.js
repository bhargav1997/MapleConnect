const express = require('express');
const {
  createListing,
  getListings,
  getListing,
  updateListing,
  deleteListing,
  updateStatus,
  getSellerListings
} = require('../controllers/marketplace');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router({ mergeParams: true });

// Protect all routes
router.use(protect);

router
  .route('/')
  .get(getListings)
  .post(upload.array('images', 5), createListing);

router
  .route('/:id')
  .get(getListing)
  .put(upload.array('images', 5), updateListing)
  .delete(deleteListing);

router.route('/:id/status').put(updateStatus);

module.exports = router;
