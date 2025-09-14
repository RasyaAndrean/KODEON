const Event = require("../models/Event");
const User = require("../models/User");

// Create a new event
exports.createEvent = async (req, res) => {
    try {
        const {
            title,
            description,
            eventType,
            startDate,
            endDate,
            location,
            isVirtual,
            virtualLink,
            capacity,
            tags,
        } = req.body;

        // Validate dates
        if (new Date(startDate) >= new Date(endDate)) {
            return res
                .status(400)
                .json({ error: "End date must be after start date" });
        }

        // Create event
        const event = new Event({
            title,
            description,
            eventType,
            startDate,
            endDate,
            location,
            isVirtual,
            virtualLink,
            capacity,
            tags,
            organizer: req.user.id,
        });

        await event.save();

        // Populate organizer information
        await event.populate("organizer", "username firstName lastName avatar");

        res.status(201).json({
            message: "Event created successfully",
            event,
        });
    } catch (error) {
        console.error("Create event error:", error);
        res.status(500).json({ error: "Server error during event creation" });
    }
};

// Get all events with pagination
exports.getEvents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const eventType = req.query.eventType;
        const isFeatured = req.query.isFeatured;
        const sortBy = req.query.sortBy || "startDate";
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

        // Build filter
        const filter = { startDate: { $gte: new Date() } }; // Only future events
        if (eventType) {
            filter.eventType = eventType;
        }
        if (isFeatured !== undefined) {
            filter.isFeatured = isFeatured === "true";
        }

        // Build sort
        const sort = {};
        sort[sortBy] = sortOrder;

        // Get events
        const events = await Event.find(filter)
            .populate("organizer", "username firstName lastName avatar")
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit);

        // Get total count
        const total = await Event.countDocuments(filter);

        res.json({
            events,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Get events error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Get a specific event
exports.getEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate(
            "organizer",
            "username firstName lastName avatar"
        );

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        res.json({ event });
    } catch (error) {
        console.error("Get event error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Update an event
exports.updateEvent = async (req, res) => {
    try {
        const {
            title,
            description,
            eventType,
            startDate,
            endDate,
            location,
            isVirtual,
            virtualLink,
            capacity,
            tags,
            isFeatured,
        } = req.body;

        const event = await Event.findById(req.params.id);

        // Check if user is organizer
        if (event.organizer.toString() !== req.user.id) {
            return res.status(403).json({ error: "Access denied" });
        }

        // Validate dates if provided
        if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
            return res
                .status(400)
                .json({ error: "End date must be after start date" });
        }

        // Update event
        if (title !== undefined) event.title = title;
        if (description !== undefined) event.description = description;
        if (eventType !== undefined) event.eventType = eventType;
        if (startDate !== undefined) event.startDate = startDate;
        if (endDate !== undefined) event.endDate = endDate;
        if (location !== undefined) event.location = location;
        if (isVirtual !== undefined) event.isVirtual = isVirtual;
        if (virtualLink !== undefined) event.virtualLink = virtualLink;
        if (capacity !== undefined) event.capacity = capacity;
        if (tags !== undefined) event.tags = tags;
        if (isFeatured !== undefined) event.isFeatured = isFeatured;
        event.updatedAt = Date.now();

        await event.save();

        // Populate organizer information
        await event.populate("organizer", "username firstName lastName avatar");

        res.json({
            message: "Event updated successfully",
            event,
        });
    } catch (error) {
        console.error("Update event error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        // Check if user is organizer
        if (event.organizer.toString() !== req.user.id) {
            return res.status(403).json({ error: "Access denied" });
        }

        // Mark as deleted (soft delete)
        event.isDeleted = true;
        event.updatedAt = Date.now();

        await event.save();

        res.json({ message: "Event deleted successfully" });
    } catch (error) {
        console.error("Delete event error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Register for an event
exports.registerForEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        // Check if event is in the past
        if (new Date(event.startDate) < new Date()) {
            return res
                .status(400)
                .json({ error: "Cannot register for past events" });
        }

        // Check if user is already registered
        const existingRegistration = event.attendees.find(
            (attendee) => attendee.user.toString() === req.user.id
        );

        if (existingRegistration) {
            return res
                .status(400)
                .json({ error: "Already registered for this event" });
        }

        // Check capacity if set
        if (event.capacity && event.attendees.length >= event.capacity) {
            return res.status(400).json({ error: "Event is at full capacity" });
        }

        // Register user
        event.attendees.push({
            user: req.user.id,
            status: "registered",
            registeredAt: Date.now(),
        });

        await event.save();

        res.json({
            message: "Successfully registered for event",
            registration: {
                eventId: event._id,
                userId: req.user.id,
                status: "registered",
            },
        });
    } catch (error) {
        console.error("Register for event error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Cancel event registration
exports.cancelRegistration = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        // Find user's registration
        const registrationIndex = event.attendees.findIndex(
            (attendee) => attendee.user.toString() === req.user.id
        );

        if (registrationIndex === -1) {
            return res
                .status(400)
                .json({ error: "Not registered for this event" });
        }

        // Check if event is in the past
        if (new Date(event.startDate) < new Date()) {
            return res
                .status(400)
                .json({ error: "Cannot cancel registration for past events" });
        }

        // Cancel registration
        event.attendees[registrationIndex].status = "cancelled";
        event.attendees[registrationIndex].registeredAt = Date.now();

        await event.save();

        res.json({
            message: "Event registration cancelled successfully",
        });
    } catch (error) {
        console.error("Cancel registration error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Get events organized by user
exports.getOrganizedEvents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Get events organized by user
        const events = await Event.find({
            organizer: req.user.id,
            isDeleted: false,
        })
            .populate("organizer", "username firstName lastName avatar")
            .sort({ startDate: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        // Get total count
        const total = await Event.countDocuments({
            organizer: req.user.id,
            isDeleted: false,
        });

        res.json({
            events,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Get organized events error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Get events user is registered for
exports.getRegisteredEvents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Get events where user is registered
        const events = await Event.find({
            "attendees.user": req.user.id,
            "attendees.status": "registered",
            isDeleted: false,
        })
            .populate("organizer", "username firstName lastName avatar")
            .sort({ startDate: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        // Get total count
        const total = await Event.countDocuments({
            "attendees.user": req.user.id,
            "attendees.status": "registered",
            isDeleted: false,
        });

        res.json({
            events,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Get registered events error:", error);
        res.status(500).json({ error: "Server error" });
    }
};
