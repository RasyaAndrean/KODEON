import { useEffect, useState } from "react";
import "./Home.css";

const Home = ({ currentUser }) => {
    const [stats, setStats] = useState({
        users: 0,
        projects: 0,
        questions: 0,
        events: 0,
    });

    const [featuredProjects, setFeaturedProjects] = useState([]);
    const [recentQuestions, setRecentQuestions] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);

    useEffect(() => {
        // In a real implementation, these would come from API calls
        setStats({
            users: 1250,
            projects: 342,
            questions: 890,
            events: 24,
        });

        // Mock data for featured projects
        setFeaturedProjects([
            {
                id: 1,
                title: "KODEON Web Framework",
                description: "A modern web framework built with KODEON",
                author: "john_doe",
                stars: 124,
                tags: ["web", "framework"],
            },
            {
                id: 2,
                title: "Data Visualization Library",
                description:
                    "Beautiful charts and graphs for KODEON applications",
                author: "jane_smith",
                stars: 89,
                tags: ["data", "visualization"],
            },
        ]);

        // Mock data for recent questions
        setRecentQuestions([
            {
                id: 1,
                title: "How to handle async operations in KODEON?",
                author: "newbie_coder",
                answers: 3,
                tags: ["async", "concurrency"],
            },
            {
                id: 2,
                title: "Best practices for error handling?",
                author: "experienced_dev",
                answers: 5,
                tags: ["error-handling", "best-practices"],
            },
        ]);

        // Mock data for upcoming events
        setUpcomingEvents([
            {
                id: 1,
                title: "KODEON Monthly Meetup",
                date: "2025-09-20",
                time: "18:00 UTC",
                location: "Online",
            },
            {
                id: 2,
                title: "Advanced KODEON Workshop",
                date: "2025-09-25",
                time: "14:00 UTC",
                location: "San Francisco, CA",
            },
        ]);
    }, []);

    return (
        <div className="home-page">
            <section className="hero">
                <h1>Welcome to the KODEON Community</h1>
                <p>
                    Connect, collaborate, and create with developers worldwide
                </p>
                {!currentUser && (
                    <div className="cta-buttons">
                        <button className="primary-btn">Join Community</button>
                        <button className="secondary-btn">Learn More</button>
                    </div>
                )}
            </section>

            <section className="community-stats">
                <div className="stat-card">
                    <h3>{stats.users}</h3>
                    <p>Developers</p>
                </div>
                <div className="stat-card">
                    <h3>{stats.projects}</h3>
                    <p>Projects</p>
                </div>
                <div className="stat-card">
                    <h3>{stats.questions}</h3>
                    <p>Questions Answered</p>
                </div>
                <div className="stat-card">
                    <h3>{stats.events}</h3>
                    <p>Events</p>
                </div>
            </section>

            <div className="content-grid">
                <section className="featured-projects">
                    <h2>Featured Projects</h2>
                    <div className="projects-list">
                        {featuredProjects.map((project) => (
                            <div key={project.id} className="project-card">
                                <h3>{project.title}</h3>
                                <p>{project.description}</p>
                                <div className="project-meta">
                                    <span>by {project.author}</span>
                                    <span>⭐ {project.stars}</span>
                                </div>
                                <div className="project-tags">
                                    {project.tags.map((tag) => (
                                        <span key={tag} className="tag">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="recent-activity">
                    <h2>Recent Activity</h2>
                    <div className="activity-section">
                        <h3>Latest Questions</h3>
                        <div className="questions-list">
                            {recentQuestions.map((question) => (
                                <div
                                    key={question.id}
                                    className="question-item"
                                >
                                    <h4>{question.title}</h4>
                                    <div className="question-meta">
                                        <span>by {question.author}</span>
                                        <span>{question.answers} answers</span>
                                    </div>
                                    <div className="question-tags">
                                        {question.tags.map((tag) => (
                                            <span key={tag} className="tag">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="activity-section">
                        <h3>Upcoming Events</h3>
                        <div className="events-list">
                            {upcomingEvents.map((event) => (
                                <div key={event.id} className="event-item">
                                    <h4>{event.title}</h4>
                                    <div className="event-details">
                                        <span>
                                            {event.date} at {event.time}
                                        </span>
                                        <span>{event.location}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;
