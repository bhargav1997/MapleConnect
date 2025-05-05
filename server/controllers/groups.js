const Group = require('../models/Group');
const User = require('../models/User');

// @desc    Create new group
// @route   POST /api/groups
// @access  Private
exports.createGroup = async (req, res, next) => {
  try {
    // Add creator to req.body
    req.body.creator = req.user.id;
    
    // Handle group image
    if (req.file) {
      req.body.image = req.file.filename;
    }
    
    const group = await Group.create(req.body);
    
    res.status(201).json({
      success: true,
      data: group
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all groups
// @route   GET /api/groups
// @access  Private
exports.getGroups = async (req, res, next) => {
  try {
    const groups = await Group.find()
      .populate('creator', 'name profileImage')
      .populate('members', 'name profileImage')
      .populate('admins', 'name profileImage');
    
    res.status(200).json({
      success: true,
      count: groups.length,
      data: groups
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single group
// @route   GET /api/groups/:id
// @access  Private
exports.getGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('creator', 'name profileImage')
      .populate('members', 'name profileImage')
      .populate('admins', 'name profileImage');
    
    if (!group) {
      return res.status(404).json({
        success: false,
        error: 'Group not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: group
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update group
// @route   PUT /api/groups/:id
// @access  Private
exports.updateGroup = async (req, res, next) => {
  try {
    let group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({
        success: false,
        error: 'Group not found'
      });
    }
    
    // Make sure user is group admin
    if (!group.admins.includes(req.user.id)) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this group'
      });
    }
    
    // Handle group image
    if (req.file) {
      req.body.image = req.file.filename;
    }
    
    group = await Group.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('creator', 'name profileImage')
      .populate('members', 'name profileImage')
      .populate('admins', 'name profileImage');
    
    res.status(200).json({
      success: true,
      data: group
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete group
// @route   DELETE /api/groups/:id
// @access  Private
exports.deleteGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({
        success: false,
        error: 'Group not found'
      });
    }
    
    // Make sure user is group creator
    if (group.creator.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this group'
      });
    }
    
    await group.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Join group
// @route   PUT /api/groups/:id/join
// @access  Private
exports.joinGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({
        success: false,
        error: 'Group not found'
      });
    }
    
    // Check if user is already a member
    if (group.members.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        error: 'You are already a member of this group'
      });
    }
    
    // Check if group is private
    if (group.isPrivate) {
      return res.status(400).json({
        success: false,
        error: 'This is a private group. Please request to join.'
      });
    }
    
    // Add user to members array
    group.members.push(req.user.id);
    await group.save();
    
    res.status(200).json({
      success: true,
      data: group
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Leave group
// @route   PUT /api/groups/:id/leave
// @access  Private
exports.leaveGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({
        success: false,
        error: 'Group not found'
      });
    }
    
    // Check if user is a member
    if (!group.members.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        error: 'You are not a member of this group'
      });
    }
    
    // Check if user is the creator
    if (group.creator.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'Group creator cannot leave the group. Please delete the group instead.'
      });
    }
    
    // Remove user from members array
    group.members = group.members.filter(
      member => member.toString() !== req.user.id
    );
    
    // Remove user from admins array if they are an admin
    if (group.admins.includes(req.user.id)) {
      group.admins = group.admins.filter(
        admin => admin.toString() !== req.user.id
      );
    }
    
    await group.save();
    
    res.status(200).json({
      success: true,
      data: group
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add admin to group
// @route   PUT /api/groups/:id/admins/:userId
// @access  Private
exports.addAdmin = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({
        success: false,
        error: 'Group not found'
      });
    }
    
    // Make sure user is group creator
    if (group.creator.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to add admins to this group'
      });
    }
    
    // Check if user to be added exists
    const userToAdd = await User.findById(req.params.userId);
    
    if (!userToAdd) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Check if user is a member
    if (!group.members.includes(req.params.userId)) {
      return res.status(400).json({
        success: false,
        error: 'User must be a member of the group to be an admin'
      });
    }
    
    // Check if user is already an admin
    if (group.admins.includes(req.params.userId)) {
      return res.status(400).json({
        success: false,
        error: 'User is already an admin'
      });
    }
    
    // Add user to admins array
    group.admins.push(req.params.userId);
    await group.save();
    
    res.status(200).json({
      success: true,
      data: group
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove admin from group
// @route   DELETE /api/groups/:id/admins/:userId
// @access  Private
exports.removeAdmin = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({
        success: false,
        error: 'Group not found'
      });
    }
    
    // Make sure user is group creator
    if (group.creator.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to remove admins from this group'
      });
    }
    
    // Check if user is the creator
    if (req.params.userId === group.creator.toString()) {
      return res.status(400).json({
        success: false,
        error: 'Cannot remove creator from admins'
      });
    }
    
    // Check if user is an admin
    if (!group.admins.includes(req.params.userId)) {
      return res.status(400).json({
        success: false,
        error: 'User is not an admin'
      });
    }
    
    // Remove user from admins array
    group.admins = group.admins.filter(
      admin => admin.toString() !== req.params.userId
    );
    
    await group.save();
    
    res.status(200).json({
      success: true,
      data: group
    });
  } catch (err) {
    next(err);
  }
};
