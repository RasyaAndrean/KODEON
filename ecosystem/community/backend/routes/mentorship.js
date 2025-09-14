const express = require("express");
const router = express.Router();
const {
    requestMentorship,
    getMentorshipRequests,
    acceptMentorship,
    rejectMentorship,
    cancelMentorship,
    endMentorship,
    addSession,
    sendMessage,
    getMentors,
} = require("../controllers/mentorshipController");
const { authenticate } = require("../middleware/auth");

// Request mentorship
router.post("/request", authenticate, requestMentorship);

// Get mentorship requests for current user
router.get("/requests", authenticate, getMentorshipRequests);

// Accept mentorship request
router.put("/:id/accept", authenticate, acceptMentorship);

// Reject mentorship request
router.put("/:id/reject", authenticate, rejectMentorship);

// Cancel mentorship request (for mentee)
router.put("/:id/cancel", authenticate, cancelMentorship);

// End mentorship relationship
router.put("/:id/end", authenticate, endMentorship);

// Add a session to mentorship
router.post("/:id/sessions", authenticate, addSession);

// Send a message in mentorship
router.post("/:id/messages", authenticate, sendMessage);

// Get mentors
router.get("/mentors", getMentors);

module.exports = router;
