const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
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
            "syntax",
            "compiler",
            "ide",
            "libraries",
            "mobile",
            "web",
            "ai",
            "cloud",
            "other",
        ],
        default: "general",
    },
    tags: [
        {
            type: String,
            trim: true,
        },
    ],
    views: {
        type: Number,
        default: 0,
    },
    votes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            vote: {
                type: Number,
                enum: [-1, 1], // -1 for downvote, 1 for upvote
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    answers: [
        {
            author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            content: {
                type: String,
                required: true,
            },
            isAccepted: {
                type: Boolean,
                default: false,
            },
            votes: [
                {
                    user: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User",
                    },
                    vote: {
                        type: Number,
                        enum: [-1, 1], // -1 for downvote, 1 for upvote
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
                },
            ],
            createdAt: {
                type: Date,
                default: Date.now,
            },
            updatedAt: {
                type: Date,
            },
        },
    ],
    isAnswered: {
        type: Boolean,
        default: false,
    },
    acceptedAnswer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question.answers",
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
QuestionSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Question", QuestionSchema);
