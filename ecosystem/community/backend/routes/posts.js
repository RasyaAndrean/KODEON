const express = require("express");
const router = express.Router();
const {
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost,
    addComment,
    likePost,
} = require("../controllers/postController");
const { authenticate } = require("../middleware/auth");

// Create a new post
router.post("/", authenticate, createPost);

// Get all posts
router.get("/", getPosts);

// Get a specific post
router.get("/:id", getPost);

// Update a post
router.put("/:id", authenticate, updatePost);

// Delete a post
router.delete("/:id", authenticate, deletePost);

// Add a comment to a post
router.post("/:id/comments", authenticate, addComment);

// Like a post
router.post("/:id/like", authenticate, likePost);

module.exports = router;
