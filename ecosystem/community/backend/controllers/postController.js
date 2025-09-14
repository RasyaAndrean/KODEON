const Post = require("../models/Post");
const User = require("../models/User");

// Create a new post
exports.createPost = async (req, res) => {
    try {
        const { title, content, category, tags } = req.body;

        // Create post
        const post = new Post({
            title,
            content,
            category,
            tags,
            author: req.user.id,
        });

        await post.save();

        // Populate author information
        await post.populate("author", "username firstName lastName avatar");

        res.status(201).json({
            message: "Post created successfully",
            post,
        });
    } catch (error) {
        console.error("Create post error:", error);
        res.status(500).json({ error: "Server error during post creation" });
    }
};

// Get all posts with pagination
exports.getPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const category = req.query.category;
        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

        // Build filter
        const filter = {};
        if (category) {
            filter.category = category;
        }

        // Build sort
        const sort = {};
        sort[sortBy] = sortOrder;

        // Get posts
        const posts = await Post.find(filter)
            .populate("author", "username firstName lastName avatar")
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit);

        // Get total count
        const total = await Post.countDocuments(filter);

        res.json({
            posts,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Get posts error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Get a specific post
exports.getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("author", "username firstName lastName avatar")
            .populate("comments.author", "username firstName lastName avatar");

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Increment view count
        post.views += 1;
        await post.save();

        res.json({ post });
    } catch (error) {
        console.error("Get post error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Update a post
exports.updatePost = async (req, res) => {
    try {
        const { title, content, category, tags } = req.body;

        const post = await Post.findById(req.params.id);

        // Check if user is author
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ error: "Access denied" });
        }

        // Update post
        post.title = title || post.title;
        post.content = content || post.content;
        post.category = category || post.category;
        post.tags = tags || post.tags;
        post.updatedAt = Date.now();

        await post.save();

        // Populate author information
        await post.populate("author", "username firstName lastName avatar");

        res.json({
            message: "Post updated successfully",
            post,
        });
    } catch (error) {
        console.error("Update post error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Delete a post
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Check if user is author
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ error: "Access denied" });
        }

        // Mark as deleted (soft delete)
        post.isDeleted = true;
        post.updatedAt = Date.now();

        await post.save();

        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Delete post error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Add a comment to a post
exports.addComment = async (req, res) => {
    try {
        const { content } = req.body;

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Add comment to post
        const newComment = {
            author: req.user.id,
            content,
            createdAt: Date.now(),
        };

        post.comments.push(newComment);
        post.updatedAt = Date.now();

        await post.save();

        // Populate author information for the new comment
        await post.populate({
            path: "comments.author",
            select: "username firstName lastName avatar",
        });

        // Get the newly added comment
        const addedComment = post.comments[post.comments.length - 1];

        res.status(201).json({
            message: "Comment added successfully",
            comment: addedComment,
        });
    } catch (error) {
        console.error("Add comment error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Like a post
exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Check if user has already liked the post
        const existingLike = post.likes.find(
            (like) => like.user.toString() === req.user.id
        );

        if (existingLike) {
            // Unlike the post
            post.likes = post.likes.filter(
                (like) => like.user.toString() !== req.user.id
            );
        } else {
            // Like the post
            post.likes.push({
                user: req.user.id,
                createdAt: Date.now(),
            });
        }

        await post.save();

        res.json({
            message: existingLike
                ? "Post unliked successfully"
                : "Post liked successfully",
            likesCount: post.likes.length,
        });
    } catch (error) {
        console.error("Like post error:", error);
        res.status(500).json({ error: "Server error" });
    }
};
