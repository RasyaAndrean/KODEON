// Mobile IDE Configuration
module.exports = {
    // App Information
    app: {
        name: "KODEON Mobile IDE",
        version: "1.0.0",
        description: "Mobile IDE for the KODEON programming language",
        author: "KODEON Team",
        copyright: "© 2025 KODEON Team",
    },

    // Platform Configuration
    platforms: {
        android: {
            minSdkVersion: 21,
            targetSdkVersion: 33,
            packageName: "id.kodeon.mobileide",
        },
        ios: {
            deploymentTarget: "12.0",
            bundleId: "id.kodeon.mobileide",
        },
    },

    // Editor Configuration
    editor: {
        theme: "dark",
        fontSize: 14,
        tabSize: 2,
        showLineNumbers: true,
        wordWrap: true,
        autoCompletion: true,
        syntaxHighlighting: true,
    },

    // Compiler Configuration
    compiler: {
        apiUrl: "https://api.kodeon.id/compiler",
        timeout: 30000,
        maxFileSize: 1024 * 1024, // 1MB
    },

    // Cloud Configuration
    cloud: {
        syncEnabled: true,
        syncInterval: 30000, // 30 seconds
        apiUrl: "https://api.kodeon.id/cloud",
    },

    // AI Assistant Configuration
    ai: {
        apiUrl: "https://api.kodeon.id/ai",
        timeout: 30000,
        maxTokens: 2048,
    },

    // Storage Configuration
    storage: {
        maxLocalProjects: 10,
        maxHistoryItems: 50,
    },

    // Performance Configuration
    performance: {
        maxUndoLevels: 100,
        renderDebounce: 100, // ms
        autoSaveInterval: 300000, // 5 minutes
    },
};
