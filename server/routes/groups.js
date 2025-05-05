const express = require('express');
const {
  createGroup,
  getGroups,
  getGroup,
  updateGroup,
  deleteGroup,
  joinGroup,
  leaveGroup,
  addAdmin,
  removeAdmin
} = require('../controllers/groups');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Protect all routes
router.use(protect);

router
  .route('/')
  .get(getGroups)
  .post(upload.single('image'), createGroup);

router
  .route('/:id')
  .get(getGroup)
  .put(upload.single('image'), updateGroup)
  .delete(deleteGroup);

router.route('/:id/join').put(joinGroup);
router.route('/:id/leave').put(leaveGroup);
router.route('/:id/admins/:userId').put(addAdmin).delete(removeAdmin);

module.exports = router;
