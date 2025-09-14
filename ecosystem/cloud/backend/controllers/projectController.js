const Project = require("../models/Project");
const User = require("../models/User");

// Create a new project
exports.createProject = async (req, res) => {
    try {
        const { name, description, visibility = "private" } = req.body;

        // Create project
        const project = new Project({
            name,
            description,
            visibility,
            owner: req.user.id,
        });

        // Add default files
        project.files = [
            {
                name: "main.kodeon",
                content:
                    '// Welcome to KODEON!\n\nfunction main() {\n  print("Hello, KODEON!");\n}\n\nmain();',
                path: "main.kodeon",
            },
        ];

        await project.save();

        // Add project to user's projects
        await User.findByIdAndUpdate(req.user.id, {
            $push: { projects: project._id },
        });

        res.status(201).json({
            message: "Project created successfully",
            project,
        });
    } catch (error) {
        console.error("Create project error:", error);
        res.status(500).json({ error: "Server error during project creation" });
    }
};

// Get all projects for a user
exports.getUserProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            $or: [
                { owner: req.user.id },
                { "collaborators.user": req.user.id },
            ],
        }).populate("owner", "username firstName lastName");

        res.json({ projects });
    } catch (error) {
        console.error("Get projects error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Get a specific project
exports.getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate("owner", "username firstName lastName")
            .populate("collaborators.user", "username firstName lastName");

        // Check if user has access to this project
        if (
            project.owner.toString() !== req.user.id &&
            !project.collaborators.some(
                (collab) => collab.user.toString() === req.user.id
            )
        ) {
            return res.status(403).json({ error: "Access denied" });
        }

        res.json({ project });
    } catch (error) {
        console.error("Get project error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Update a project
exports.updateProject = async (req, res) => {
    try {
        const { name, description, visibility } = req.body;

        const project = await Project.findById(req.params.id);

        // Check if user is owner
        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({ error: "Access denied" });
        }

        // Update project
        project.name = name || project.name;
        project.description = description || project.description;
        project.visibility = visibility || project.visibility;
        project.updatedAt = Date.now();

        await project.save();

        res.json({
            message: "Project updated successfully",
            project,
        });
    } catch (error) {
        console.error("Update project error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Delete a project
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        // Check if user is owner
        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({ error: "Access denied" });
        }

        // Mark as deleted (soft delete)
        project.isDeleted = true;
        project.updatedAt = Date.now();

        await project.save();

        // Remove project from user's projects
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { projects: project._id },
        });

        res.json({ message: "Project deleted successfully" });
    } catch (error) {
        console.error("Delete project error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Add a file to a project
exports.addFile = async (req, res) => {
    try {
        const {
            name,
            content = "",
            path,
            isFolder = false,
            parentFolder = null,
        } = req.body;

        const project = await Project.findById(req.params.id);

        // Check if user has access to this project
        if (
            project.owner.toString() !== req.user.id &&
            !project.collaborators.some(
                (collab) =>
                    collab.user.toString() === req.user.id &&
                    (collab.role === "editor" || collab.role === "admin")
            )
        ) {
            return res.status(403).json({ error: "Access denied" });
        }

        // Add file to project
        const newFile = {
            name,
            content,
            path,
            isFolder,
            parentFolder,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        project.files.push(newFile);
        project.updatedAt = Date.now();

        await project.save();

        res.status(201).json({
            message: "File added successfully",
            file: newFile,
        });
    } catch (error) {
        console.error("Add file error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Update a file in a project
exports.updateFile = async (req, res) => {
    try {
        const { fileId } = req.params;
        const { content } = req.body;

        const project = await Project.findById(req.params.id);

        // Check if user has access to this project
        if (
            project.owner.toString() !== req.user.id &&
            !project.collaborators.some(
                (collab) =>
                    collab.user.toString() === req.user.id &&
                    (collab.role === "editor" || collab.role === "admin")
            )
        ) {
            return res.status(403).json({ error: "Access denied" });
        }

        // Find and update file
        const file = project.files.id(fileId);
        if (!file) {
            return res.status(404).json({ error: "File not found" });
        }

        file.content = content;
        file.updatedAt = Date.now();
        project.updatedAt = Date.now();

        await project.save();

        res.json({
            message: "File updated successfully",
            file,
        });
    } catch (error) {
        console.error("Update file error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Delete a file from a project
exports.deleteFile = async (req, res) => {
    try {
        const { fileId } = req.params;

        const project = await Project.findById(req.params.id);

        // Check if user has access to this project
        if (
            project.owner.toString() !== req.user.id &&
            !project.collaborators.some(
                (collab) =>
                    collab.user.toString() === req.user.id &&
                    (collab.role === "editor" || collab.role === "admin")
            )
        ) {
            return res.status(403).json({ error: "Access denied" });
        }

        // Remove file from project
        project.files = project.files.filter(
            (file) => file._id.toString() !== fileId
        );
        project.updatedAt = Date.now();

        await project.save();

        res.json({ message: "File deleted successfully" });
    } catch (error) {
        console.error("Delete file error:", error);
        res.status(500).json({ error: "Server error" });
    }
};
