const express = require("express");
const router = express.Router();
const {
    createProject,
    getUserProjects,
    getProject,
    updateProject,
    deleteProject,
    addFile,
    updateFile,
    deleteFile,
} = require("../controllers/projectController");
const { authenticate } = require("../middleware/auth");

// Create a new project
router.post("/", authenticate, createProject);

// Get all projects for a user
router.get("/", authenticate, getUserProjects);

// Get a specific project
router.get("/:id", authenticate, getProject);

// Update a project
router.put("/:id", authenticate, updateProject);

// Delete a project
router.delete("/:id", authenticate, deleteProject);

// Add a file to a project
router.post("/:id/files", authenticate, addFile);

// Update a file in a project
router.put("/:id/files/:fileId", authenticate, updateFile);

// Delete a file from a project
router.delete("/:id/files/:fileId", authenticate, deleteFile);

module.exports = router;
