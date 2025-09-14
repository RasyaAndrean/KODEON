const Mentorship = require("../models/Mentorship");
const User = require("../models/User");

// Request mentorship
exports.requestMentorship = async (req, res) => {
    try {
        const { mentorId, goals } = req.body;

        // Check if mentorship request already exists
        const existingRequest = await Mentorship.findOne({
            mentor: mentorId,
            mentee: req.user.id,
            status: { $in: ["pending", "active"] },
        });

        if (existingRequest) {
            return res.status(400).json({
                error: "Mentorship request already exists",
            });
        }

        // Check if the user is trying to mentor themselves
        if (mentorId.toString() === req.user.id) {
            return res.status(400).json({
                error: "You cannot request mentorship from yourself",
            });
        }

        // Create mentorship request
        const mentorship = new Mentorship({
            mentor: mentorId,
            mentee: req.user.id,
            goals: goals || [],
            status: "pending",
        });

        await mentorship.save();

        // Populate mentor and mentee information
        await mentorship.populate(
            "mentor",
            "username firstName lastName avatar isMentor"
        );
        await mentorship.populate(
            "mentee",
            "username firstName lastName avatar"
        );

        res.status(201).json({
            message: "Mentorship request sent successfully",
            mentorship,
        });
    } catch (error) {
        console.error("Request mentorship error:", error);
        res.status(500).json({
            error: "Server error during mentorship request",
        });
    }
};

