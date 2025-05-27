const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");
const groupRoutes = require("./routes/groups");
const chatRoutes = require("./routes/chats");

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
   cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
   },
});

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());

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
         const { senderId, receiverId, message } = data;

         // Save message to database
         const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            content: message,
            type: "text",
         });
         await newMessage.save();

         // Emit to receiver's room
         io.to(receiverId).emit("new message", {
            senderId,
            message: newMessage,
         });

         // Emit back to sender for confirmation
         io.to(senderId).emit("message sent", {
            receiverId,
            message: newMessage,
         });
      } catch (error) {
         console.error("Error handling private message:", error);
         socket.emit("error", { message: "Failed to send message" });
      }
   });

   // Handle typing status
   socket.on("typing", (data) => {
      const { senderId, receiverId, isTyping } = data;
      io.to(receiverId).emit("user typing", { senderId, isTyping });
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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/chats", chatRoutes);

// MongoDB connection
mongoose
   .connect(process.env.MONGODB_URI)
   .then(() => {
      console.log("Connected to MongoDB");
      const PORT = process.env.PORT || 5000;
      server.listen(PORT, () => {
         console.log(`Server running on port ${PORT}`);
      });
   })
   .catch((err) => {
      console.error("MongoDB connection error:", err);
   });
