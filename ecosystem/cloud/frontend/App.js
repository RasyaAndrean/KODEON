import { useEffect, useState } from "react";
import "./assets/styles/App.css";
import Editor from "./components/Editor";
import ProjectExplorer from "./components/ProjectExplorer";
import StatusBar from "./components/StatusBar";
import Toolbar from "./components/Toolbar";

function App() {
    const [currentProject, setCurrentProject] = useState(null);
    const [currentFile, setCurrentFile] = useState(null);
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
        <div className="app">
            <header className="app-header">
                <h1>KODEON Cloud IDE</h1>
                <div className="connection-status">
                    {isConnected ? "Connected" : "Disconnected"}
                </div>
            </header>

            <Toolbar
                currentProject={currentProject}
                currentFile={currentFile}
                isConnected={isConnected}
            />

            <div className="main-content">
                <ProjectExplorer
                    currentProject={currentProject}
                    setCurrentProject={setCurrentProject}
                    currentFile={currentFile}
                    setCurrentFile={setCurrentFile}
                />

                <div className="editor-container">
                    {currentFile ? (
                        <Editor
                            file={currentFile}
                            projectId={currentProject?.id}
                        />
                    ) : (
                        <div className="welcome-screen">
                            <h2>Welcome to KODEON Cloud IDE</h2>
                            <p>
                                Select a file to start coding or create a new
                                project.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <StatusBar
                currentProject={currentProject}
                currentFile={currentFile}
                isConnected={isConnected}
            />
        </div>
    );
}

export default App;
