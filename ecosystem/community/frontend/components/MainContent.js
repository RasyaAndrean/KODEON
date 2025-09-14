import { Outlet } from "react-router-dom";
import "./MainContent.css";

const MainContent = ({ currentUser, setCurrentUser }) => {
    return (
        <main className="main-content">
            <Outlet />
        </main>
    );
};

export default MainContent;
