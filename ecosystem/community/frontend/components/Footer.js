import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h4>KODEON Community</h4>
                    <p>
                        Bringing developers together to learn, share, and grow.
                    </p>
                </div>

                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li>
                            <a href="/about">About</a>
                        </li>
                        <li>
                            <a href="/docs">Documentation</a>
                        </li>
                        <li>
                            <a href="/blog">Blog</a>
                        </li>
                        <li>
                            <a href="/contact">Contact</a>
                        </li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Legal</h4>
                    <ul>
                        <li>
                            <a href="/terms">Terms of Service</a>
                        </li>
                        <li>
                            <a href="/privacy">Privacy Policy</a>
                        </li>
                        <li>
                            <a href="/cookies">Cookie Policy</a>
                        </li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Connect</h4>
                    <div className="social-links">
                        <a href="#" aria-label="GitHub">
                            GitHub
                        </a>
                        <a href="#" aria-label="Twitter">
                            Twitter
                        </a>
                        <a href="#" aria-label="LinkedIn">
                            LinkedIn
                        </a>
                        <a href="#" aria-label="Discord">
                            Discord
                        </a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; 2025 KODEON Community. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
