const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET || "kodeon_community_secret_key",
        {
            expiresIn: "7d",
        }
    );
};

// Register a new user
exports.register = async (req, res) => {
    try {
        const { username, email, password, firstName, lastName } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            return res.status(400).json({
                error: "User with this email or username already exists",
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = new User({
            username,
            email,
            password: hashedPassword,
            firstName,
            lastName,
        });

        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                reputation: user.reputation,
                badges: user.badges,
            },
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Server error during registration" });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Update last login
        user.lastLogin = Date.now();
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                reputation: user.reputation,
                badges: user.badges,
                isMentor: user.isMentor,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error during login" });
    }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json({ user });
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            bio,
            location,
            website,
            skills,
            github,
            twitter,
            linkedin,
            isMentor,
            mentorshipAreas,
        } = req.body;

        const updates = {};
        if (firstName !== undefined) updates.firstName = firstName;
        if (lastName !== undefined) updates.lastName = lastName;
        if (bio !== undefined) updates.bio = bio;
        if (location !== undefined) updates.location = location;
        if (website !== undefined) updates.website = website;
        if (skills !== undefined) updates.skills = skills;
        if (github !== undefined) updates.github = github;
        if (twitter !== undefined) updates.twitter = twitter;
        if (linkedin !== undefined) updates.linkedin = linkedin;
        if (isMentor !== undefined) updates.isMentor = isMentor;
        if (mentorshipAreas !== undefined)
            updates.mentorshipAreas = mentorshipAreas;

        const user = await User.findByIdAndUpdate(req.user.id, updates, {
            new: true,
        }).select("-password");

        res.json({
            message: "Profile updated successfully",
            user,
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Get user profile by username
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.params.username,
        }).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ user });
    } catch (error) {
        console.error("Get user profile error:", error);
        res.status(500).json({ error: "Server error" });
    }
};
