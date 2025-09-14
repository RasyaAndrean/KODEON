const Question = require("../models/Question");
const User = require("../models/User");

// Create a new question
exports.createQuestion = async (req, res) => {
    try {
        const { title, content, category, tags } = req.body;

        // Create question
        const question = new Question({
            title,
            content,
            category,
            tags,
            author: req.user.id,
        });

        await question.save();

        // Populate author information
        await question.populate("author", "username firstName lastName avatar");

        res.status(201).json({
            message: "Question created successfully",
            question,
        });
    } catch (error) {
        console.error("Create question error:", error);
        res.status(500).json({
            error: "Server error during question creation",
        });
    }
};

// Get all questions with pagination
exports.getQuestions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const category = req.query.category;
        const isAnswered = req.query.isAnswered;
        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

        // Build filter
        const filter = {};
        if (category) {
            filter.category = category;
        }
        if (isAnswered !== undefined) {
            filter.isAnswered = isAnswered === "true";
        }

        // Build sort
        const sort = {};
        sort[sortBy] = sortOrder;

        // Get questions
        const questions = await Question.find(filter)
            .populate("author", "username firstName lastName avatar")
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit);

        // Get total count
        const total = await Question.countDocuments(filter);

        res.json({
            questions,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Get questions error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Get a specific question
exports.getQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id)
            .populate("author", "username firstName lastName avatar")
            .populate("answers.author", "username firstName lastName avatar")
            .populate(
                "answers.comments.author",
                "username firstName lastName avatar"
            );

        if (!question) {
            return res.status(404).json({ error: "Question not found" });
        }

        // Increment view count
        question.views += 1;
        await question.save();

        res.json({ question });
    } catch (error) {
        console.error("Get question error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Update a question
exports.updateQuestion = async (req, res) => {
    try {
        const { title, content, category, tags } = req.body;

        const question = await Question.findById(req.params.id);

        // Check if user is author
        if (question.author.toString() !== req.user.id) {
            return res.status(403).json({ error: "Access denied" });
        }

        // Update question
        question.title = title || question.title;
        question.content = content || question.content;
        question.category = category || question.category;
        question.tags = tags || question.tags;
        question.updatedAt = Date.now();

        await question.save();

        // Populate author information
        await question.populate("author", "username firstName lastName avatar");

        res.json({
            message: "Question updated successfully",
            question,
        });
    } catch (error) {
        console.error("Update question error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Delete a question
exports.deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);

        // Check if user is author
        if (question.author.toString() !== req.user.id) {
            return res.status(403).json({ error: "Access denied" });
        }

        // Mark as deleted (soft delete)
        question.isDeleted = true;
        question.updatedAt = Date.now();

        await question.save();

        res.json({ message: "Question deleted successfully" });
    } catch (error) {
        console.error("Delete question error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Add an answer to a question
exports.addAnswer = async (req, res) => {
    try {
        const { content } = req.body;

        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({ error: "Question not found" });
        }

        // Add answer to question
        const newAnswer = {
            author: req.user.id,
            content,
            createdAt: Date.now(),
        };

        question.answers.push(newAnswer);
        question.updatedAt = Date.now();

        await question.save();

        // Populate author information for the new answer
        await question.populate({
            path: "answers.author",
            select: "username firstName lastName avatar",
        });

        // Get the newly added answer
        const addedAnswer = question.answers[question.answers.length - 1];

        res.status(201).json({
            message: "Answer added successfully",
            answer: addedAnswer,
        });
    } catch (error) {
        console.error("Add answer error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Vote on a question
exports.voteQuestion = async (req, res) => {
    try {
        const { vote } = req.body; // -1 for downvote, 1 for upvote

        if (vote !== -1 && vote !== 1) {
            return res.status(400).json({ error: "Invalid vote value" });
        }

        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({ error: "Question not found" });
        }

        // Check if user has already voted on this question
        const existingVote = question.votes.find(
            (v) => v.user.toString() === req.user.id
        );

        if (existingVote) {
            // Update existing vote
            existingVote.vote = vote;
        } else {
            // Add new vote
            question.votes.push({
                user: req.user.id,
                vote,
                createdAt: Date.now(),
            });
        }

        await question.save();

        // Calculate total votes
        const totalVotes = question.votes.reduce((sum, v) => sum + v.vote, 0);

        res.json({
            message: "Vote recorded successfully",
            totalVotes,
        });
    } catch (error) {
        console.error("Vote question error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Accept an answer
exports.acceptAnswer = async (req, res) => {
    try {
        const { answerId } = req.body;

        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({ error: "Question not found" });
        }

        // Check if user is the author of the question
        if (question.author.toString() !== req.user.id) {
            return res.status(403).json({ error: "Access denied" });
        }

        // Find the answer
        const answer = question.answers.id(answerId);

        if (!answer) {
            return res.status(404).json({ error: "Answer not found" });
        }

        // Mark answer as accepted
        answer.isAccepted = true;
        question.isAnswered = true;
        question.acceptedAnswer = answerId;
        question.updatedAt = Date.now();

        await question.save();

        res.json({
            message: "Answer accepted successfully",
            answer,
        });
    } catch (error) {
        console.error("Accept answer error:", error);
        res.status(500).json({ error: "Server error" });
    }
};
