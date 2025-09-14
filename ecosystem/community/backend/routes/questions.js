const express = require("express");
const router = express.Router();
const {
    createQuestion,
    getQuestions,
    getQuestion,
    updateQuestion,
    deleteQuestion,
    addAnswer,
    voteQuestion,
    acceptAnswer,
} = require("../controllers/questionController");
const { authenticate } = require("../middleware/auth");

// Create a new question
router.post("/", authenticate, createQuestion);

// Get all questions
router.get("/", getQuestions);

// Get a specific question
router.get("/:id", getQuestion);

// Update a question
router.put("/:id", authenticate, updateQuestion);

// Delete a question
router.delete("/:id", authenticate, deleteQuestion);

// Add an answer to a question
router.post("/:id/answers", authenticate, addAnswer);

// Vote on a question
router.post("/:id/vote", authenticate, voteQuestion);

// Accept an answer
router.post("/:id/accept", authenticate, acceptAnswer);

module.exports = router;
