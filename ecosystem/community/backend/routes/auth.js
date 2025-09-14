const express = require("express");
const router = express.Router();
const {
    register,
    login,
    getCurrentUser,
    updateProfile,
    getUserProfile,
} = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");

// Register a new user
router.post("/register", register);

// Login user
router.post("/login", login);

// Get current user (protected route)
router.get("/me", authenticate, getCurrentUser);

// Update user profile (protected route)
router.put("/profile", authenticate, updateProfile);

// Get user profile by username (public route)
router.get("/profile/:username", getUserProfile);

module.exports = router;
