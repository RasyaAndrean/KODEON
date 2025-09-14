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
        trim: true,
        maxlength: 500,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    collaborators: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            role: {
                type: String,
                enum: ["viewer", "editor", "admin"],
                default: "viewer",
            },
            joinedAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    files: [
        {
            name: {
                type: String,
                required: true,
            },
            content: {
                type: String,
                default: "",
            },
            path: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
            updatedAt: {
                type: Date,
                default: Date.now,
            },
            isFolder: {
                type: Boolean,
                default: false,
            },
            parentFolder: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ProjectFile",
            },
        },
    ],
    visibility: {
        type: String,
        enum: ["private", "public", "unlisted"],
        default: "private",
    },
    tags: [
        {
            type: String,
            trim: true,
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
    lastAccessed: {
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
