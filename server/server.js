const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const Message = require("./models/Message");

// Route files
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");
const groupRoutes = require("./routes/groups");
const eventRoutes = require("./routes/events");
const marketplaceRoutes = require("./routes/marketplace");
const messageRoutes = require("./routes/messages");
const notificationRoutes = require("./routes/notifications");
const chatRoutes = require("./routes/chats");
const adminRoutes = require("./routes/admin");
const thoughtRoutes = require("./routes/thoughts");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
   cors: {
      origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
      methods: ["GET", "POST"],
      credentials: true,
   },
});

// Track online users
const onlineUsers = new Map();

// Socket.IO connection handling
io.on("connection", (socket) => {
   console.log("User connected:", socket.id);
   let currentUserId = null;

   // Join user's personal room
   socket.on("join", (userId) => {
      currentUserId = userId;
      socket.join(userId);
      onlineUsers.set(userId, socket.id);

      // Broadcast user's online status
      io.emit("user_status", {
         userId: userId,
         status: "online",
      });

      console.log(`User ${userId} joined their room`);
   });

   // Handle private messages
   socket.on("private message", async (data) => {
      try {
         console.log("Received private message data:", data);
         const { sender, receiver, message } = data;

         // Save message to database
         const newMessage = new Message({
            sender,
            receiver,
            content: message,
            type: "text",
         });
         await newMessage.save();

         // Populate sender and receiver
         const populatedMessage = await Message.findById(newMessage._id)
            .populate("sender", "name profileImage")
            .populate("receiver", "name profileImage");

         // Get updated unread count for receiver
         const unreadCount = await Message.countDocuments({
            receiver,
            readBy: { $ne: receiver },
         });

         // Emit to receiver's room
         io.to(receiver).emit("new message", {
            sender,
            message: populatedMessage,
         });

         // Also emit updated unread count
         io.to(receiver).emit("unread count updated", { count: unreadCount });

         // Emit back to sender for confirmation
         io.to(sender).emit("message sent", {
            receiver,
            message: populatedMessage,
         });

         // Send notification if user is not in the chat
         const receiverSocket = onlineUsers.get(receiver);
         if (receiverSocket && receiverSocket !== socket.id) {
            io.to(receiver).emit("message notification", {
               sender,
               message: populatedMessage,
            });
         }
      } catch (error) {
         console.error("Error handling private message:", error);
         socket.emit("error", { message: "Failed to send message" });
      }
   });

   // Handle typing status
   socket.on("typing", (data) => {
      const { senderId, receiverId } = data;
      io.to(receiverId).emit("user typing", { senderId, isTyping: true });
   });

   // Handle read receipts
   socket.on("mark as read", async (data) => {
      try {
         const { senderId, receiverId, messageIds, markAll } = data;

         if (markAll) {
            // Mark all unread messages from sender as read
            await Message.updateMany(
               {
                  sender: senderId,
                  receiver: receiverId,
                  readBy: { $ne: receiverId },
               },
               { $addToSet: { readBy: receiverId } },
            );

            // Get all updated messages to emit
            const updatedMessages = await Message.find({
               sender: senderId,
               receiver: receiverId,
               readBy: receiverId,
            }).select("_id");

            // Emit to sender that messages were read
            io.to(senderId).emit("messages read", {
               receiverId,
               messageIds: updatedMessages.map((msg) => msg._id),
            });
         } else {
            // Mark specific messages as read
            await Message.updateMany({ _id: { $in: messageIds } }, { $addToSet: { readBy: receiverId } });

            // Emit to sender that messages were read
            io.to(senderId).emit("messages read", { receiverId, messageIds });
         }

         // Get updated unread count for receiver
         const receiverUnreadCount = await Message.countDocuments({
            receiver: receiverId,
            readBy: { $ne: receiverId },
         });

         // Emit updated count to receiver
         io.to(receiverId).emit("unread count updated", { count: receiverUnreadCount });

         console.log(`Updated unread count for receiver: ${receiverUnreadCount}`);
      } catch (error) {
         console.error("Error marking messages as read:", error);
      }
   });

   socket.on("disconnect", () => {
      if (currentUserId) {
         onlineUsers.delete(currentUserId);
         // Broadcast user's offline status
         io.emit("user_status", {
            userId: currentUserId,
            status: "offline",
         });
      }
      console.log("User disconnected:", socket.id);
   });
});

// Middleware
app.use(
   cors({
      origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
   }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Log all requests for debugging
app.use((req, res, next) => {
   console.log(`${req.method} ${req.url}`);
   next();
});

// Set up static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mount routers
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/thoughts", thoughtRoutes);

// Mount nested routes
app.use("/api/groups/:groupId/events", eventRoutes);
app.use("/api/users/:userId/marketplace", marketplaceRoutes);

// Base route
app.get("/", (req, res) => {
   res.json({ message: "Welcome to MapleConnect API" });
});

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5001;

connectDB()
   .then(() => {
      server.listen(PORT, () => {
         console.log(`Server running on port ${PORT}`);
      });
   })
   .catch((err) => {
      console.error("Failed to start server", err);
   });
