const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    firstName: {
        type: String,
        trim: true,
        maxlength: 50,
    },
    lastName: {
        type: String,
        trim: true,
        maxlength: 50,
    },
    avatar: {
        type: String, // URL to avatar image
        default: null,
    },
    bio: {
        type: String,
        maxlength: 500,
    },
    location: {
        type: String,
        maxlength: 100,
    },
    website: {
        type: String,
        maxlength: 200,
    },
    skills: [
        {
            type: String,
            trim: true,
        },
    ],
    github: {
        type: String,
        maxlength: 100,
    },
    twitter: {
        type: String,
        maxlength: 100,
    },
    linkedin: {
        type: String,
        maxlength: 100,
    },
    reputation: {
        type: Number,
        default: 0,
    },
    badges: [
        {
            type: String,
            enum: [
                "beginner",
                "contributor",
                "expert",
                "mentor",
                "community-leader",
            ],
        },
    ],
    isMentor: {
        type: Boolean,
        default: false,
    },
    mentorshipAreas: [
        {
            type: String,
            trim: true,
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model("User", UserSchema);
