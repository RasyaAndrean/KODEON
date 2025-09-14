const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const redis = require("redis");
const rateLimit = require("express-rate-limit");

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Configuration
const PORT = process.env.PORT || 3000;
const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://localhost:27017/kodeon-community";
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Connect to Redis
const redisClient = redis.createClient({
    url: REDIS_URL,
});

redisClient.on("error", (err) => {
    console.error("Redis Client Error", err);
});

redisClient.connect();

// Routes
app.get("/", (req, res) => {
    res.json({ message: "KODEON Global Community Platform API Server" });
});

app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// API Routes
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const questionRoutes = require("./routes/questions");
const mentorshipRoutes = require("./routes/mentorship");
const eventRoutes = require("./routes/events");

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/mentorship", mentorshipRoutes);
app.use("/api/events", eventRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

// Start server
server.listen(PORT, () => {
    console.log(
        `KODEON Global Community Platform server running on port ${PORT}`
    );
});

module.exports = { app, server, io, redisClient };
