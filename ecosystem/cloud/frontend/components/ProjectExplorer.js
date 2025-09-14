import { useEffect, useState } from "react";
import "./ProjectExplorer.css";

const ProjectExplorer = ({
    currentProject,
    setCurrentProject,
    currentFile,
    setCurrentFile,
}) => {
    const [projects, setProjects] = useState([]);
    const [expandedFolders, setExpandedFolders] = useState(new Set());

    useEffect(() => {
        // In a real implementation, this would fetch projects from the backend
        const mockProjects = [
            {
                id: "1",
                name: "My First Project",
                files: [
                    { id: "1-1", name: "main.kodeon", type: "file" },
                    {
                        id: "1-2",
                        name: "utils",
                        type: "folder",
                        children: [
                            {
                                id: "1-2-1",
                                name: "helpers.kodeon",
                                type: "file",
                            },
                            {
                                id: "1-2-2",
                                name: "constants.kodeon",
                                type: "file",
                            },
                        ],
                    },
                    { id: "1-3", name: "README.md", type: "file" },
                ],
            },
            {
                id: "2",
                name: "Web Application",
                files: [
                    { id: "2-1", name: "server.kodeon", type: "file" },
                    {
                        id: "2-2",
                        name: "client",
                        type: "folder",
                        children: [
                            { id: "2-2-1", name: "app.kodeon", type: "file" },
                            { id: "2-2-2", name: "styles.css", type: "file" },
                        ],
                    },
                ],
            },
        ];

        setProjects(mockProjects);
    }, []);

    const toggleFolder = (folderId) => {
        const newExpanded = new Set(expandedFolders);
        if (newExpanded.has(folderId)) {
            newExpanded.delete(folderId);
        } else {
            newExpanded.add(folderId);
        }
        setExpandedFolders(newExpanded);
    };

    const handleFileSelect = (file) => {
        if (file.type === "folder") {
            toggleFolder(file.id);
        } else {
            setCurrentFile(file);
        }
    };

    const renderFileTree = (files, level = 0) => {
        return files.map((file) => (
            <div key={file.id} className="file-item-wrapper">
                <div
                    className={`file-item ${
                        currentFile?.id === file.id ? "selected" : ""
                    } ${file.type}`}
                    style={{ paddingLeft: `${level * 20 + 10}px` }}
                    onClick={() => handleFileSelect(file)}
                >
                    {file.type === "folder" ? (
                        <span className="folder-icon">
                            {expandedFolders.has(file.id) ? "📂" : "📁"}
                        </span>
                    ) : (
                        <span className="file-icon">📄</span>
                    )}
                    <span className="file-name">{file.name}</span>
                </div>

                {file.type === "folder" &&
                    expandedFolders.has(file.id) &&
                    file.children && (
                        <div className="folder-children">
                            {renderFileTree(file.children, level + 1)}
                        </div>
                    )}
            </div>
        ));
    };

    return (
        <div className="project-explorer">
            <div className="explorer-header">
                <h3>Projects</h3>
                <button className="new-project-button">+</button>
            </div>

            <div className="project-list">
                {projects.map((project) => (
                    <div key={project.id} className="project-item">
                        <div
                            className={`project-name ${
                                currentProject?.id === project.id
                                    ? "selected"
                                    : ""
                            }`}
                            onClick={() => setCurrentProject(project)}
                        >
                            📁 {project.name}
                        </div>

                        {currentProject?.id === project.id && (
                            <div className="file-tree">
                                {renderFileTree(project.files)}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectExplorer;
