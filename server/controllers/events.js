const Event = require('../models/Event');
const Group = require('../models/Group');

// @desc    Create new event
// @route   POST /api/events
// @access  Private
exports.createEvent = async (req, res, next) => {
  try {
    // Add creator to req.body
    req.body.creator = req.user.id;
    
    // Check if group exists if provided
    if (req.body.group) {
      const group = await Group.findById(req.body.group);
      
      if (!group) {
        return res.status(404).json({
          success: false,
          error: 'Group not found'
        });
      }
      
      // Check if user is a member of the group
      if (!group.members.includes(req.user.id)) {
        return res.status(401).json({
          success: false,
          error: 'You must be a member of the group to create an event'
        });
      }
    }
    
    // Handle event image
    if (req.file) {
      req.body.image = req.file.filename;
    }
    
    const event = await Event.create(req.body);
    
    res.status(201).json({
      success: true,
      data: event
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Private
exports.getEvents = async (req, res, next) => {
  try {
    // Build query
    let query;
    
    // Copy req.query
    const reqQuery = { ...req.query };
    
    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // Finding resource
    query = Event.find(JSON.parse(queryStr))
      .populate('creator', 'name profileImage')
      .populate('group', 'name image')
      .populate('attendees.user', 'name profileImage');
    
    // Select fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }
    
    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-startDate');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Event.countDocuments(JSON.parse(queryStr));
    
    query = query.skip(startIndex).limit(limit);
    
    // Executing query
    const events = await query;
    
    // Pagination result
    const pagination = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    res.status(200).json({
      success: true,
      count: events.length,
      pagination,
      data: events
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Private
exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('creator', 'name profileImage')
      .populate('group', 'name image')
      .populate('attendees.user', 'name profileImage');
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }
    
    // Make sure user is event creator
    if (event.creator.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this event'
      });
    }
    
    // Handle event image
    if (req.file) {
      req.body.image = req.file.filename;
    }
    
    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('creator', 'name profileImage')
      .populate('group', 'name image')
      .populate('attendees.user', 'name profileImage');
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }
    
    // Make sure user is event creator
    if (event.creator.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this event'
      });
    }
    
    await event.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update attendance status
// @route   PUT /api/events/:id/attend
// @access  Private
exports.updateAttendance = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!status || !['going', 'interested', 'not going'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid status (going, interested, not going)'
      });
    }
    
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }
    
    // Check if event is from a private group
    if (event.group && event.isPrivate) {
      const group = await Group.findById(event.group);
      
      if (!group.members.includes(req.user.id)) {
        return res.status(401).json({
          success: false,
          error: 'You must be a member of the group to attend this event'
        });
      }
    }
    
    // Check if user is already in attendees
    const attendeeIndex = event.attendees.findIndex(
      attendee => attendee.user.toString() === req.user.id
    );
    
    if (attendeeIndex !== -1) {
      // Update existing attendance
      event.attendees[attendeeIndex].status = status;
    } else {
      // Add new attendance
      event.attendees.push({
        user: req.user.id,
        status
      });
    }
    
    await event.save();
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get events for a group
// @route   GET /api/groups/:groupId/events
// @access  Private
exports.getGroupEvents = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.groupId);
    
    if (!group) {
      return res.status(404).json({
        success: false,
        error: 'Group not found'
      });
    }
    
    // Check if user is a member of the group if it's private
    if (group.isPrivate && !group.members.includes(req.user.id)) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to view events for this group'
      });
    }
    
    const events = await Event.find({ group: req.params.groupId })
      .populate('creator', 'name profileImage')
      .populate('group', 'name image')
      .populate('attendees.user', 'name profileImage')
      .sort('-startDate');
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (err) {
    next(err);
  }
};
