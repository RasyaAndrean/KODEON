import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Login = ({ setCurrentUser }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // In a real implementation, this would be an API call
            // const response = await fetch('/api/auth/login', {
            //   method: 'POST',
            //   headers: {
            //     'Content-Type': 'application/json'
            //   },
            //   body: JSON.stringify(formData)
            // });
            //
            // const data = await response.json();
            //
            // if (response.ok) {
            //   setCurrentUser(data.user);
            //   localStorage.setItem('token', data.token);
            //   navigate('/');
            // } else {
            //   setError(data.error || 'Login failed');
            // }

            // Mock implementation for now
            setTimeout(() => {
                const mockUser = {
                    id: 1,
                    username: "testuser",
                    email: formData.email,
                    firstName: "Test",
                    lastName: "User",
                    reputation: 100,
                    badges: ["beginner"],
                };
                setCurrentUser(mockUser);
                navigate("/");
                setLoading(false);
            }, 1000);
        } catch (err) {
            setError("An error occurred during login");
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2>Login to KODEON Community</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <div className="auth-footer">
                    <p>
                        Don't have an account? <a href="/register">Sign up</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
