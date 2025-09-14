import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Register = ({ setCurrentUser }) => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
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

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // In a real implementation, this would be an API call
            // const response = await fetch('/api/auth/register', {
            //   method: 'POST',
            //   headers: {
            //     'Content-Type': 'application/json'
            //   },
            //   body: JSON.stringify({
            //     username: formData.username,
            //     email: formData.email,
            //     password: formData.password,
            //     firstName: formData.firstName,
            //     lastName: formData.lastName
            //   })
            // });
            //
            // const data = await response.json();
            //
            // if (response.ok) {
            //   setCurrentUser(data.user);
            //   localStorage.setItem('token', data.token);
            //   navigate('/');
            // } else {
            //   setError(data.error || 'Registration failed');
            // }

            // Mock implementation for now
            setTimeout(() => {
                const mockUser = {
                    id: 1,
                    username: formData.username,
                    email: formData.email,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    reputation: 0,
                    badges: ["beginner"],
                };
                setCurrentUser(mockUser);
                navigate("/");
                setLoading(false);
            }, 1000);
        } catch (err) {
            setError("An error occurred during registration");
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2>Join KODEON Community</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="firstName">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
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
                    <div className="form-group">
                        <label htmlFor="confirmPassword">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>
                <div className="auth-footer">
                    <p>
                        Already have an account? <a href="/login">Login</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
