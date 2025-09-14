import { useEffect, useState } from "react";
import "./Events.css";

const Events = () => {
    const [events, setEvents] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        isOnline: false,
        maxAttendees: "",
    });

    useEffect(() => {
        // Mock data for events
        const mockEvents = [
            {
                id: 1,
                title: "KODEON Monthly Meetup",
                description:
                    "Monthly community gathering to discuss the latest in KODEON development.",
                date: "2025-09-20",
                time: "18:00",
                location: "Online",
                isOnline: true,
                attendees: 45,
                maxAttendees: 100,
                organizer: "community_team",
            },
            {
                id: 2,
                title: "Advanced KODEON Workshop",
                description:
                    "Hands-on workshop covering advanced KODEON features and best practices.",
                date: "2025-09-25",
                time: "14:00",
                location: "San Francisco, CA",
                isOnline: false,
                attendees: 28,
                maxAttendees: 50,
                organizer: "john_doe",
            },
            {
                id: 3,
                title: "KODEON Hackathon",
                description:
                    "24-hour hackathon to build amazing projects with KODEON.",
                date: "2025-10-05",
                time: "09:00",
                location: "Online",
                isOnline: true,
                attendees: 120,
                maxAttendees: 200,
                organizer: "hackathon_org",
            },
        ];

        setEvents(mockEvents);
    }, []);

    const handleCreateEvent = (e) => {
        e.preventDefault();
        // In a real implementation, this would create a new event via API
        console.log("Creating event:", newEvent);
        setShowCreateForm(false);
        setNewEvent({
            title: "",
            description: "",
            date: "",
            time: "",
            location: "",
            isOnline: false,
            maxAttendees: "",
        });
    };

    const handleAttendEvent = (eventId) => {
        // In a real implementation, this would register the user for the event via API
        console.log("Attending event:", eventId);
    };

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const isEventPast = (dateString) => {
        return new Date(dateString) < new Date();
    };

    return (
        <div className="events-page">
            <div className="events-header">
                <h1>Community Events</h1>
                <button
                    className="create-event-btn"
                    onClick={() => setShowCreateForm(true)}
                >
                    Create Event
                </button>
            </div>

            {showCreateForm && (
                <div className="create-event-modal">
                    <div className="modal-content">
                        <h2>Create New Event</h2>
                        <form onSubmit={handleCreateEvent}>
                            <div className="form-group">
                                <label htmlFor="title">Event Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={newEvent.title}
                                    onChange={(e) =>
                                        setNewEvent({
                                            ...newEvent,
                                            title: e.target.value,
                                        })
                                    }
                                    placeholder="Enter event title"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    value={newEvent.description}
                                    onChange={(e) =>
                                        setNewEvent({
                                            ...newEvent,
                                            description: e.target.value,
                                        })
                                    }
                                    placeholder="Describe your event"
                                    rows="4"
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="date">Date</label>
                                    <input
                                        type="date"
                                        id="date"
                                        value={newEvent.date}
                                        onChange={(e) =>
                                            setNewEvent({
                                                ...newEvent,
                                                date: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="time">Time</label>
                                    <input
                                        type="time"
                                        id="time"
                                        value={newEvent.time}
                                        onChange={(e) =>
                                            setNewEvent({
                                                ...newEvent,
                                                time: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={newEvent.isOnline}
                                        onChange={(e) =>
                                            setNewEvent({
                                                ...newEvent,
                                                isOnline: e.target.checked,
                                            })
                                        }
                                    />
                                    This is an online event
                                </label>
                            </div>
                            <div className="form-group">
                                <label htmlFor="location">Location</label>
                                <input
                                    type="text"
                                    id="location"
                                    value={newEvent.location}
                                    onChange={(e) =>
                                        setNewEvent({
                                            ...newEvent,
                                            location: e.target.value,
                                        })
                                    }
                                    placeholder={
                                        newEvent.isOnline
                                            ? "Online meeting link"
                                            : "Physical address"
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="maxAttendees">
                                    Maximum Attendees (optional)
                                </label>
                                <input
                                    type="number"
                                    id="maxAttendees"
                                    value={newEvent.maxAttendees}
                                    onChange={(e) =>
                                        setNewEvent({
                                            ...newEvent,
                                            maxAttendees: e.target.value,
                                        })
                                    }
                                    placeholder="Leave blank for unlimited"
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="submit-btn">
                                    Create Event
                                </button>
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setShowCreateForm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="events-list">
                {events.map((event) => (
                    <div
                        key={event.id}
                        className={`event-card ${
                            isEventPast(event.date) ? "past-event" : ""
                        }`}
                    >
                        <div className="event-date">
                            <div className="date-day">
                                {new Date(event.date).getDate()}
                            </div>
                            <div className="date-month">
                                {new Date(event.date).toLocaleString(
                                    "default",
                                    { month: "short" }
                                )}
                            </div>
                        </div>
                        <div className="event-details">
                            <h3 className="event-title">{event.title}</h3>
                            <p className="event-description">
                                {event.description}
                            </p>
                            <div className="event-meta">
                                <div className="event-info">
                                    <span>
                                        📅 {formatDate(event.date)} at{" "}
                                        {event.time}
                                    </span>
                                    <span>📍 {event.location}</span>
                                    <span>👤 by {event.organizer}</span>
                                </div>
                                <div className="event-attendance">
                                    <span>
                                        👥 {event.attendees}/
                                        {event.maxAttendees || "∞"} attending
                                    </span>
                                </div>
                            </div>
                            {!isEventPast(event.date) && (
                                <button
                                    className="attend-btn"
                                    onClick={() => handleAttendEvent(event.id)}
                                >
                                    Attend Event
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Events;
