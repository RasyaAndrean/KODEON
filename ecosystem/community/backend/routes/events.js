const express = require("express");
const router = express.Router();
const {
    createEvent,
    getEvents,
    getEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    cancelRegistration,
    getOrganizedEvents,
    getRegisteredEvents,
} = require("../controllers/eventController");
const { authenticate } = require("../middleware/auth");

// Create a new event
router.post("/", authenticate, createEvent);

// Get all events
router.get("/", getEvents);

// Get a specific event
router.get("/:id", getEvent);

// Update an event
router.put("/:id", authenticate, updateEvent);

// Delete an event
router.delete("/:id", authenticate, deleteEvent);

// Register for an event
router.post("/:id/register", authenticate, registerForEvent);

// Cancel event registration
router.delete("/:id/register", authenticate, cancelRegistration);

// Get events organized by user
router.get("/organized", authenticate, getOrganizedEvents);

// Get events user is registered for
router.get("/registered", authenticate, getRegisteredEvents);

module.exports = router;
