import { useEffect, useState } from "react";
import "./QnA.css";

const QnA = () => {
    const [questions, setQuestions] = useState([]);
    const [showAskForm, setShowAskForm] = useState(false);
    const [newQuestion, setNewQuestion] = useState({
        title: "",
        content: "",
        tags: [],
    });
    const [newTag, setNewTag] = useState("");

    useEffect(() => {
        // Mock data for questions
        const mockQuestions = [
            {
                id: 1,
                title: "How to handle async operations in KODEON?",
                author: "newbie_coder",
                authorReputation: 42,
                content:
                    "I'm trying to understand how to properly handle async operations in KODEON. Can someone explain the best practices?",
                tags: ["async", "concurrency"],
                votes: 15,
                answers: 3,
                views: 124,
                timestamp: "2025-09-10T14:30:00Z",
                isAnswered: true,
            },
            {
                id: 2,
                title: "Best practices for error handling?",
                author: "experienced_dev",
                authorReputation: 890,
                content:
                    "What are the recommended approaches for error handling in KODEON applications?",
                tags: ["error-handling", "best-practices"],
                votes: 24,
                answers: 5,
                views: 256,
                timestamp: "2025-09-09T09:15:00Z",
                isAnswered: true,
            },
            {
                id: 3,
                title: "Performance optimization techniques?",
                author: "performance_guru",
                authorReputation: 1250,
                content:
                    "Looking for tips on optimizing KODEON application performance.",
                tags: ["performance", "optimization"],
                votes: 18,
                answers: 2,
                views: 189,
                timestamp: "2025-09-08T16:45:00Z",
                isAnswered: false,
            },
        ];

        setQuestions(mockQuestions);
    }, []);

    const handleAskQuestion = (e) => {
        e.preventDefault();
        // In a real implementation, this would create a new question via API
        console.log("Asking question:", newQuestion);
        setShowAskForm(false);
        setNewQuestion({
            title: "",
            content: "",
            tags: [],
        });
    };

    const handleAddTag = () => {
        if (newTag.trim() && !newQuestion.tags.includes(newTag.trim())) {
            setNewQuestion({
                ...newQuestion,
                tags: [...newQuestion.tags, newTag.trim()],
            });
            setNewTag("");
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setNewQuestion({
            ...newQuestion,
            tags: newQuestion.tags.filter((tag) => tag !== tagToRemove),
        });
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString();
    };

    return (
        <div className="qna-page">
            <div className="qna-header">
                <h1>Questions & Answers</h1>
                <button
                    className="ask-question-btn"
                    onClick={() => setShowAskForm(true)}
                >
                    Ask Question
                </button>
            </div>

            {showAskForm && (
                <div className="ask-question-modal">
                    <div className="modal-content">
                        <h2>Ask a Question</h2>
                        <form onSubmit={handleAskQuestion}>
                            <div className="form-group">
                                <label htmlFor="title">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={newQuestion.title}
                                    onChange={(e) =>
                                        setNewQuestion({
                                            ...newQuestion,
                                            title: e.target.value,
                                        })
                                    }
                                    placeholder="Be specific and imagine you're asking a friend"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="content">
                                    Question Details
                                </label>
                                <textarea
                                    id="content"
                                    value={newQuestion.content}
                                    onChange={(e) =>
                                        setNewQuestion({
                                            ...newQuestion,
                                            content: e.target.value,
                                        })
                                    }
                                    placeholder="Include all the information someone would need to answer your question"
                                    rows="6"
                                    required
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
                                        {newQuestion.tags.map((tag) => (
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
                                    Post Question
                                </button>
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setShowAskForm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="questions-list">
                {questions.map((question) => (
                    <div key={question.id} className="question-card">
                        <div className="question-stats">
                            <div className="stat">
                                <span className="stat-number">
                                    {question.votes}
                                </span>
                                <span className="stat-label">votes</span>
                            </div>
                            <div
                                className={`stat ${
                                    question.isAnswered ? "answered" : ""
                                }`}
                            >
                                <span className="stat-number">
                                    {question.answers}
                                </span>
                                <span className="stat-label">answers</span>
                            </div>
                            <div className="stat">
                                <span className="stat-number">
                                    {question.views}
                                </span>
                                <span className="stat-label">views</span>
                            </div>
                        </div>
                        <div className="question-content">
                            <h3 className="question-title">{question.title}</h3>
                            <p className="question-excerpt">
                                {question.content.substring(0, 150)}...
                            </p>
                            <div className="question-meta">
                                <div className="tags">
                                    {question.tags.map((tag) => (
                                        <span key={tag} className="tag">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="author-info">
                                    <span>{question.author}</span>
                                    <span className="reputation">
                                        ({question.authorReputation})
                                    </span>
                                    <span>
                                        {formatTime(question.timestamp)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QnA;
