// Main process for KODEON IDE
const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");
const preferenceManager = require("./preferences");
const aiServiceManager = require("./ai");
const learningSystemManager = require("./learning");
const collaborationManager = require("./services");

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
            label: "Knowledge Sharing",
            submenu: [
                {
                    label: "Documentation Platform",
                    click: () => {
                        // Send message to renderer to show documentation platform
                        BrowserWindow.getAllWindows()[0].webContents.send(
                            "menu-documentation-platform"
                        );
                    },
                },
                {
                    label: "Q&A Platform",
                    click: () => {
                        // Send message to renderer to show Q&A platform
                        BrowserWindow.getAllWindows()[0].webContents.send(
                            "menu-qa-platform"
                        );
                    },
                },
                {
                    label: "Project Sharing",
                    click: () => {
                        // Send message to renderer to show project sharing
                        BrowserWindow.getAllWindows()[0].webContents.send(
                            "menu-project-sharing"
                        );
                    },
                },
                {
                    label: "Mentorship Matching",
                    click: () => {
                        // Send message to renderer to show mentorship matching
                        BrowserWindow.getAllWindows()[0].webContents.send(
                            "menu-mentorship-matching"
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
                {
                    label: "Submit Feedback",
                    click: () => {
                        // Send message to renderer to show feedback form
                        BrowserWindow.getAllWindows()[0].webContents.send(
                            "menu-submit-feedback"
                        );
                    },
                },
                { type: "separator" },
                {
                    label: "Subscription Management",
                    click: () => {
                        // Send message to renderer to show subscription management
                        BrowserWindow.getAllWindows()[0].webContents.send(
                            "menu-subscription-management"
                        );
                    },
                },
                {
                    label: "Billing History",
                    click: () => {
                        // Send message to renderer to show billing history
                        BrowserWindow.getAllWindows()[0].webContents.send(
                            "menu-billing-history"
                        );
                    },
                },
                {
                    label: "Upgrade to Pro",
                    click: () => {
                        // Send message to renderer to show upgrade options
                        BrowserWindow.getAllWindows()[0].webContents.send(
                            "menu-upgrade-pro"
                        );
                    },
                },
                {
                    label: "Monetization Analytics",
                    click: () => {
                        // Send message to renderer to show monetization analytics
                        BrowserWindow.getAllWindows()[0].webContents.send(
                            "menu-monetization-analytics"
                        );
                    },
                },
                {
                    label: "Plan Comparison",
                    click: () => {
                        // Send message to renderer to show plan comparison
                        BrowserWindow.getAllWindows()[0].webContents.send(
                            "menu-plan-comparison"
                        );
                    },
                },
                {
                    label: "Customer Support",
                    click: () => {
                        // Send message to renderer to show customer support
                        BrowserWindow.getAllWindows()[0].webContents.send(
                            "menu-customer-support"
                        );
                    },
                },
                {
                    label: "Professional Support",
                    click: () => {
                        // Send message to renderer to show professional support
                        BrowserWindow.getAllWindows()[0].webContents.send(
                            "menu-professional-support"
                        );
                    },
                },
                {
                    label: "Custom Development",
                    click: () => {
                        // Send message to renderer to show custom development
                        BrowserWindow.getAllWindows()[0].webContents.send(
                            "menu-custom-development"
                        );
                    },
                },
                {
                    label: "Training & Certification",
                    click: () => {
                        // Send message to renderer to show training and certification
                        BrowserWindow.getAllWindows()[0].webContents.send(
                            "menu-training-certification"
                        );
                    },
                },
                {
                    label: "Referral Program",
                    click: () => {
                        // Send message to renderer to show referral program
                        BrowserWindow.getAllWindows()[0].webContents.send(
                            "menu-referral-program"
                        );
                    },
                },
                {
                    label: "Affiliate Dashboard",
                    click: () => {
                        // Send message to renderer to show affiliate dashboard
                        BrowserWindow.getAllWindows()[0].webContents.send(
                            "menu-affiliate-dashboard"
                        );
                    },
                },
                {
                    label: "Educational Licensing",
                    click: () => {
                        // Send message to renderer to show educational licensing
                        BrowserWindow.getAllWindows()[0].webContents.send(
                            "menu-educational-licensing"
                        );
                    },
                },
                {
                    label: "Marketplace",
                    click: () => {
                        // Send message to renderer to show marketplace
                        BrowserWindow.getAllWindows()[0].webContents.send(
                            "menu-marketplace"
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

ipcMain.handle("get-advanced-code-suggestions", async (event, context) => {
    try {
        return await aiServiceManager.getAdvancedCodeSuggestions(context);
    } catch (error) {
        console.error("Error getting advanced code suggestions:", error);
        return { suggestions: [], error: error.message };
    }
});

ipcMain.handle("learn-from-context", async (event, context) => {
    try {
        return await aiServiceManager.learnFromContext(context);
    } catch (error) {
        console.error("Error learning from context:", error);
        return { error: error.message };
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

ipcMain.handle("generate-code-from-comment", async (event, comment) => {
    try {
        return await aiServiceManager.generateCodeFromComment(comment);
    } catch (error) {
        console.error("Error generating code from comment:", error);
        return { error: error.message };
    }
});

ipcMain.handle("explain-error", async (event, error) => {
    try {
        return await aiServiceManager.explainError(error);
    } catch (error) {
        console.error("Error explaining error:", error);
        return { error: error.message };
    }
});

ipcMain.handle(
    "improve-code-with-suggestions",
    async (event, code, suggestions) => {
        try {
            return await aiServiceManager.improveCodeWithSuggestions(
                code,
                suggestions
            );
        } catch (error) {
            console.error("Error improving code with suggestions:", error);
            return { error: error.message };
        }
    }
);

ipcMain.handle("parse-complex-request", async (event, text) => {
    try {
        return await aiServiceManager.parseComplexRequest(text);
    } catch (error) {
        console.error("Error parsing complex request:", error);
        return { error: error.message };
    }
});

ipcMain.handle("generate-documentation-for-code", async (event, code) => {
    try {
        return await aiServiceManager.generateDocumentationForCode(code);
    } catch (error) {
        console.error("Error generating documentation for code:", error);
        return { error: error.message };
    }
});

ipcMain.handle("analyze-code-quality", async (event, code) => {
    try {
        return await aiServiceManager.analyzeCodeQuality(code);
    } catch (error) {
        console.error("Error analyzing code quality:", error);
        return { error: error.message };
    }
});

ipcMain.handle("get-refactoring-suggestions", async (event, code) => {
    try {
        return await aiServiceManager.getRefactoringSuggestions(code);
    } catch (error) {
        console.error("Error getting refactoring suggestions:", error);
        return { error: error.message };
    }
});

ipcMain.handle("scan-for-security-issues", async (event, code) => {
    try {
        return await aiServiceManager.scanForSecurityIssues(code);
    } catch (error) {
        console.error("Error scanning for security issues:", error);
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

// IPC handlers for knowledge sharing system
ipcMain.handle("create-document", async (event, documentData) => {
    try {
        return await collaborationManager.createDocument(documentData);
    } catch (error) {
        console.error("Error creating document:", error);
        return { error: error.message };
    }
});

ipcMain.handle("get-document", async (event, documentId) => {
    try {
        return await collaborationManager.getDocument(documentId);
    } catch (error) {
        console.error("Error getting document:", error);
        return { error: error.message };
    }
});

ipcMain.handle("update-document", async (event, documentId, updates) => {
    try {
        return await collaborationManager.updateDocument(documentId, updates);
    } catch (error) {
        console.error("Error updating document:", error);
        return { error: error.message };
    }
});

ipcMain.handle("delete-document", async (event, documentId) => {
    try {
        return await collaborationManager.deleteDocument(documentId);
    } catch (error) {
        console.error("Error deleting document:", error);
        return { error: error.message };
    }
});

ipcMain.handle("search-documents", async (event, query, tags) => {
    try {
        return await collaborationManager.searchDocuments(query, tags);
    } catch (error) {
        console.error("Error searching documents:", error);
        return { error: error.message };
    }
});

ipcMain.handle("create-question", async (event, questionData) => {
    try {
        return await collaborationManager.createQuestion(questionData);
    } catch (error) {
        console.error("Error creating question:", error);
        return { error: error.message };
    }
});

ipcMain.handle("get-question", async (event, questionId) => {
    try {
        return await collaborationManager.getQuestion(questionId);
    } catch (error) {
        console.error("Error getting question:", error);
        return { error: error.message };
    }
});

ipcMain.handle("add-answer", async (event, questionId, answerData) => {
    try {
        return await collaborationManager.addAnswer(questionId, answerData);
    } catch (error) {
        console.error("Error adding answer:", error);
        return { error: error.message };
    }
});

ipcMain.handle("search-questions", async (event, query, tags) => {
    try {
        return await collaborationManager.searchQuestions(query, tags);
    } catch (error) {
        console.error("Error searching questions:", error);
        return { error: error.message };
    }
});

ipcMain.handle("upvote-answer", async (event, questionId, answerId) => {
    try {
        return await collaborationManager.upvoteAnswer(questionId, answerId);
    } catch (error) {
        console.error("Error upvoting answer:", error);
        return { error: error.message };
    }
});

ipcMain.handle("accept-answer", async (event, questionId, answerId) => {
    try {
        return await collaborationManager.acceptAnswer(questionId, answerId);
    } catch (error) {
        console.error("Error accepting answer:", error);
        return { error: error.message };
    }
});

ipcMain.handle("create-project", async (event, projectData) => {
    try {
        return await collaborationManager.createProject(projectData);
    } catch (error) {
        console.error("Error creating project:", error);
        return { error: error.message };
    }
});

ipcMain.handle("get-project", async (event, projectId) => {
    try {
        return await collaborationManager.getProject(projectId);
    } catch (error) {
        console.error("Error getting project:", error);
        return { error: error.message };
    }
});

ipcMain.handle("search-projects", async (event, query, tags) => {
    try {
        return await collaborationManager.searchProjects(query, tags);
    } catch (error) {
        console.error("Error searching projects:", error);
        return { error: error.message };
    }
});

ipcMain.handle("download-project", async (event, projectId) => {
    try {
        return await collaborationManager.downloadProject(projectId);
    } catch (error) {
        console.error("Error downloading project:", error);
        return { error: error.message };
    }
});

ipcMain.handle("rate-project", async (event, projectId, rating) => {
    try {
        return await collaborationManager.rateProject(projectId, rating);
    } catch (error) {
        console.error("Error rating project:", error);
        return { error: error.message };
    }
});

ipcMain.handle("register-mentor", async (event, mentorData) => {
    try {
        return await collaborationManager.registerMentor(mentorData);
    } catch (error) {
        console.error("Error registering mentor:", error);
        return { error: error.message };
    }
});

ipcMain.handle("register-mentee", async (event, menteeData) => {
    try {
        return await collaborationManager.registerMentee(menteeData);
    } catch (error) {
        console.error("Error registering mentee:", error);
        return { error: error.message };
    }
});

ipcMain.handle("find-mentors-for-mentee", async (event, menteeId) => {
    try {
        return await collaborationManager.findMentorsForMentee(menteeId);
    } catch (error) {
        console.error("Error finding mentors:", error);
        return { error: error.message };
    }
});

ipcMain.handle("request-mentorship", async (event, menteeId, mentorId) => {
    try {
        return await collaborationManager.requestMentorship(menteeId, mentorId);
    } catch (error) {
        console.error("Error requesting mentorship:", error);
        return { error: error.message };
    }
});

// IPC handlers for monetization system
const monetizationService = require("./services/monetization");

// Marketplace API
const MarketplaceAPI = require("../../ecosystem/marketplace/api");

ipcMain.handle("get-user-account", async (event) => {
    try {
        // Initialize the monetization service if not already done
        if (!monetizationService.isReady()) {
            await monetizationService.initialize();
        }
        return await monetizationService.getUserAccount();
    } catch (error) {
        console.error("Error getting user account:", error);
        return { error: error.message };
    }
});

ipcMain.handle("get-available-plans", async (event) => {
    try {
        // Initialize the monetization service if not already done
        if (!monetizationService.isReady()) {
            await monetizationService.initialize();
        }
        return await monetizationService.getAvailablePlans();
    } catch (error) {
        console.error("Error getting available plans:", error);
        return { error: error.message };
    }
});

ipcMain.handle("get-current-subscription", async (event) => {
    try {
        // Initialize the monetization service if not already done
        if (!monetizationService.isReady()) {
            await monetizationService.initialize();
        }
        return await monetizationService.getCurrentSubscription();
    } catch (error) {
        console.error("Error getting current subscription:", error);
        return { error: error.message };
    }
});

ipcMain.handle("subscribe-to-plan", async (event, planId, paymentInfo) => {
    try {
        // Initialize the monetization service if not already done
        if (!monetizationService.isReady()) {
            await monetizationService.initialize();
        }
        return await monetizationService.subscribeToPlan(planId, paymentInfo);
    } catch (error) {
        console.error("Error subscribing to plan:", error);
        return { error: error.message };
    }
});

ipcMain.handle("cancel-subscription", async (event) => {
    try {
        // Initialize the monetization service if not already done
        if (!monetizationService.isReady()) {
            await monetizationService.initialize();
        }
        return await monetizationService.cancelSubscription();
    } catch (error) {
        console.error("Error cancelling subscription:", error);
        return { error: error.message };
    }
});

ipcMain.handle("update-payment-method", async (event, paymentInfo) => {
    try {
        // Initialize the monetization service if not already done
        if (!monetizationService.isReady()) {
            await monetizationService.initialize();
        }
        return await monetizationService.updatePaymentMethod(paymentInfo);
    } catch (error) {
        console.error("Error updating payment method:", error);
        return { error: error.message };
    }
});

ipcMain.handle("is-feature-available", async (event, featureId) => {
    try {
        // Initialize the monetization service if not already done
        if (!monetizationService.isReady()) {
            await monetizationService.initialize();
        }
        return await monetizationService.isFeatureAvailable(featureId);
    } catch (error) {
        console.error("Error checking feature availability:", error);
        return { error: error.message };
    }
});

ipcMain.handle("get-usage-limits", async (event) => {
    try {
        // Initialize the monetization service if not already done
        if (!monetizationService.isReady()) {
            await monetizationService.initialize();
        }
        return await monetizationService.getUsageLimits();
    } catch (error) {
        console.error("Error getting usage limits:", error);
        return { error: error.message };
    }
});

ipcMain.handle("process-payment", async (event, amount, paymentInfo) => {
    try {
        // Initialize the monetization service if not already done
        if (!monetizationService.isReady()) {
            await monetizationService.initialize();
        }
        return await monetizationService.processPayment(amount, paymentInfo);
    } catch (error) {
        console.error("Error processing payment:", error);
        return { error: error.message };
    }
});

ipcMain.handle("get-subscription-analytics", async (event) => {
    try {
        // Initialize the monetization service if not already done
        if (!monetizationService.isReady()) {
            await monetizationService.initialize();
        }
        return await monetizationService.getSubscriptionAnalytics();
    } catch (error) {
        console.error("Error getting subscription analytics:", error);
        return { error: error.message };
    }
});

// IPC handlers for marketplace system
const marketplaceAPI = new MarketplaceAPI();

ipcMain.handle("get-marketplace-extensions", async (event) => {
    try {
        // Initialize the marketplace API if not already done
        if (!marketplaceAPI.isReady()) {
            await marketplaceAPI.initialize();
        }
        return await marketplaceAPI.getExtensions();
    } catch (error) {
        console.error("Error getting marketplace extensions:", error);
        return { error: error.message };
    }
});

ipcMain.handle("get-marketplace-categories", async (event) => {
    try {
        // Initialize the marketplace API if not already done
        if (!marketplaceAPI.isReady()) {
            await marketplaceAPI.initialize();
        }
        return await marketplaceAPI.getCategories();
    } catch (error) {
        console.error("Error getting marketplace categories:", error);
        return { error: error.message };
    }
});

ipcMain.handle("install-marketplace-extension", async (event, extensionId) => {
    try {
        // Initialize the marketplace API if not already done
        if (!marketplaceAPI.isReady()) {
            await marketplaceAPI.initialize();
        }
        return await marketplaceAPI.installExtension(extensionId);
    } catch (error) {
        console.error("Error installing marketplace extension:", error);
        return { error: error.message };
    }
});
