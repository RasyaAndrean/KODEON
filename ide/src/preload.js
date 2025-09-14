// Preload script for KODEON IDE
const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electronAPI", {
    compileFile: (filePath) => ipcRenderer.invoke("compile-file", filePath),
    runProgram: (filePath) => ipcRenderer.invoke("run-program", filePath),

    // Preference management
    getUserPreferences: () => ipcRenderer.invoke("get-user-preferences"),
    saveUserPreferences: (preferences) =>
        ipcRenderer.invoke("save-user-preferences", preferences),
    getAllThemes: () => ipcRenderer.invoke("get-all-themes"),
    getAllKeybindingSchemes: () =>
        ipcRenderer.invoke("get-all-keybinding-schemes"),
    getAllLayouts: () => ipcRenderer.invoke("get-all-layouts"),

    // AI services
    getCodeSuggestions: (context) =>
        ipcRenderer.invoke("get-code-suggestions", context),
    getAdvancedCodeSuggestions: (context) =>
        ipcRenderer.invoke("get-advanced-code-suggestions", context),
    parseNaturalLanguage: (text) =>
        ipcRenderer.invoke("parse-natural-language", text),
    learnFromContext: (context) =>
        ipcRenderer.invoke("learn-from-context", context),
    generateCodeFromComment: (comment) =>
        ipcRenderer.invoke("generate-code-from-comment", comment),
    explainError: (error) => ipcRenderer.invoke("explain-error", error),
    parseComplexRequest: (text) =>
        ipcRenderer.invoke("parse-complex-request", text),
    generateDocumentationForCode: (code) =>
        ipcRenderer.invoke("generate-documentation-for-code", code),
    improveCodeWithSuggestions: (code, suggestions) =>
        ipcRenderer.invoke("improve-code-with-suggestions", code, suggestions),
    analyzeCodeQuality: (code) =>
        ipcRenderer.invoke("analyze-code-quality", code),
    getRefactoringSuggestions: (code) =>
        ipcRenderer.invoke("get-refactoring-suggestions", code),
    scanForSecurityIssues: (code) =>
        ipcRenderer.invoke("scan-for-security-issues", code),

    // Learning system
    assessSkillLevel: (codeSamples) =>
        ipcRenderer.invoke("assess-skill-level", codeSamples),
    getTutorialRecommendations: (userProfile) =>
        ipcRenderer.invoke("get-tutorial-recommendations", userProfile),
    getChallengeRecommendations: (userProfile) =>
        ipcRenderer.invoke("get-challenge-recommendations", userProfile),
    trackProgress: (userId, activity) =>
        ipcRenderer.invoke("track-progress", userId, activity),
    getUserProgress: (userId) =>
        ipcRenderer.invoke("get-user-progress", userId),
    generatePersonalizedChallenge: (userProfile, skillLevel) =>
        ipcRenderer.invoke(
            "generate-personalized-challenge",
            userProfile,
            skillLevel
        ),

    // Event listeners
    onUserPreferencesUpdate: (callback) =>
        ipcRenderer.on("user-preferences", callback),

    // Menu event listeners
    onMenuNewFile: (callback) => ipcRenderer.on("menu-new-file", callback),
    onMenuOpenFile: (callback) => ipcRenderer.on("menu-open-file", callback),
    onMenuSaveFile: (callback) => ipcRenderer.on("menu-save-file", callback),
    onMenuSaveFileAs: (callback) =>
        ipcRenderer.on("menu-save-file-as", callback),
    onMenuAiAssistant: (callback) =>
        ipcRenderer.on("menu-ai-assistant", callback),
    onMenuDebugProgram: (callback) =>
        ipcRenderer.on("menu-debug-program", callback),
    onMenuRunProgram: (callback) =>
        ipcRenderer.on("menu-run-program", callback),
    onMenuSkillAssessment: (callback) =>
        ipcRenderer.on("menu-skill-assessment", callback),
    onMenuLearningPaths: (callback) =>
        ipcRenderer.on("menu-learning-paths", callback),
    onMenuGoalsDashboard: (callback) =>
        ipcRenderer.on("menu-goals-dashboard", callback),
    onMenuAnalyticsDashboard: (callback) =>
        ipcRenderer.on("menu-analytics-dashboard", callback),
    onMenuDocumentation: (callback) =>
        ipcRenderer.on("menu-documentation", callback),
    onMenuTutorials: (callback) => ipcRenderer.on("menu-tutorials", callback),
    onMenuAbout: (callback) => ipcRenderer.on("menu-about", callback),
    onMenuWorkspaces: (callback) => ipcRenderer.on("menu-workspaces", callback),
    onMenuCodeReview: (callback) =>
        ipcRenderer.on("menu-code-review", callback),
    onMenuVersionControl: (callback) =>
        ipcRenderer.on("menu-version-control", callback),
    // Monetization menu event listeners
    onMenuSubscriptionManagement: (callback) =>
        ipcRenderer.on("menu-subscription-management", callback),
    onMenuBillingHistory: (callback) =>
        ipcRenderer.on("menu-billing-history", callback),
    onMenuUpgradePro: (callback) =>
        ipcRenderer.on("menu-upgrade-pro", callback),
    onMenuMonetizationAnalytics: (callback) =>
        ipcRenderer.on("menu-monetization-analytics", callback),
    onMenuPlanComparison: (callback) =>
        ipcRenderer.on("menu-plan-comparison", callback),
    onMenuCustomerSupport: (callback) =>
        ipcRenderer.on("menu-customer-support", callback),
    onMenuProfessionalSupport: (callback) =>
        ipcRenderer.on("menu-professional-support", callback),
    onMenuCustomDevelopment: (callback) =>
        ipcRenderer.on("menu-custom-development", callback),
    onMenuTrainingCertification: (callback) =>
        ipcRenderer.on("menu-training-certification", callback),
    onMenuReferralProgram: (callback) =>
        ipcRenderer.on("menu-referral-program", callback),
    onMenuAffiliateDashboard: (callback) =>
        ipcRenderer.on("menu-affiliate-dashboard", callback),
    onMenuEducationalLicensing: (callback) =>
        ipcRenderer.on("menu-educational-licensing", callback),
    onMenuMarketplace: (callback) =>
        ipcRenderer.on("menu-marketplace", callback),
    // Monetization IPC handlers
    getUserAccount: () => ipcRenderer.invoke("get-user-account"),
    getAvailablePlans: () => ipcRenderer.invoke("get-available-plans"),
    getCurrentSubscription: () =>
        ipcRenderer.invoke("get-current-subscription"),
    subscribeToPlan: (planId, paymentInfo) =>
        ipcRenderer.invoke("subscribe-to-plan", planId, paymentInfo),
    cancelSubscription: () => ipcRenderer.invoke("cancel-subscription"),
    updatePaymentMethod: (paymentInfo) =>
        ipcRenderer.invoke("update-payment-method", paymentInfo),
    isFeatureAvailable: (featureId) =>
        ipcRenderer.invoke("is-feature-available", featureId),
    getUsageLimits: () => ipcRenderer.invoke("get-usage-limits"),
    processPayment: (amount, paymentInfo) =>
        ipcRenderer.invoke("process-payment", amount, paymentInfo),
    getSubscriptionAnalytics: () =>
        ipcRenderer.invoke("get-subscription-analytics"),
    // Marketplace IPC handlers
    getMarketplaceExtensions: () =>
        ipcRenderer.invoke("get-marketplace-extensions"),
    getMarketplaceCategories: () =>
        ipcRenderer.invoke("get-marketplace-categories"),
    installMarketplaceExtension: (extensionId) =>
        ipcRenderer.invoke("install-marketplace-extension", extensionId),
});