// Get mentorship requests for current user (as mentor or mentee)
exports.getMentorshipRequests = async (req, res) => {
    try {
        const mentorships = await Mentorship.find({
            $or: [{ mentor: req.user.id }, { mentee: req.user.id }],
        })
            .populate("mentor", "username firstName lastName avatar")
            .populate("mentee", "username firstName lastName avatar")
            .sort({ createdAt: -1 });

        res.json({ mentorships });
    } catch (error) {
        console.error("Get mentorship requests error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Accept mentorship request
exports.acceptMentorship = async (req, res) => {
    try {
        const mentorship = await Mentorship.findById(req.params.id);

        // Check if user is the mentor
        if (mentorship.mentor.toString() !== req.user.id) {
            return res.status(403).json({ error: "Access denied" });
        }

        // Check if request is pending
        if (mentorship.status !== "pending") {
            return res
                .status(400)
                .json({ error: "Mentorship request is not pending" });
        }

        // Accept the request
        mentorship.status = "active";
        mentorship.startDate = Date.now();
        mentorship.updatedAt = Date.now();

        await mentorship.save();

        // Populate mentor and mentee information
        await mentorship.populate(
            "mentor",
            "username firstName lastName avatar"
        );
        await mentorship.populate(
            "mentee",
            "username firstName lastName avatar"
        );

        res.json({
            message: "Mentorship request accepted successfully",
            mentorship,
        });
    } catch (error) {
        console.error("Accept mentorship error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Reject mentorship request
exports.rejectMentorship = async (req, res) => {
    try {
        const mentorship = await Mentorship.findById(req.params.id);

        // Check if user is the mentor
        if (mentorship.mentor.toString() !== req.user.id) {
            return res.status(403).json({ error: "Access denied" });
        }

        // Check if request is pending
        if (mentorship.status !== "pending") {
            return res
                .status(400)
                .json({ error: "Mentorship request is not pending" });
        }

        // Reject the request
        mentorship.status = "rejected";
        mentorship.updatedAt = Date.now();

        await mentorship.save();

        res.json({
            message: "Mentorship request rejected successfully",
        });
    } catch (error) {
        console.error("Reject mentorship error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Cancel mentorship request (for mentee)
exports.cancelMentorship = async (req, res) => {
    try {
        const mentorship = await Mentorship.findById(req.params.id);

        // Check if user is the mentee
        if (mentorship.mentee.toString() !== req.user.id) {
            return res.status(403).json({ error: "Access denied" });
        }

        // Check if request is pending
        if (mentorship.status !== "pending") {
            return res
                .status(400)
                .json({ error: "Mentorship request is not pending" });
        }

        // Cancel the request
        mentorship.status = "cancelled";
        mentorship.updatedAt = Date.now();

        await mentorship.save();

        res.json({
            message: "Mentorship request cancelled successfully",
        });
    } catch (error) {
        console.error("Cancel mentorship error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// End mentorship relationship
exports.endMentorship = async (req, res) => {
    try {
        const mentorship = await Mentorship.findById(req.params.id);

        // Check if user is either mentor or mentee
        if (
            mentorship.mentor.toString() !== req.user.id &&
            mentorship.mentee.toString() !== req.user.id
        ) {
            return res.status(403).json({ error: "Access denied" });
        }

        // Check if mentorship is active
        if (mentorship.status !== "active") {
            return res.status(400).json({ error: "Mentorship is not active" });
        }

        // End the mentorship
        mentorship.status = "completed";
        mentorship.endDate = Date.now();
        mentorship.updatedAt = Date.now();

        await mentorship.save();

        res.json({
            message: "Mentorship ended successfully",
        });
    } catch (error) {
        console.error("End mentorship error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Add a session to mentorship
exports.addSession = async (req, res) => {
    try {
        const { date, duration, notes } = req.body;

        const mentorship = await Mentorship.findById(req.params.id);

        // Check if user is either mentor or mentee
        if (
            mentorship.mentor.toString() !== req.user.id &&
            mentorship.mentee.toString() !== req.user.id
        ) {
            return res.status(403).json({ error: "Access denied" });
        }

        // Check if mentorship is active
        if (mentorship.status !== "active") {
            return res.status(400).json({ error: "Mentorship is not active" });
        }

        // Add session
        const newSession = {
            date,
            duration,
            notes,
            isCompleted: false,
        };

        mentorship.sessions.push(newSession);
        mentorship.updatedAt = Date.now();

        await mentorship.save();

        // Get the newly added session
        const addedSession =
            mentorship.sessions[mentorship.sessions.length - 1];

        res.status(201).json({
            message: "Session added successfully",
            session: addedSession,
        });
    } catch (error) {
        console.error("Add session error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Send a message in mentorship
exports.sendMessage = async (req, res) => {
    try {
        const { content } = req.body;

        const mentorship = await Mentorship.findById(req.params.id);

        // Check if user is either mentor or mentee
        if (
            mentorship.mentor.toString() !== req.user.id &&
            mentorship.mentee.toString() !== req.user.id
        ) {
            return res.status(403).json({ error: "Access denied" });
        }

        // Check if mentorship is active
        if (mentorship.status !== "active") {
            return res.status(400).json({ error: "Mentorship is not active" });
        }

        // Add message
        const newMessage = {
            sender: req.user.id,
            content,
            createdAt: Date.now(),
        };

        mentorship.messages.push(newMessage);
        mentorship.updatedAt = Date.now();

        await mentorship.save();

        // Populate sender information for the new message
        await mentorship.populate({
            path: "messages.sender",
            select: "username firstName lastName avatar",
        });

        // Get the newly added message
        const addedMessage =
            mentorship.messages[mentorship.messages.length - 1];

        res.status(201).json({
            message: "Message sent successfully",
            message: addedMessage,
        });
    } catch (error) {
        console.error("Send message error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Get mentors (users who are available for mentorship)
exports.getMentors = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search;

        // Build filter
        const filter = { isMentor: true };
        if (search) {
            filter.$or = [
                { username: { $regex: search, $options: "i" } },
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { skills: { $regex: search, $options: "i" } },
            ];
        }

        // Get mentors
        const mentors = await User.find(filter)
            .select(
                "username firstName lastName avatar bio skills reputation badges isMentor"
            )
            .sort({ reputation: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        // Get total count
        const total = await User.countDocuments(filter);

        res.json({
            mentors,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Get mentors error:", error);
        res.status(500).json({ error: "Server error" });
    }
};
