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

// Socket.IO connection handling
io.on("connection", (socket) => {
   console.log("User connected:", socket.id);

   // Join user's personal room
   socket.on("join", (userId) => {
      socket.join(userId);
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

         // Emit to receiver's room
         io.to(receiver).emit("new message", {
            sender,
            message: populatedMessage,
         });

         // Emit back to sender for confirmation
         io.to(sender).emit("message sent", {
            receiver,
            message: populatedMessage,
         });
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
   socket.on("mark as read", (data) => {
      const { senderId, receiverId, messageIds } = data;
      io.to(senderId).emit("messages read", { receiverId, messageIds });
   });

   socket.on("disconnect", () => {
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
