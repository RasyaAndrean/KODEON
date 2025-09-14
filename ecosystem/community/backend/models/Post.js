const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: [
            "general",
            "beginners",
            "advanced",
            "projects",
            "qna",
            "announcements",
            "events",
        ],
        default: "general",
    },
    tags: [
        {
            type: String,
            trim: true,
        },
    ],
    isPinned: {
        type: Boolean,
        default: false,
    },
    views: {
        type: Number,
        default: 0,
    },
    likes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    comments: [
        {
            author: {
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
            updatedAt: {
                type: Date,
            },
            likes: [
                {
                    user: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User",
                    },
                    createdAt: {
                        type: Date,
                        default: Date.now,
                    },
                },
            ],
        },
    ],
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
PostSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Post", PostSchema);
