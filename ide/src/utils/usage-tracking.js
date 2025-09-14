// Usage Tracking Utility for KODEON IDE

class UsageTracking {
    constructor() {
        this.isInitialized = false;
        this.usageData = {
            projects: 0,
            collaborators: 0,
            storage: 0, // in MB
            aiAssistance: 0, // requests
        };
        this.limits = null;
    }

    async initialize() {
        this.isInitialized = true;

        // Load usage limits
        await this.loadUsageLimits();

        console.log("Usage tracking initialized");
    }

    async loadUsageLimits() {
        if (!this.isInitialized) {
            throw new Error("Usage tracking not initialized");
        }

        try {
            // Get usage limits from the monetization service
            this.limits = await window.electronAPI.getUsageLimits();
        } catch (error) {
            console.error("Error loading usage limits:", error);
            // Default to free plan limits if there's an error
            this.limits = {
                maxProjects: 5,
                maxCollaborators: 3,
                maxStorage: 500, // MB
                maxAiAssistance: 50, // requests per month
            };
        }
    }

    async incrementUsage(type, amount = 1) {
        if (!this.isInitialized) {
            throw new Error("Usage tracking not initialized");
        }

        switch (type) {
            case "projects":
                this.usageData.projects += amount;
                break;
            case "collaborators":
                this.usageData.collaborators += amount;
                break;
            case "storage":
                this.usageData.storage += amount;
                break;
            case "aiAssistance":
                this.usageData.aiAssistance += amount;
                break;
            default:
                throw new Error(`Unknown usage type: ${type}`);
        }

        // Check if user has exceeded limits
        await this.checkUsageLimits(type);
    }

    async checkUsageLimits(type) {
        if (!this.isInitialized || !this.limits) {
            return;
        }

        let exceeded = false;
        let limit = 0;
        let current = 0;

        switch (type) {
            case "projects":
                limit = this.limits.maxProjects;
                current = this.usageData.projects;
                break;
            case "collaborators":
                limit = this.limits.maxCollaborators;
                current = this.usageData.collaborators;
                break;
            case "storage":
                limit = this.limits.maxStorage;
                current = this.usageData.storage;
                break;
            case "aiAssistance":
                limit = this.limits.maxAiAssistance;
                current = this.usageData.aiAssistance;
                break;
        }

        if (current > limit) {
            exceeded = true;
        }

        if (exceeded) {
            // Show a message to the user
            this.showLimitExceededMessage(type, current, limit);
        }
    }

    showLimitExceededMessage(type, current, limit) {
        // Map usage types to user-friendly messages
        const typeMessages = {
            projects: "project",
            collaborators: "collaborator",
            storage: "storage",
            aiAssistance: "AI assistance request",
        };

        const typeMessage = typeMessages[type] || type;

        // Show an alert or modal with upgrade information
        alert(
            `You've reached your ${typeMessage} limit (${current}/${limit}). Upgrade to Pro to increase your limits.`
        );
    }

    async getUsageData() {
        if (!this.isInitialized) {
            throw new Error("Usage tracking not initialized");
        }

        return {
            ...this.usageData,
            limits: this.limits,
        };
    }

    async resetMonthlyUsage() {
        // Reset monthly usage counters (e.g., AI assistance requests)
        this.usageData.aiAssistance = 0;
        console.log("Monthly usage counters reset");
    }
}

module.exports = new UsageTracking();
