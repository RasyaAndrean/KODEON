import { useEffect, useState } from "react";
import "./Forums.css";

const Forums = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [threads, setThreads] = useState([]);
    const [showNewThreadForm, setShowNewThreadForm] = useState(false);
    const [newThread, setNewThread] = useState({
        title: "",
        content: "",
        category: "",
    });

    useEffect(() => {
        // Mock data for forum categories
        const mockCategories = [
            {
                id: 1,
                name: "General Discussion",
                description: "Talk about anything KODEON related",
                threads: 124,
                posts: 567,
            },
            {
                id: 2,
                name: "Help & Support",
                description: "Get help with KODEON development",
                threads: 89,
                posts: 342,
            },
            {
                id: 3,
                name: "Feature Requests",
                description: "Suggest new features for KODEON",
                threads: 45,
                posts: 123,
            },
            {
                id: 4,
                name: "Show & Tell",
                description: "Show off your KODEON projects",
                threads: 67,
                posts: 234,
            },
        ];

        setCategories(mockCategories);

        // Mock data for threads
        const mockThreads = [
            {
                id: 1,
                title: "Welcome to the KODEON Community Forums!",
                author: "admin",
                replies: 24,
                views: 345,
                lastPost: "2025-09-10",
                category: "General Discussion",
            },
            {
                id: 2,
                title: "Best practices for async programming in KODEON",
                author: "john_doe",
                replies: 12,
                views: 156,
                lastPost: "2025-09-09",
                category: "Help & Support",
            },
            {
                id: 3,
                title: "New syntax proposal for pattern matching",
                author: "jane_smith",
                replies: 34,
                views: 456,
                lastPost: "2025-09-08",
                category: "Feature Requests",
            },
        ];

        setThreads(mockThreads);
    }, []);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        // In a real implementation, this would fetch threads for the selected category
    };

    const handleNewThreadChange = (e) => {
        const { name, value } = e.target;
        setNewThread({
            ...newThread,
            [name]: value,
        });
    };

    const handleCreateThread = (e) => {
        e.preventDefault();
        // In a real implementation, this would create a new thread via API
        console.log("Creating new thread:", newThread);
        setShowNewThreadForm(false);
        setNewThread({
            title: "",
            content: "",
            category: selectedCategory?.name || "",
        });
    };

    return (
        <div className="forums-page">
            <div className="forums-header">
                <h1>Community Forums</h1>
                <button
                    className="new-thread-btn"
                    onClick={() => setShowNewThreadForm(true)}
                >
                    New Thread
                </button>
            </div>

            {showNewThreadForm && (
                <div className="new-thread-modal">
                    <div className="modal-content">
                        <h2>Create New Thread</h2>
                        <form onSubmit={handleCreateThread}>
                            <div className="form-group">
                                <label htmlFor="title">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={newThread.title}
                                    onChange={handleNewThreadChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="category">Category</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={newThread.category}
                                    onChange={handleNewThreadChange}
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.name}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="content">Content</label>
                                <textarea
                                    id="content"
                                    name="content"
                                    value={newThread.content}
                                    onChange={handleNewThreadChange}
                                    rows="6"
                                    required
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="submit-btn">
                                    Create Thread
                                </button>
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setShowNewThreadForm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="forums-content">
                <div className="categories-sidebar">
                    <h2>Categories</h2>
                    <ul className="categories-list">
                        {categories.map((category) => (
                            <li
                                key={category.id}
                                className={`category-item ${
                                    selectedCategory?.id === category.id
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() => handleCategorySelect(category)}
                            >
                                <h3>{category.name}</h3>
                                <p>{category.description}</p>
                                <div className="category-stats">
                                    <span>{category.threads} threads</span>
                                    <span>{category.posts} posts</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="threads-main">
                    <div className="threads-header">
                        <h2>
                            {selectedCategory
                                ? selectedCategory.name
                                : "All Threads"}
                        </h2>
                        {selectedCategory && (
                            <p>{selectedCategory.description}</p>
                        )}
                    </div>

                    <div className="threads-list">
                        {threads
                            .filter(
                                (thread) =>
                                    !selectedCategory ||
                                    thread.category === selectedCategory.name
                            )
                            .map((thread) => (
                                <div key={thread.id} className="thread-item">
                                    <div className="thread-info">
                                        <h3 className="thread-title">
                                            {thread.title}
                                        </h3>
                                        <div className="thread-meta">
                                            <span>by {thread.author}</span>
                                            <span>
                                                Last post: {thread.lastPost}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="thread-stats">
                                        <div className="stat">
                                            <span className="stat-number">
                                                {thread.replies}
                                            </span>
                                            <span className="stat-label">
                                                Replies
                                            </span>
                                        </div>
                                        <div className="stat">
                                            <span className="stat-number">
                                                {thread.views}
                                            </span>
                                            <span className="stat-label">
                                                Views
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Forums;
