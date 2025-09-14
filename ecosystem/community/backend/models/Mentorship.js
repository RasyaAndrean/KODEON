const mongoose = require("mongoose");

const MentorshipSchema = new mongoose.Schema({
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    mentee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: [
            "pending",
            "accepted",
            "rejected",
            "active",
            "completed",
            "cancelled",
        ],
        default: "pending",
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    goals: [
        {
            description: {
                type: String,
                required: true,
                maxlength: 200,
            },
            isCompleted: {
                type: Boolean,
                default: false,
            },
            completedDate: {
                type: Date,
            },
        },
    ],
    sessions: [
        {
            date: {
                type: Date,
                required: true,
            },
            duration: {
                type: Number, // in minutes
                required: true,
            },
            notes: {
                type: String,
            },
            isCompleted: {
                type: Boolean,
                default: false,
            },
        },
    ],
    messages: [
        {
            sender: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            content: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    feedback: {
        type: String,
        maxlength: 1000,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Update the updatedAt field before saving
MentorshipSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Mentorship", MentorshipSchema);
