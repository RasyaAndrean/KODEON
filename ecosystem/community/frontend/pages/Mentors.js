import { useEffect, useState } from "react";
import "./Mentors.css";

const Mentors = () => {
    const [mentors, setMentors] = useState([]);
    const [mentees, setMentees] = useState([]);
    const [activeTab, setActiveTab] = useState("find-mentors");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [requestMessage, setRequestMessage] = useState("");

    useEffect(() => {
        // Mock data for mentors
        const mockMentors = [
            {
                id: 1,
                name: "John Doe",
                username: "john_doe",
                title: "Senior Software Engineer",
                company: "Tech Corp",
                skills: [
                    "Web Development",
                    "Database Design",
                    "System Architecture",
                ],
                mentorshipAreas: [
                    "Backend Development",
                    "Cloud Infrastructure",
                ],
                experience: "10+ years",
                rating: 4.8,
                reviews: 24,
                avatar: null,
                isAvailable: true,
            },
            {
                id: 2,
                name: "Jane Smith",
                username: "jane_smith",
                title: "Frontend Engineering Lead",
                company: "Design Studio",
                skills: ["React", "UI/UX", "Performance Optimization"],
                mentorshipAreas: ["Frontend Development", "UI/UX Design"],
                experience: "8+ years",
                rating: 4.9,
                reviews: 18,
                avatar: null,
                isAvailable: true,
            },
            {
                id: 3,
                name: "Robert Johnson",
                username: "rob_johnson",
                title: "DevOps Specialist",
                company: "Cloud Solutions Inc",
                skills: ["Docker", "Kubernetes", "CI/CD", "AWS"],
                mentorshipAreas: ["DevOps", "Cloud Infrastructure"],
                experience: "12+ years",
                rating: 4.7,
                reviews: 32,
                avatar: null,
                isAvailable: false,
            },
        ];

        // Mock data for mentees
        const mockMentees = [
            {
                id: 1,
                name: "Alice Brown",
                username: "alice_brown",
                goals: "Learn backend development with KODEON",
                skills: ["Beginner in KODEON", "Database basics"],
                availability: "Weekends",
                status: "pending",
            },
            {
                id: 2,
                name: "Mike Wilson",
                username: "mike_wilson",
                goals: "Improve frontend skills",
                skills: ["Intermediate React", "CSS"],
                availability: "Evenings",
                status: "active",
            },
        ];

        setMentors(mockMentors);
        setMentees(mockMentees);
    }, []);

    const filteredMentors = mentors.filter(
        (mentor) =>
            mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mentor.skills.some((skill) =>
                skill.toLowerCase().includes(searchTerm.toLowerCase())
            ) ||
            mentor.mentorshipAreas.some((area) =>
                area.toLowerCase().includes(searchTerm.toLowerCase())
            )
    );

    const handleSendRequest = () => {
        // In a real implementation, this would send a mentorship request via API
        console.log("Sending mentorship request to:", selectedMentor.name);
        console.log("Message:", requestMessage);
        setSelectedMentor(null);
        setRequestMessage("");
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "active":
                return "#4CAF50";
            case "pending":
                return "#FFC107";
            default:
                return "#9E9E9E";
        }
    };

    return (
        <div className="mentors-page">
            <div className="mentors-header">
                <h1>Mentorship Program</h1>
                <p>
                    Connect with experienced developers or find mentees to guide
                </p>
            </div>

            <div className="mentors-tabs">
                <button
                    className={`tab ${
                        activeTab === "find-mentors" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("find-mentors")}
                >
                    Find Mentors
                </button>
                <button
                    className={`tab ${
                        activeTab === "my-mentees" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("my-mentees")}
                >
                    My Mentees
                </button>
                <button
                    className={`tab ${
                        activeTab === "my-mentor" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("my-mentor")}
                >
                    My Mentor
                </button>
            </div>

            {activeTab === "find-mentors" && (
                <div className="mentors-content">
                    <div className="mentors-search">
                        <input
                            type="text"
                            placeholder="Search mentors by name, skills, or expertise..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <div className="mentors-grid">
                        {filteredMentors.map((mentor) => (
                            <div key={mentor.id} className="mentor-card">
                                <div className="mentor-header">
                                    <div className="mentor-avatar">
                                        {mentor.avatar ? (
                                            <img
                                                src={mentor.avatar}
                                                alt={mentor.name}
                                            />
                                        ) : (
                                            <div className="avatar-placeholder">
                                                {mentor.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mentor-info">
                                        <h3>{mentor.name}</h3>
                                        <p className="mentor-title">
                                            {mentor.title} at {mentor.company}
                                        </p>
                                        <div className="mentor-rating">
                                            <span>⭐ {mentor.rating}</span>
                                            <span>
                                                ({mentor.reviews} reviews)
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mentor-details">
                                    <div className="mentor-section">
                                        <h4>Skills</h4>
                                        <div className="skills-tags">
                                            {mentor.skills.map((skill) => (
                                                <span
                                                    key={skill}
                                                    className="skill-tag"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mentor-section">
                                        <h4>Mentorship Areas</h4>
                                        <div className="skills-tags">
                                            {mentor.mentorshipAreas.map(
                                                (area) => (
                                                    <span
                                                        key={area}
                                                        className="skill-tag"
                                                    >
                                                        {area}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    <div className="mentor-meta">
                                        <span>
                                            Experience: {mentor.experience}
                                        </span>
                                        <span
                                            className={`availability ${
                                                mentor.isAvailable
                                                    ? "available"
                                                    : "unavailable"
                                            }`}
                                        >
                                            {mentor.isAvailable
                                                ? "Available"
                                                : "Unavailable"}
                                        </span>
                                    </div>

                                    <button
                                        className="request-btn"
                                        onClick={() =>
                                            setSelectedMentor(mentor)
                                        }
                                        disabled={!mentor.isAvailable}
                                    >
                                        {mentor.isAvailable
                                            ? "Request Mentorship"
                                            : "Unavailable"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === "my-mentees" && (
                <div className="mentees-content">
                    <h2>My Mentees</h2>
                    {mentees.length > 0 ? (
                        <div className="mentees-list">
                            {mentees.map((mentee) => (
                                <div key={mentee.id} className="mentee-card">
                                    <div className="mentee-header">
                                        <h3>{mentee.name}</h3>
                                        <span
                                            className="mentee-status"
                                            style={{
                                                backgroundColor: getStatusColor(
                                                    mentee.status
                                                ),
                                            }}
                                        >
                                            {mentee.status}
                                        </span>
                                    </div>
                                    <div className="mentee-details">
                                        <p>
                                            <strong>Goals:</strong>{" "}
                                            {mentee.goals}
                                        </p>
                                        <p>
                                            <strong>Current Skills:</strong>{" "}
                                            {mentee.skills.join(", ")}
                                        </p>
                                        <p>
                                            <strong>Availability:</strong>{" "}
                                            {mentee.availability}
                                        </p>
                                    </div>
                                    <div className="mentee-actions">
                                        <button className="action-btn">
                                            Message
                                        </button>
                                        <button className="action-btn">
                                            View Progress
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>You don't have any mentees yet. Check back later!</p>
                    )}
                </div>
            )}

            {activeTab === "my-mentor" && (
                <div className="my-mentor-content">
                    <h2>My Mentor</h2>
                    <div className="mentor-relationship">
                        <p>You are currently not assigned to a mentor.</p>
                        <p>
                            Find and request a mentor from the "Find Mentors"
                            tab to get started!
                        </p>
                    </div>
                </div>
            )}

            {selectedMentor && (
                <div className="request-modal">
                    <div className="modal-content">
                        <h2>Request Mentorship from {selectedMentor.name}</h2>
                        <div className="mentor-preview">
                            <div className="mentor-avatar">
                                {selectedMentor.avatar ? (
                                    <img
                                        src={selectedMentor.avatar}
                                        alt={selectedMentor.name}
                                    />
                                ) : (
                                    <div className="avatar-placeholder">
                                        {selectedMentor.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="mentor-info">
                                <h3>{selectedMentor.name}</h3>
                                <p>
                                    {selectedMentor.title} at{" "}
                                    {selectedMentor.company}
                                </p>
                                <div className="mentor-rating">
                                    <span>⭐ {selectedMentor.rating}</span>
                                </div>
                            </div>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSendRequest();
                            }}
                        >
                            <div className="form-group">
                                <label htmlFor="message">
                                    Message (optional)
                                </label>
                                <textarea
                                    id="message"
                                    value={requestMessage}
                                    onChange={(e) =>
                                        setRequestMessage(e.target.value)
                                    }
                                    placeholder="Tell the mentor about your goals and what you hope to learn..."
                                    rows="4"
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="send-btn">
                                    Send Request
                                </button>
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setSelectedMentor(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Mentors;
