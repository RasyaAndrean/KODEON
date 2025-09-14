import { Link } from "react-router-dom";
import "./Header.css";

const Header = ({ currentUser, setCurrentUser, isConnected }) => {
    return (
        <header className="header">
            <div className="header-content">
                <div className="logo">
                    <Link to="/">
                        <h1>KODEON Community</h1>
                    </Link>
                </div>

                <nav className="main-nav">
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/forums">Forums</Link>
                        </li>
                        <li>
                            <Link to="/qna">Q&A</Link>
                        </li>
                        <li>
                            <Link to="/projects">Projects</Link>
                        </li>
                        <li>
                            <Link to="/events">Events</Link>
                        </li>
                        <li>
                            <Link to="/mentors">Mentors</Link>
                        </li>
                    </ul>
                </nav>

                <div className="user-actions">
                    {currentUser ? (
                        <div className="user-menu">
                            <Link to="/profile" className="username">
                                {currentUser.username}
                            </Link>
                            <button
                                className="logout-btn"
                                onClick={() => setCurrentUser(null)}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login">
                                <button className="login-btn">Login</button>
                            </Link>
                            <Link to="/register">
                                <button className="signup-btn">Sign Up</button>
                            </Link>
                        </div>
                    )}

                    <div className="connection-status">
                        {isConnected ? "Connected" : "Disconnected"}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
