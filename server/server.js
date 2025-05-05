const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

// Route files
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");
const groupRoutes = require("./routes/groups");
const eventRoutes = require("./routes/events");
const marketplaceRoutes = require("./routes/marketplace");
const messageRoutes = require("./routes/messages");
const notificationRoutes = require("./routes/notifications");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

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
const PORT = process.env.PORT || 5000;

connectDB()
   .then(() => {
      app.listen(PORT, () => {
         console.log(`Server running on port ${PORT}`);
      });
   })
   .catch((err) => {
      console.error("Failed to start server", err);
   });
