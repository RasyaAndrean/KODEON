// Main process entry point for KODEON IDE
// This file bootstraps the application and loads the main process code from src/

const { app } = require("electron");
const path = require("path");

// Set the main process file
app.whenReady().then(() => {
    // Load the main process code from src/
    require("./src/main");
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
    app.quit();
}

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, "index.html"));

    // Open the DevTools if in development mode.
    if (process.env.NODE_ENV === "development") {
        mainWindow.webContents.openDevTools();
    }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
    // Initialize systems
    await preferenceManager.initialize();
    await aiServiceManager.initialize();
    await learningSystemManager.initialize();
    await collaborationManager.initialize();

    createWindow();

    // Create the application menu
    const menuTemplate = [
        {
            label: "File",
            submenu: [
                {
                    label: "New File",
                    accelerator: "CmdOrCtrl+N",
                    click: () => {
                        // Send message to renderer to create new file
                        BrowserWindow.getAllWindows()[0].webContents.send(
                            "menu-new-file"
                        );
                    },
                },
                {
                    label: "Open File",
                    accelerator: "CmdOrCtrl+O",
                    click: () => {
                        // Send message to renderer to open file
                        BrowserWindow.getAllWindows()[0].webContents.send(
                            "menu-open-file"
                        );
                    },
                },
                {
                    label: "Save",
                    accelerator: "CmdOrCtrl+S",
                    click: () => {
                        // Send message to renderer to save file
                        BrowserWindow.getAllWindows()[0].webContents.send(
                            "menu-save-file"
                        );
                    },
                },
                {
                    label: "Save As",
                    accelerator: "CmdOrCtrl+Shift+S",
                    click: () => {
                        // Send message to renderer to save file as
                        BrowserWindow.getAllWindows()[0].webContents.send(
                            "menu-save-file-as"
                        );
                    },
                },
                { type: "separator" },
                {
                    label: "Exit",
                    click: () => {
                        app.quit();
                    },
                },
            ],
        },
        {
            label: "Edit",
            submenu: [
                {
                    label: "Undo",
                    accelerator: "CmdOrCtrl+Z",
                    selector: "undo:",
                },
                {
                    label: "Redo",
                    accelerator: "Shift+CmdOrCtrl+Z",
                    selector: "redo:",
                },
                { type: "separator" },
                { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
                {
                    label: "Copy",
                    accelerator: "CmdOrCtrl+C",
                    selector: "copy:",
                },
                {
                    label: "Paste",
                    accelerator: "CmdOrCtrl+V",
                    selector: "paste:",
                },
                {
                    label: "Select All",
                    accelerator: "CmdOrCtrl+A",
                    selector: "selectAll:",
                },
            ],
        },
        {
            label: "View",
            submenu: [
                {
                    label: "Toggle Developer Tools",
                    accelerator:
                        process.platform === "darwin"
                            ? "Alt+Command+I"
                            : "Ctrl+Shift+I",
                    click: (item, focusedWindow) => {
                        if (focusedWindow) {
                            focusedWindow.webContents.toggleDevTools();
                        }
                    },
                },
                { type: "separator" },
                {
                    label: "Reset Zoom",
                    accelerator: "CmdOrCtrl+0",
                    role: "resetZoom",
                },
                {
                    label: "Zoom In",
                    accelerator: "CmdOrCtrl+=",
                    role: "zoomIn",
                },
                {
                    label: "Zoom Out",
                    accelerator: "CmdOrCtrl+-",
                    role: "zoomOut",
                },
            ],
        },
        {
            label: "Tools",
            submenu: [
                {
                    label: "AI Assistant",
                    click: () => {
                        // Send message to renderer to show AI assistant
                        BrowserWindow.getAllWindows()[0].webContents.send(
                            "menu-ai-assistant"
                        );
                    },
                },
                {
                    label: "Debug Program",
                    click: () => {
                        // Send message to renderer to start debugging
                        BrowserWindow.getAllWindows()[0].webContents.send(
                            "menu-debug-program"
                        );
                    },
                },
                {
                    label: "Run Program",
                    click: () => {
                        // Send message to renderer to run program
                        BrowserWindow.getAllWindows()[0].webContents.send(
                            "menu-run-program"
                        );
                    },
                },
            ],
        },
        {
            label: "Learning",
            submenu: [
                {
                    label: "Skill Assessment",
                    click: () => {
                        // Send message to renderer to show skill assessment
                        BrowserWindow.getAllWindows()[0].webContents.send(
                            "menu-skill-assessment"
                        );
                    },
                },
                {
                    label: "Learning Paths",
                    click: () => {
                        // Send message to renderer to show learning paths
                        BrowserWindow.getAllWindows()[0].webContents.send(
                            "menu-learning-paths"
                        );
                    },
                },
                {
                    label: "Goals Dashboard",
                    click: () => {
                        // Send message to renderer to show goals dashboard
                        BrowserWindow.getAllWindows()[0].webContents.send(
                            "menu-goals-dashboard"
                        );
                    },
                },
                {
                    label: "Analytics Dashboard",
                    click: () => {
                        // Send message to renderer to show analytics dashboard
                        BrowserWindow.getAllWindows()[0].webContents.send(
                            "menu-analytics-dashboard"
                        );
                    },
                },
            ],
        },
        {
            label: "Collaboration",
            submenu: [
                {
                    label: "Workspaces",
                    click: () => {
                        // Send message to renderer to show workspaces
                        BrowserWindow.getAllWindows()[0].webContents.send(
                            "menu-workspaces"
                        );
                    },
                },
                {
                    label: "Code Review",
                    click: () => {
                        // Send message to renderer to show code review
                        BrowserWindow.getAllWindows()[0].webContents.send(
                            "menu-code-review"
                        );
                    },
                },
                {
                    label: "Version Control",
                    click: () => {
                        // Send message to renderer to show version control
                        BrowserWindow.getAllWindows()[0].webContents.send(
                            "menu-version-control"
                        );
                    },
                },
            ],
        },
        {
            label: "Help",
            submenu: [
                {
                    label: "Documentation",
                    click: () => {
                        // Send message to renderer to show documentation
                        BrowserWindow.getAllWindows()[0].webContents.send(
                            "menu-documentation"
                        );
                    },
                },
                {
                    label: "Tutorials",
                    click: () => {
                        // Send message to renderer to show tutorials
                        BrowserWindow.getAllWindows()[0].webContents.send(
                            "menu-tutorials"
                        );
                    },
                },
                { type: "separator" },
                {
                    label: "About",
                    click: () => {
                        // Send message to renderer to show about dialog
                        BrowserWindow.getAllWindows()[0].webContents.send(
                            "menu-about"
                        );
                    },
                },
            ],
        },
    ];

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// IPC handlers for AI services
ipcMain.handle("get-code-suggestions", async (event, context) => {
    try {
        return await aiServiceManager.getCodeSuggestions(context);
    } catch (error) {
        console.error("Error getting code suggestions:", error);
        return { suggestions: [], error: error.message };
    }
});

ipcMain.handle("parse-natural-language", async (event, text) => {
    try {
        return await aiServiceManager.parseNaturalLanguage(text);
    } catch (error) {
        console.error("Error parsing natural language:", error);
        return { error: error.message };
    }
});

// IPC handlers for learning system
ipcMain.handle("assess-skill-level", async (event, codeSamples) => {
    try {
        return await learningSystemManager.assessSkillLevel(codeSamples);
    } catch (error) {
        console.error("Error assessing skill level:", error);
        return { error: error.message };
    }
});

ipcMain.handle("get-tutorial-recommendations", async (event, userProfile) => {
    try {
        return await learningSystemManager.getTutorialRecommendations(
            userProfile
        );
    } catch (error) {
        console.error("Error getting tutorial recommendations:", error);
        return { error: error.message };
    }
});

ipcMain.handle("get-challenge-recommendations", async (event, userProfile) => {
    try {
        return await learningSystemManager.getChallengeRecommendations(
            userProfile
        );
    } catch (error) {
        console.error("Error getting challenge recommendations:", error);
        return { error: error.message };
    }
});

ipcMain.handle("track-progress", async (event, userId, activity) => {
    try {
        return await learningSystemManager.trackProgress(userId, activity);
    } catch (error) {
        console.error("Error tracking progress:", error);
        return { error: error.message };
    }
});

ipcMain.handle("get-user-progress", async (event, userId) => {
    try {
        return await learningSystemManager.getUserProgress(userId);
    } catch (error) {
        console.error("Error getting user progress:", error);
        return { error: error.message };
    }
});

ipcMain.handle(
    "generate-personalized-challenge",
    async (event, userProfile, skillLevel) => {
        try {
            return await learningSystemManager.generatePersonalizedChallenge(
                userProfile,
                skillLevel
            );
        } catch (error) {
            console.error("Error generating personalized challenge:", error);
            return { error: error.message };
        }
    }
);

// IPC handlers for learning path management
ipcMain.handle("generate-learning-path", async (event, userProfile) => {
    try {
        return await learningSystemManager.generateLearningPath(userProfile);
    } catch (error) {
        console.error("Error generating learning path:", error);
        return { error: error.message };
    }
});

ipcMain.handle("get-user-learning-paths", async (event, userId) => {
    try {
        return await learningSystemManager.getUserLearningPaths(userId);
    } catch (error) {
        console.error("Error getting user learning paths:", error);
        return { error: error.message };
    }
});

ipcMain.handle("get-current-learning-path", async (event, userId) => {
    try {
        return await learningSystemManager.getCurrentLearningPath(userId);
    } catch (error) {
        console.error("Error getting current learning path:", error);
        return { error: error.message };
    }
});

ipcMain.handle(
    "update-path-progress",
    async (event, userId, stepId, progress) => {
        try {
            return await learningSystemManager.updatePathProgress(
                userId,
                stepId,
                progress
            );
        } catch (error) {
            console.error("Error updating path progress:", error);
            return { error: error.message };
        }
    }
);

ipcMain.handle("get-next-step", async (event, userId) => {
    try {
        return await learningSystemManager.getNextStep(userId);
    } catch (error) {
        console.error("Error getting next step:", error);
        return { error: error.message };
    }
});

ipcMain.handle("get-recommended-paths", async (event, userProfile) => {
    try {
        return await learningSystemManager.getRecommendedPaths(userProfile);
    } catch (error) {
        console.error("Error getting recommended paths:", error);
        return { error: error.message };
    }
});

ipcMain.handle(
    "adapt-path-difficulty",
    async (event, userId, performanceMetrics) => {
        try {
            return await learningSystemManager.adaptPathDifficulty(
                userId,
                performanceMetrics
            );
        } catch (error) {
            console.error("Error adapting path difficulty:", error);
            return { error: error.message };
        }
    }
);

// IPC handlers for goal management
ipcMain.handle("create-goal", async (event, userId, goalDefinition) => {
    try {
        return await learningSystemManager.createGoal(userId, goalDefinition);
    } catch (error) {
        console.error("Error creating goal:", error);
        return { error: error.message };
    }
});

ipcMain.handle(
    "create-goal-from-template",
    async (event, userId, templateId, customizations) => {
        try {
            return await learningSystemManager.createGoalFromTemplate(
                userId,
                templateId,
                customizations
            );
        } catch (error) {
            console.error("Error creating goal from template:", error);
            return { error: error.message };
        }
    }
);

ipcMain.handle("get-user-goals", async (event, userId) => {
    try {
        return await learningSystemManager.getUserGoals(userId);
    } catch (error) {
        console.error("Error getting user goals:", error);
        return { error: error.message };
    }
});

ipcMain.handle("get-active-goals", async (event, userId) => {
    try {
        return await learningSystemManager.getActiveGoals(userId);
    } catch (error) {
        console.error("Error getting active goals:", error);
        return { error: error.message };
    }
});

ipcMain.handle("get-completed-goals", async (event, userId) => {
    try {
        return await learningSystemManager.getCompletedGoals(userId);
    } catch (error) {
        console.error("Error getting completed goals:", error);
        return { error: error.message };
    }
});

ipcMain.handle(
    "update-goal-progress",
    async (event, userId, goalId, progress) => {
        try {
            return await learningSystemManager.updateGoalProgress(
                userId,
                goalId,
                progress
            );
        } catch (error) {
            console.error("Error updating goal progress:", error);
            return { error: error.message };
        }
    }
);

ipcMain.handle("get-goal-templates", async (event) => {
    try {
        return await learningSystemManager.getGoalTemplates();
    } catch (error) {
        console.error("Error getting goal templates:", error);
        return { error: error.message };
    }
});

ipcMain.handle("get-goal-statistics", async (event, userId) => {
    try {
        return await learningSystemManager.getGoalStatistics(userId);
    } catch (error) {
        console.error("Error getting goal statistics:", error);
        return { error: error.message };
    }
});

// IPC handlers for analytics
ipcMain.handle("get-user-analytics", async (event, userId) => {
    try {
        return await learningSystemManager.getUserAnalytics(userId);
    } catch (error) {
        console.error("Error getting user analytics:", error);
        return { error: error.message };
    }
});

ipcMain.handle("get-daily-activity", async (event, userId, days) => {
    try {
        return await learningSystemManager.getDailyActivity(userId, days);
    } catch (error) {
        console.error("Error getting daily activity:", error);
        return { error: error.message };
    }
});

ipcMain.handle("get-weekly-summary", async (event, userId, weeks) => {
    try {
        return await learningSystemManager.getWeeklySummary(userId, weeks);
    } catch (error) {
        console.error("Error getting weekly summary:", error);
        return { error: error.message };
    }
});

ipcMain.handle("get-skill-progression", async (event, userId) => {
    try {
        return await learningSystemManager.getSkillProgression(userId);
    } catch (error) {
        console.error("Error getting skill progression:", error);
        return { error: error.message };
    }
});

ipcMain.handle("get-learning-insights", async (event, userId) => {
    try {
        return await learningSystemManager.getLearningInsights(userId);
    } catch (error) {
        console.error("Error getting learning insights:", error);
        return { error: error.message };
    }
});

ipcMain.handle("get-comparison-data", async (event, userId) => {
    try {
        return await learningSystemManager.getComparisonData(userId);
    } catch (error) {
        console.error("Error getting comparison data:", error);
        return { error: error.message };
    }
});

// IPC handlers for collaboration system
ipcMain.handle(
    "create-document",
    async (event, projectId, fileId, initialContent) => {
        try {
            return await collaborationManager.createDocument(
                projectId,
                fileId,
                initialContent
            );
        } catch (error) {
            console.error("Error creating document:", error);
            return { error: error.message };
        }
    }
);

ipcMain.handle("get-document", async (event, documentId) => {
    try {
        return await collaborationManager.getDocument(documentId);
    } catch (error) {
        console.error("Error getting document:", error);
        return { error: error.message };
    }
});

ipcMain.handle(
    "join-document",
    async (event, documentId, userId, userName, userColor) => {
        try {
            return await collaborationManager.joinDocument(
                documentId,
                userId,
                userName,
                userColor
            );
        } catch (error) {
            console.error("Error joining document:", error);
            return { error: error.message };
        }
    }
);

ipcMain.handle("leave-document", async (event, documentId, userId) => {
    try {
        return await collaborationManager.leaveDocument(documentId, userId);
    } catch (error) {
        console.error("Error leaving document:", error);
        return { error: error.message };
    }
});

ipcMain.handle("apply-operation", async (event, documentId, operation) => {
    try {
        return await collaborationManager.applyOperation(documentId, operation);
    } catch (error) {
        console.error("Error applying operation:", error);
        return { error: error.message };
    }
});

ipcMain.handle(
    "update-user-presence",
    async (event, documentId, userId, presence) => {
        try {
            return await collaborationManager.updateUserPresence(
                documentId,
                userId,
                presence
            );
        } catch (error) {
            console.error("Error updating user presence:", error);
            return { error: error.message };
        }
    }
);

ipcMain.handle("get-document-history", async (event, documentId, limit) => {
    try {
        return await collaborationManager.getDocumentHistory(documentId, limit);
    } catch (error) {
        console.error("Error getting document history:", error);
        return { error: error.message };
    }
});

ipcMain.handle("create-workspace", async (event, userId, workspaceData) => {
    try {
        return await collaborationManager.createWorkspace(
            userId,
            workspaceData
        );
    } catch (error) {
        console.error("Error creating workspace:", error);
        return { error: error.message };
    }
});

ipcMain.handle("get-workspace", async (event, workspaceId) => {
    try {
        return await collaborationManager.getWorkspace(workspaceId);
    } catch (error) {
        console.error("Error getting workspace:", error);
        return { error: error.message };
    }
});

ipcMain.handle("get-user-workspaces", async (event, userId) => {
    try {
        return await collaborationManager.getUserWorkspaces(userId);
    } catch (error) {
        console.error("Error getting user workspaces:", error);
        return { error: error.message };
    }
});

ipcMain.handle("update-workspace", async (event, workspaceId, updates) => {
    try {
        return await collaborationManager.updateWorkspace(workspaceId, updates);
    } catch (error) {
        console.error("Error updating workspace:", error);
        return { error: error.message };
    }
});

ipcMain.handle("delete-workspace", async (event, workspaceId, userId) => {
    try {
        return await collaborationManager.deleteWorkspace(workspaceId, userId);
    } catch (error) {
        console.error("Error deleting workspace:", error);
        return { error: error.message };
    }
});

ipcMain.handle(
    "add-member",
    async (event, workspaceId, inviterId, inviteeId, role) => {
        try {
            return await collaborationManager.addMember(
                workspaceId,
                inviterId,
                inviteeId,
                role
            );
        } catch (error) {
            console.error("Error adding member:", error);
            return { error: error.message };
        }
    }
);

ipcMain.handle(
    "remove-member",
    async (event, workspaceId, removerId, removeeId) => {
        try {
            return await collaborationManager.removeMember(
                workspaceId,
                removerId,
                removeeId
            );
        } catch (error) {
            console.error("Error removing member:", error);
            return { error: error.message };
        }
    }
);

ipcMain.handle(
    "update-member-role",
    async (event, workspaceId, updaterId, targetUserId, newRole) => {
        try {
            return await collaborationManager.updateMemberRole(
                workspaceId,
                updaterId,
                targetUserId,
                newRole
            );
        } catch (error) {
            console.error("Error updating member role:", error);
            return { error: error.message };
        }
    }
);

ipcMain.handle(
    "invite-user",
    async (event, workspaceId, inviterId, inviteeEmail, role) => {
        try {
            return await collaborationManager.inviteUser(
                workspaceId,
                inviterId,
                inviteeEmail,
                role
            );
        } catch (error) {
            console.error("Error inviting user:", error);
            return { error: error.message };
        }
    }
);

ipcMain.handle("accept-invitation", async (event, invitationId, userId) => {
    try {
        return await collaborationManager.acceptInvitation(
            invitationId,
            userId
        );
    } catch (error) {
        console.error("Error accepting invitation:", error);
        return { error: error.message };
    }
});

ipcMain.handle("decline-invitation", async (event, invitationId) => {
    try {
        return await collaborationManager.declineInvitation(invitationId);
    } catch (error) {
        console.error("Error declining invitation:", error);
        return { error: error.message };
    }
});

ipcMain.handle("get-pending-invitations", async (event, userId) => {
    try {
        return await collaborationManager.getPendingInvitations(userId);
    } catch (error) {
        console.error("Error getting pending invitations:", error);
        return { error: error.message };
    }
});

ipcMain.handle("add-project", async (event, workspaceId, userId, projectId) => {
    try {
        return await collaborationManager.addProject(
            workspaceId,
            userId,
            projectId
        );
    } catch (error) {
        console.error("Error adding project:", error);
        return { error: error.message };
    }
});

ipcMain.handle(
    "remove-project",
    async (event, workspaceId, userId, projectId) => {
        try {
            return await collaborationManager.removeProject(
                workspaceId,
                userId,
                projectId
            );
        } catch (error) {
            console.error("Error removing project:", error);
            return { error: error.message };
        }
    }
);

ipcMain.handle(
    "create-comment",
    async (event, projectId, fileId, commentData) => {
        try {
            return await collaborationManager.createComment(
                projectId,
                fileId,
                commentData
            );
        } catch (error) {
            console.error("Error creating comment:", error);
            return { error: error.message };
        }
    }
);

ipcMain.handle("get-comment", async (event, commentId) => {
    try {
        return await collaborationManager.getComment(commentId);
    } catch (error) {
        console.error("Error getting comment:", error);
        return { error: error.message };
    }
});

ipcMain.handle("get-file-comments", async (event, projectId, fileId) => {
    try {
        return await collaborationManager.getFileComments(projectId, fileId);
    } catch (error) {
        console.error("Error getting file comments:", error);
        return { error: error.message };
    }
});

ipcMain.handle("get-project-comments", async (event, projectId) => {
    try {
        return await collaborationManager.getProjectComments(projectId);
    } catch (error) {
        console.error("Error getting project comments:", error);
        return { error: error.message };
    }
});

ipcMain.handle("update-comment", async (event, commentId, userId, updates) => {
    try {
        return await collaborationManager.updateComment(
            commentId,
            userId,
            updates
        );
    } catch (error) {
        console.error("Error updating comment:", error);
        return { error: error.message };
    }
});

ipcMain.handle("delete-comment", async (event, commentId, userId) => {
    try {
        return await collaborationManager.deleteComment(commentId, userId);
    } catch (error) {
        console.error("Error deleting comment:", error);
        return { error: error.message };
    }
});

ipcMain.handle("add-reply", async (event, commentId, replyData) => {
    try {
        return await collaborationManager.addReply(commentId, replyData);
    } catch (error) {
        console.error("Error adding reply:", error);
        return { error: error.message };
    }
});

ipcMain.handle("resolve-comment", async (event, commentId, userId) => {
    try {
        return await collaborationManager.resolveComment(commentId, userId);
    } catch (error) {
        console.error("Error resolving comment:", error);
        return { error: error.message };
    }
});

ipcMain.handle("unresolve-comment", async (event, commentId, userId) => {
    try {
        return await collaborationManager.unresolveComment(commentId, userId);
    } catch (error) {
        console.error("Error unresolving comment:", error);
        return { error: error.message };
    }
});

ipcMain.handle("create-review", async (event, projectId, reviewData) => {
    try {
        return await collaborationManager.createReview(projectId, reviewData);
    } catch (error) {
        console.error("Error creating review:", error);
        return { error: error.message };
    }
});

ipcMain.handle("get-review", async (event, reviewId) => {
    try {
        return await collaborationManager.getReview(reviewId);
    } catch (error) {
        console.error("Error getting review:", error);
        return { error: error.message };
    }
});

ipcMain.handle("get-project-reviews", async (event, projectId) => {
    try {
        return await collaborationManager.getProjectReviews(projectId);
    } catch (error) {
        console.error("Error getting project reviews:", error);
        return { error: error.message };
    }
});

ipcMain.handle("get-user-reviews", async (event, userId) => {
    try {
        return await collaborationManager.getUserReviews(userId);
    } catch (error) {
        console.error("Error getting user reviews:", error);
        return { error: error.message };
    }
});

ipcMain.handle(
    "update-review-status",
    async (event, reviewId, userId, newStatus, comment) => {
        try {
            return await collaborationManager.updateReviewStatus(
                reviewId,
                userId,
                newStatus,
                comment
            );
        } catch (error) {
            console.error("Error updating review status:", error);
            return { error: error.message };
        }
    }
);

ipcMain.handle("add-comment-to-review", async (event, reviewId, commentId) => {
    try {
        return await collaborationManager.addCommentToReview(
            reviewId,
            commentId
        );
    } catch (error) {
        console.error("Error adding comment to review:", error);
        return { error: error.message };
    }
});

ipcMain.handle(
    "remove-comment-from-review",
    async (event, reviewId, commentId) => {
        try {
            return await collaborationManager.removeCommentFromReview(
                reviewId,
                commentId
            );
        } catch (error) {
            console.error("Error removing comment from review:", error);
            return { error: error.message };
        }
    }
);

ipcMain.handle("add-reviewer", async (event, reviewId, reviewerId) => {
    try {
        return await collaborationManager.addReviewer(reviewId, reviewerId);
    } catch (error) {
        console.error("Error adding reviewer:", error);
        return { error: error.message };
    }
});

ipcMain.handle("remove-reviewer", async (event, reviewId, reviewerId) => {
    try {
        return await collaborationManager.removeReviewer(reviewId, reviewerId);
    } catch (error) {
        console.error("Error removing reviewer:", error);
        return { error: error.message };
    }
});

ipcMain.handle("get-user-notifications", async (event, userId) => {
    try {
        return await collaborationManager.getUserNotifications(userId);
    } catch (error) {
        console.error("Error getting user notifications:", error);
        return { error: error.message };
    }
});

ipcMain.handle(
    "mark-notification-as-read",
    async (event, notificationId, userId) => {
        try {
            return await collaborationManager.markNotificationAsRead(
                notificationId,
                userId
            );
        } catch (error) {
            console.error("Error marking notification as read:", error);
            return { error: error.message };
        }
    }
);

ipcMain.handle("mark-all-notifications-as-read", async (event, userId) => {
    try {
        return await collaborationManager.markAllNotificationsAsRead(userId);
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        return { error: error.message };
    }
});

ipcMain.handle("init-repository", async (event, projectId, repoData) => {
    try {
        return await collaborationManager.initRepository(projectId, repoData);
    } catch (error) {
        console.error("Error initializing repository:", error);
        return { error: error.message };
    }
});

ipcMain.handle("get-repository", async (event, repoId) => {
    try {
        return await collaborationManager.getRepository(repoId);
    } catch (error) {
        console.error("Error getting repository:", error);
        return { error: error.message };
    }
});

ipcMain.handle("get-project-repository", async (event, projectId) => {
    try {
        return await collaborationManager.getProjectRepository(projectId);
    } catch (error) {
        console.error("Error getting project repository:", error);
        return { error: error.message };
    }
});

ipcMain.handle(
    "update-repository-settings",
    async (event, repoId, settings) => {
        try {
            return await collaborationManager.updateRepositorySettings(
                repoId,
                settings
            );
        } catch (error) {
            console.error("Error updating repository settings:", error);
            return { error: error.message };
        }
    }
);

ipcMain.handle(
    "create-branch",
    async (event, repoId, branchName, fromBranch) => {
        try {
            return await collaborationManager.createBranch(
                repoId,
                branchName,
                fromBranch
            );
        } catch (error) {
            console.error("Error creating branch:", error);
            return { error: error.message };
        }
    }
);

ipcMain.handle("delete-branch", async (event, repoId, branchName) => {
    try {
        return await collaborationManager.deleteBranch(repoId, branchName);
    } catch (error) {
        console.error("Error deleting branch:", error);
        return { error: error.message };
    }
});

ipcMain.handle("switch-branch", async (event, repoId, branchName) => {
    try {
        return await collaborationManager.switchBranch(repoId, branchName);
    } catch (error) {
        console.error("Error switching branch:", error);
        return { error: error.message };
    }
});

ipcMain.handle("get-branch", async (event, repoId, branchName) => {
    try {
        return await collaborationManager.getBranch(repoId, branchName);
    } catch (error) {
        console.error("Error getting branch:", error);
        return { error: error.message };
    }
});

ipcMain.handle("get-repository-branches", async (event, repoId) => {
    try {
        return await collaborationManager.getRepositoryBranches(repoId);
    } catch (error) {
        console.error("Error getting repository branches:", error);
        return { error: error.message };
    }
});

ipcMain.handle("commit-changes", async (event, repoId, commitData) => {
    try {
        return await collaborationManager.commitChanges(repoId, commitData);
    } catch (error) {
        console.error("Error committing changes:", error);
        return { error: error.message };
    }
});

ipcMain.handle(
    "get-commit-history",
    async (event, repoId, branchName, limit) => {
        try {
            return await collaborationManager.getCommitHistory(
                repoId,
                branchName,
                limit
            );
        } catch (error) {
            console.error("Error getting commit history:", error);
            return { error: error.message };
        }
    }
);

ipcMain.handle("create-merge-request", async (event, repoId, mergeData) => {
    try {
        return await collaborationManager.createMergeRequest(repoId, mergeData);
    } catch (error) {
        console.error("Error creating merge request:", error);
        return { error: error.message };
    }
});

ipcMain.handle(
    "resolve-merge-conflicts",
    async (event, repoId, conflictData) => {
        try {
            return await collaborationManager.resolveMergeConflicts(
                repoId,
                conflictData
            );
        } catch (error) {
            console.error("Error resolving merge conflicts:", error);
            return { error: error.message };
        }
    }
);

ipcMain.handle("sync-repository", async (event, repoId) => {
    try {
        return await collaborationManager.syncRepository(repoId);
    } catch (error) {
        console.error("Error syncing repository:", error);
        return { error: error.message };
    }
});

ipcMain.handle("get-repository-status", async (event, repoId) => {
    try {
        return await collaborationManager.getRepositoryStatus(repoId);
    } catch (error) {
        console.error("Error getting repository status:", error);
        return { error: error.message };
    }
});
