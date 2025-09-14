import "./StatusBar.css";

const StatusBar = ({ currentProject, currentFile, isConnected }) => {
    return (
        <div className="status-bar">
            <div className="status-item">
                {currentProject
                    ? `Project: ${currentProject.name}`
                    : "No project open"}
            </div>

            <div className="status-item">
                {currentFile ? `File: ${currentFile.name}` : "No file selected"}
            </div>

            <div className="status-item connection-status">
                <span
                    className={`status-indicator ${
                        isConnected ? "connected" : "disconnected"
                    }`}
                ></span>
                {isConnected ? "Connected" : "Disconnected"}
            </div>

            <div className="status-item">KODEON Cloud IDE v1.0.0</div>
        </div>
    );
};

export default StatusBar;
