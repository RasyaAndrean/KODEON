const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    repositoryUrl: {
        type: String,
        maxlength: 500,
    },
    demoUrl: {
        type: String,
        maxlength: 500,
    },
    screenshots: [
        {
            url: {
                type: String,
                required: true,
            },
            caption: {
                type: String,
                maxlength: 200,
            },
        },
    ],
    tags: [
        {
            type: String,
            trim: true,
        },
    ],
    license: {
        type: String,
        maxlength: 50,
    },
    language: {
        type: String,
        maxlength: 50,
    },
    stars: [
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
    downloads: {
        type: Number,
        default: 0,
    },
    views: {
        type: Number,
        default: 0,
    },
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
ProjectSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Project", ProjectSchema);
