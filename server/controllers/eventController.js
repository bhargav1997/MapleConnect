const Event = require("../models/Event");
const User = require("../models/User");
const Group = require("../models/Group");
const Notification = require("../models/Notification");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const cloudinary = require("../config/cloudinary");

// @desc    Create new event
// @route   POST /api/events
// @access  Private
exports.createEvent = asyncHandler(async (req, res, next) => {
   // Add user to req.body
   req.body.creator = req.user.id;

   // If group is specified, verify user is a member
   if (req.body.group) {
      const group = await Group.findById(req.body.group);
      if (!group) {
         return next(new ErrorResponse("Group not found", 404));
      }
      if (!group.members.includes(req.user.id)) {
         return next(new ErrorResponse("You must be a member of the group to create an event", 403));
      }
   }

   // Handle image upload if present
   if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
         folder: "events",
         width: 1200,
         crop: "scale",
      });
      req.body.image = result.secure_url;
   }

   const event = await Event.create(req.body);

   // Create notification for group members if event is in a group
   if (event.group) {
      const group = await Group.findById(event.group).populate("members");
      const notificationPromises = group.members
         .filter((member) => member._id.toString() !== req.user.id)
         .map((member) =>
            Notification.create({
               recipient: member._id,
               sender: req.user.id,
               type: "event_invite",
               content: `${req.user.name} created a new event in ${group.name}`,
               entityId: event._id,
               entityModel: "Event",
               link: `/events/${event._id}`,
            }),
         );
      await Promise.all(notificationPromises);
   }

   res.status(201).json({
      success: true,
      data: event,
   });
});

// @desc    Get all events
// @route   GET /api/events
// @access  Private
exports.getEvents = asyncHandler(async (req, res, next) => {
   const events = await Event.find().populate("creator", "name profileImage").populate("group", "name image").sort("-createdAt");

   res.status(200).json({
      success: true,
      count: events.length,
      data: events,
   });
});

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Private
exports.getEvent = asyncHandler(async (req, res, next) => {
   const event = await Event.findById(req.params.id)
      .populate("creator", "name profileImage")
      .populate("group", "name")
      .populate("attendees.user", "name profileImage");

   if (!event) {
      return next(new ErrorResponse("Event not found", 404));
   }

   // Check if event is private and user is not a member of the group
   if (event.isPrivate && event.group) {
      const group = await Group.findById(event.group);
      if (!group.members.includes(req.user.id)) {
         return next(new ErrorResponse("Not authorized to access this event", 403));
      }
   }

   res.status(200).json({
      success: true,
      data: event,
   });
});

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
exports.updateEvent = asyncHandler(async (req, res, next) => {
   let event = await Event.findById(req.params.id);

   if (!event) {
      return next(new ErrorResponse("Event not found", 404));
   }

   // Make sure user is event creator or group admin
   if (event.creator.toString() !== req.user.id) {
      if (event.group) {
         const group = await Group.findById(event.group);
         if (!group.admins.includes(req.user.id)) {
            return next(new ErrorResponse("Not authorized to update this event", 403));
         }
      } else {
         return next(new ErrorResponse("Not authorized to update this event", 403));
      }
   }

   // Handle image upload if present
   if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
         folder: "events",
         width: 1200,
         crop: "scale",
      });
      req.body.image = result.secure_url;
   }

   event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
   });

   // Create notification for attendees if event details changed
   const notificationPromises = event.attendees
      .filter((attendee) => attendee.user.toString() !== req.user.id)
      .map((attendee) =>
         Notification.create({
            recipient: attendee.user,
            sender: req.user.id,
            type: "event_update",
            content: `${req.user.name} updated the event "${event.title}"`,
            entityId: event._id,
            entityModel: "Event",
            link: `/events/${event._id}`,
         }),
      );
   await Promise.all(notificationPromises);

   res.status(200).json({
      success: true,
      data: event,
   });
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
exports.deleteEvent = asyncHandler(async (req, res, next) => {
   const event = await Event.findById(req.params.id);

   if (!event) {
      return next(new ErrorResponse("Event not found", 404));
   }

   // Make sure user is event creator or group admin
   if (event.creator.toString() !== req.user.id) {
      if (event.group) {
         const group = await Group.findById(event.group);
         if (!group.admins.includes(req.user.id)) {
            return next(new ErrorResponse("Not authorized to delete this event", 403));
         }
      } else {
         return next(new ErrorResponse("Not authorized to delete this event", 403));
      }
   }

   await event.remove();

   res.status(200).json({
      success: true,
      data: {},
   });
});

// @desc    Update event attendance
// @route   PUT /api/events/:id/attendance
// @access  Private
exports.updateAttendance = asyncHandler(async (req, res, next) => {
   const { status } = req.body;
   const event = await Event.findById(req.params.id);

   if (!event) {
      return next(new ErrorResponse("Event not found", 404));
   }

   // Check if user is already in attendees list
   const attendeeIndex = event.attendees.findIndex((attendee) => attendee.user.toString() === req.user.id);

   if (attendeeIndex > -1) {
      // Update existing attendance
      event.attendees[attendeeIndex].status = status;
   } else {
      // Add new attendance
      event.attendees.push({
         user: req.user.id,
         status,
      });
   }

   await event.save();

   // Create notification for event creator
   if (event.creator.toString() !== req.user.id) {
      await Notification.create({
         recipient: event.creator,
         sender: req.user.id,
         type: "event_invite",
         content: `${req.user.name} is ${status} your event "${event.title}"`,
         entityId: event._id,
         entityModel: "Event",
         link: `/events/${event._id}`,
      });
   }

   res.status(200).json({
      success: true,
      data: event,
   });
});
