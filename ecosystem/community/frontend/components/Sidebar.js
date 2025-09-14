import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
    const menuItems = [
        { name: "Home", path: "/", icon: "🏠" },
        { name: "Forums", path: "/forums", icon: "💬" },
        { name: "Q&A", path: "/qna", icon: "❓" },
        { name: "Projects", path: "/projects", icon: "🚀" },
        { name: "Events", path: "/events", icon: "📅" },
        { name: "Mentors", path: "/mentors", icon: "👨‍🏫" },
    ];

    return (
        <aside className="sidebar">
            <nav>
                <ul>
                    {menuItems.map((item, index) => (
                        <li key={index}>
                            <Link to={item.path}>
                                <span className="icon">{item.icon}</span>
                                <span className="text">{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
