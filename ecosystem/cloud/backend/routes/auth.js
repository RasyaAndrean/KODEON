const express = require("express");
const router = express.Router();
const {
    register,
    login,
    getCurrentUser,
    updatePreferences,
} = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");

// Register a new user
router.post("/register", register);

// Login user
router.post("/login", login);

// Get current user (protected route)
router.get("/me", authenticate, getCurrentUser);

// Update user preferences (protected route)
router.put("/preferences", authenticate, updatePreferences);

module.exports = router;
