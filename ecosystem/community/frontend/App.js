import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./assets/styles/App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import Sidebar from "./components/Sidebar";
import Events from "./pages/Events";
import Forums from "./pages/Forums";
import Login from "./pages/Login";
import Mentors from "./pages/Mentors";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import QnA from "./pages/QnA";
import Register from "./pages/Register";

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Check if we're connected to the backend
        fetch("/health")
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "OK") {
                    setIsConnected(true);
                }
            })
            .catch((error) => {
                console.error("Connection error:", error);
                setIsConnected(false);
            });
    }, []);

    return (
        <Router>
            <div className="app">
                <Header
                    currentUser={currentUser}
                    setCurrentUser={setCurrentUser}
                    isConnected={isConnected}
                />

                <div className="main-layout">
                    <Sidebar />

                    <Routes>
                        <Route
                            path="/"
                            element={
                                <MainContent
                                    currentUser={currentUser}
                                    setCurrentUser={setCurrentUser}
                                />
                            }
                        />
                        <Route
                            path="/login"
                            element={<Login setCurrentUser={setCurrentUser} />}
                        />
                        <Route
                            path="/register"
                            element={
                                <Register setCurrentUser={setCurrentUser} />
                            }
                        />
                        <Route
                            path="/profile"
                            element={<Profile currentUser={currentUser} />}
                        />
                        <Route path="/forums" element={<Forums />} />
                        <Route path="/qna" element={<QnA />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/mentors" element={<Mentors />} />
                    </Routes>
                </div>

                <Footer />
            </div>
        </Router>
    );
}

export default App;
