const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const redis = require("redis");
const CollaborationService = require("./services/collaborationService");

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration
const PORT = process.env.PORT || 3000;
const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://localhost:27017/kodeon-cloud";
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
    res.json({ message: "KODEON Cloud IDE API Server" });
});

app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// API Routes
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

// Initialize collaboration service
const collaborationService = new CollaborationService(io);

// Socket.io connection handling
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-project", (data) => {
        const { projectId, userId, username } = data;
        collaborationService.joinProject(
            socket.id,
            projectId,
            userId,
            username
        );
        console.log(`User ${socket.id} joined project ${projectId}`);
    });

    socket.on("leave-project", (projectId) => {
        collaborationService.leaveProject(socket.id, projectId);
        console.log(`User ${socket.id} left project ${projectId}`);
    });

    socket.on("code-change", (data) => {
        const { projectId, fileId, content, cursor, userId, username } = data;
        collaborationService.handleCodeChange(
            projectId,
            fileId,
            content,
            cursor,
            userId,
            username
        );
    });

    socket.on("cursor-move", (data) => {
        const { projectId, fileId, cursor, userId, username } = data;
        collaborationService.handleCursorMove(
            projectId,
            fileId,
            cursor,
            userId,
            username
        );
    });

    socket.on("chat-message", (data) => {
        const { projectId, message, userId, username } = data;
        collaborationService.sendChatMessage(
            projectId,
            message,
            userId,
            username
        );
    });

    socket.on("disconnect", () => {
        // Leave all rooms when disconnecting
        socket.rooms.forEach((roomId) => {
            if (roomId !== socket.id) {
                // Skip the default room
                collaborationService.leaveProject(socket.id, roomId);
            }
        });
        console.log("User disconnected:", socket.id);
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

// Start server
server.listen(PORT, () => {
    console.log(`KODEON Cloud IDE server running on port ${PORT}`);
});

module.exports = { app, server, io, redisClient };
