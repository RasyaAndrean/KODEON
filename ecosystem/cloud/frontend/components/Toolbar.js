import "./Toolbar.css";

const Toolbar = ({ currentProject, currentFile, isConnected }) => {
    const handleRun = () => {
        // In a real implementation, this would compile and run the code
        console.log("Running code...");
    };

    const handleNewFile = () => {
        // In a real implementation, this would create a new file
        console.log("Creating new file...");
    };

    const handleNewProject = () => {
        // In a real implementation, this would create a new project
        console.log("Creating new project...");
    };

    return (
        <div className="toolbar">
            <div className="toolbar-group">
                <button className="toolbar-button" onClick={handleNewProject}>
                    New Project
                </button>
                <button className="toolbar-button" onClick={handleNewFile}>
                    New File
                </button>
            </div>

            <div className="toolbar-group">
                <button className="toolbar-button" disabled={!currentFile}>
                    Save
                </button>
                <button className="toolbar-button" disabled={!currentFile}>
                    Save All
                </button>
            </div>

            <div className="toolbar-group">
                <button
                    className="toolbar-button"
                    onClick={handleRun}
                    disabled={!currentFile}
                >
                    Run
                </button>
                <button className="toolbar-button" disabled={!currentFile}>
                    Debug
                </button>
            </div>

            <div className="toolbar-group">
                <button className="toolbar-button">AI Assistant</button>
            </div>
        </div>
    );
};

export default Toolbar;
