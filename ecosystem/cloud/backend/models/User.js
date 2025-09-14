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
    projects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
        },
    ],
    preferences: {
        theme: {
            type: String,
            default: "dark",
            enum: ["light", "dark", "high-contrast"],
        },
        language: {
            type: String,
            default: "en",
            enum: ["en", "id"],
        },
        editor: {
            fontSize: {
                type: Number,
                default: 14,
            },
            tabSize: {
                type: Number,
                default: 2,
            },
            showLineNumbers: {
                type: Boolean,
                default: true,
            },
        },
    },
});

module.exports = mongoose.model("User", UserSchema);
