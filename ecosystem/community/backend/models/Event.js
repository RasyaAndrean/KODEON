const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000,
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    eventType: {
        type: String,
        required: true,
        enum: [
            "webinar",
            "workshop",
            "meetup",
            "conference",
            "hackathon",
            "other",
        ],
        default: "meetup",
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        maxlength: 200,
    },
    isVirtual: {
        type: Boolean,
        default: false,
    },
    virtualLink: {
        type: String,
        maxlength: 500,
    },
    capacity: {
        type: Number,
    },
    attendees: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            status: {
                type: String,
                enum: ["registered", "attended", "cancelled"],
                default: "registered",
            },
            registeredAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    tags: [
        {
            type: String,
            trim: true,
        },
    ],
    isFeatured: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
});

// Update the updatedAt field before saving
EventSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Event", EventSchema);
