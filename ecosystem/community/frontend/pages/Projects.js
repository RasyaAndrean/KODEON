import { useEffect, useState } from "react";
import "./Projects.css";

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [showSubmitForm, setShowSubmitForm] = useState(false);
    const [newProject, setNewProject] = useState({
        title: "",
        description: "",
        tags: [],
        githubUrl: "",
        demoUrl: "",
    });
    const [newTag, setNewTag] = useState("");

    useEffect(() => {
        // Mock data for projects
        const mockProjects = [
            {
                id: 1,
                title: "KODEON Web Framework",
                description:
                    "A modern web framework built with KODEON that provides routing, middleware, and templating capabilities.",
                author: "john_doe",
                authorReputation: 1240,
                tags: ["web", "framework", "routing"],
                stars: 124,
                forks: 24,
                githubUrl: "https://github.com/john_doe/kodeon-web-framework",
                demoUrl: "https://kodeon-web-framework-demo.com",
                timestamp: "2025-09-01T10:30:00Z",
            },
            {
                id: 2,
                title: "Data Visualization Library",
                description:
                    "Beautiful charts and graphs for KODEON applications with interactive features.",
                author: "jane_smith",
                authorReputation: 890,
                tags: ["data", "visualization", "charts"],
                stars: 89,
                forks: 15,
                githubUrl: "https://github.com/jane_smith/kodeon-charts",
                demoUrl: "https://kodeon-charts-demo.com",
                timestamp: "2025-08-25T14:15:00Z",
            },
            {
                id: 3,
                title: "Authentication Service",
                description:
                    "A complete authentication solution with OAuth, JWT, and social login support.",
                author: "auth_expert",
                authorReputation: 2150,
                tags: ["auth", "security", "oauth"],
                stars: 256,
                forks: 42,
                githubUrl: "https://github.com/auth_expert/kodeon-auth",
                demoUrl: "https://kodeon-auth-demo.com",
                timestamp: "2025-08-20T09:45:00Z",
            },
        ];

        setProjects(mockProjects);
    }, []);

    const handleSubmitProject = (e) => {
        e.preventDefault();
        // In a real implementation, this would submit a new project via API
        console.log("Submitting project:", newProject);
        setShowSubmitForm(false);
        setNewProject({
            title: "",
            description: "",
            tags: [],
            githubUrl: "",
            demoUrl: "",
        });
    };

    const handleAddTag = () => {
        if (newTag.trim() && !newProject.tags.includes(newTag.trim())) {
            setNewProject({
                ...newProject,
                tags: [...newProject.tags, newTag.trim()],
            });
            setNewTag("");
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setNewProject({
            ...newProject,
            tags: newProject.tags.filter((tag) => tag !== tagToRemove),
        });
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString();
    };

    return (
        <div className="projects-page">
            <div className="projects-header">
                <h1>Project Showcase</h1>
                <button
                    className="submit-project-btn"
                    onClick={() => setShowSubmitForm(true)}
                >
                    Submit Project
                </button>
            </div>

            {showSubmitForm && (
                <div className="submit-project-modal">
                    <div className="modal-content">
                        <h2>Submit Your Project</h2>
                        <form onSubmit={handleSubmitProject}>
                            <div className="form-group">
                                <label htmlFor="title">Project Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={newProject.title}
                                    onChange={(e) =>
                                        setNewProject({
                                            ...newProject,
                                            title: e.target.value,
                                        })
                                    }
                                    placeholder="Enter your project title"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    value={newProject.description}
                                    onChange={(e) =>
                                        setNewProject({
                                            ...newProject,
                                            description: e.target.value,
                                        })
                                    }
                                    placeholder="Describe your project and its features"
                                    rows="4"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="githubUrl">
                                    GitHub Repository URL
                                </label>
                                <input
                                    type="url"
                                    id="githubUrl"
                                    value={newProject.githubUrl}
                                    onChange={(e) =>
                                        setNewProject({
                                            ...newProject,
                                            githubUrl: e.target.value,
                                        })
                                    }
                                    placeholder="https://github.com/username/repository"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="demoUrl">
                                    Demo/Website URL (optional)
                                </label>
                                <input
                                    type="url"
                                    id="demoUrl"
                                    value={newProject.demoUrl}
                                    onChange={(e) =>
                                        setNewProject({
                                            ...newProject,
                                            demoUrl: e.target.value,
                                        })
                                    }
                                    placeholder="https://your-project-demo.com"
                                />
                            </div>
                            <div className="form-group">
                                <label>Tags</label>
                                <div className="tags-input">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            value={newTag}
                                            onChange={(e) =>
                                                setNewTag(e.target.value)
                                            }
                                            placeholder="Add a tag"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddTag}
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="tags-list">
                                        {newProject.tags.map((tag) => (
                                            <span key={tag} className="tag">
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveTag(tag)
                                                    }
                                                    className="remove-tag"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="submit-btn">
                                    Submit Project
                                </button>
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setShowSubmitForm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="projects-grid">
                {projects.map((project) => (
                    <div key={project.id} className="project-card">
                        <div className="project-header">
                            <h3 className="project-title">{project.title}</h3>
                            <div className="project-stats">
                                <span className="stat">⭐ {project.stars}</span>
                                <span className="stat">⑂ {project.forks}</span>
                            </div>
                        </div>
                        <p className="project-description">
                            {project.description}
                        </p>
                        <div className="project-tags">
                            {project.tags.map((tag) => (
                                <span key={tag} className="tag">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div className="project-meta">
                            <div className="author-info">
                                <span>by {project.author}</span>
                                <span className="reputation">
                                    ({project.authorReputation})
                                </span>
                            </div>
                            <div className="project-links">
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    GitHub
                                </a>
                                {project.demoUrl && (
                                    <a
                                        href={project.demoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Demo
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Projects;
