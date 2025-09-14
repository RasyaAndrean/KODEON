import { useEffect, useRef, useState } from "react";
import "./Editor.css";

const Editor = ({ file, projectId }) => {
    const [code, setCode] = useState(file?.content || "");
    const [isDirty, setIsDirty] = useState(false);
    const textareaRef = useRef(null);

    useEffect(() => {
        if (file) {
            setCode(file.content || "");
            setIsDirty(false);
        }
    }, [file]);

    const handleChange = (event) => {
        const newCode = event.target.value;
        setCode(newCode);
        setIsDirty(true);

        // In a real implementation, we would send this change to other collaborators
        // via WebSocket connection
        if (projectId) {
            // socket.emit('code-change', {
            //   projectId,
            //   fileId: file.id,
            //   content: newCode,
            //   timestamp: Date.now()
            // });
        }
    };

    const handleSave = () => {
        // In a real implementation, this would save the file to the backend
        console.log("Saving file:", file.name);
        setIsDirty(false);
    };

    return (
        <div className="editor">
            <div className="editor-header">
                <div className="file-info">
                    {file?.name}
                    {isDirty && <span className="dirty-indicator">●</span>}
                </div>
                <button
                    className="save-button"
                    onClick={handleSave}
                    disabled={!isDirty}
                >
                    Save
                </button>
            </div>
            <div className="editor-content">
                <textarea
                    ref={textareaRef}
                    value={code}
                    onChange={handleChange}
                    className="code-editor"
                    spellCheck="false"
                />
            </div>
        </div>
    );
};

export default Editor;
