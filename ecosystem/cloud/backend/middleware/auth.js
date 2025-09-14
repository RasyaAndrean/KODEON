const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Authentication middleware
exports.authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Authentication required" });
        }

        // Extract token
        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "kodeon_secret_key"
        );

        // Get user from token
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ error: "Invalid token" });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ error: "Invalid or expired token" });
    }
};

// Authorization middleware for admin users
exports.authorizeAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
    }

    next();
};
