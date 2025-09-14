/**
 * Collaboration Service for KODEON Cloud IDE
 * Handles real-time collaborative editing features
 */

class CollaborationService {
    constructor(io) {
        this.io = io;
        this.rooms = new Map(); // Map of project rooms
    }

    /**
     * Join a project room
     * @param {string} socketId - The socket ID of the user
     * @param {string} projectId - The ID of the project to join
     * @param {string} userId - The ID of the user
     * @param {string} username - The username of the user
     */
    joinProject(socketId, projectId, userId, username) {
        // Join the socket room
        this.io.sockets.sockets.get(socketId)?.join(projectId);

        // Initialize room if it doesn't exist
        if (!this.rooms.has(projectId)) {
            this.rooms.set(projectId, {
                users: new Map(),
                files: new Map(),
            });
        }

        // Add user to room
        const room = this.rooms.get(projectId);
        room.users.set(socketId, { userId, username });

        // Notify other users in the room
        this.io.to(projectId).emit("user-joined", {
            userId,
            username,
            timestamp: Date.now(),
        });

        // Send current users list to the new user
        const users = Array.from(room.users.values());
        this.io.to(socketId).emit("users-list", users);
    }

    /**
     * Leave a project room
     * @param {string} socketId - The socket ID of the user
     * @param {string} projectId - The ID of the project to leave
     */
    leaveProject(socketId, projectId) {
        // Leave the socket room
        this.io.sockets.sockets.get(socketId)?.leave(projectId);

        // Remove user from room
        if (this.rooms.has(projectId)) {
            const room = this.rooms.get(projectId);
            const user = room.users.get(socketId);

            if (user) {
                room.users.delete(socketId);

                // Notify other users in the room
                this.io.to(projectId).emit("user-left", {
                    userId: user.userId,
                    username: user.username,
                    timestamp: Date.now(),
                });

                // Clean up empty rooms
                if (room.users.size === 0) {
                    this.rooms.delete(projectId);
                }
            }
        }
    }

    /**
     * Handle code changes from a user
     * @param {string} projectId - The ID of the project
     * @param {string} fileId - The ID of the file being edited
     * @param {string} content - The new file content
     * @param {Object} cursor - The cursor position
     * @param {string} userId - The ID of the user making the change
     * @param {string} username - The username of the user making the change
     */
    handleCodeChange(projectId, fileId, content, cursor, userId, username) {
        // Broadcast the change to all other users in the room
        this.io.to(projectId).emit("code-change", {
            fileId,
            content,
            cursor,
            userId,
            username,
            timestamp: Date.now(),
        });

        // Update the room's file state
        if (this.rooms.has(projectId)) {
            const room = this.rooms.get(projectId);
            room.files.set(fileId, { content, lastUpdated: Date.now() });
        }
    }

    /**
     * Handle cursor movement
     * @param {string} projectId - The ID of the project
     * @param {string} fileId - The ID of the file
     * @param {Object} cursor - The cursor position
     * @param {string} userId - The ID of the user
     * @param {string} username - The username of the user
     */
    handleCursorMove(projectId, fileId, cursor, userId, username) {
        // Broadcast cursor position to all other users in the room
        this.io.to(projectId).emit("cursor-move", {
            fileId,
            cursor,
            userId,
            username,
            timestamp: Date.now(),
        });
    }

    /**
     * Send a chat message
     * @param {string} projectId - The ID of the project
     * @param {string} message - The chat message
     * @param {string} userId - The ID of the user sending the message
     * @param {string} username - The username of the user sending the message
     */
    sendChatMessage(projectId, message, userId, username) {
        // Broadcast the message to all users in the room
        this.io.to(projectId).emit("chat-message", {
            message,
            userId,
            username,
            timestamp: Date.now(),
        });
    }

    /**
     * Get the current state of a file
     * @param {string} projectId - The ID of the project
     * @param {string} fileId - The ID of the file
     * @returns {string|null} The current file content or null if not found
     */
    getFileContent(projectId, fileId) {
        if (this.rooms.has(projectId)) {
            const room = this.rooms.get(projectId);
            if (room.files.has(fileId)) {
                return room.files.get(fileId).content;
            }
        }
        return null;
    }

    /**
     * Get all users in a project room
     * @param {string} projectId - The ID of the project
     * @returns {Array} Array of users in the room
     */
    getRoomUsers(projectId) {
        if (this.rooms.has(projectId)) {
            const room = this.rooms.get(projectId);
            return Array.from(room.users.values());
        }
        return [];
    }
}

module.exports = CollaborationService;
