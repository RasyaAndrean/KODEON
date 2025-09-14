// Feature Gating Utility for KODEON IDE

class FeatureGating {
    constructor() {
        this.isInitialized = false;
    }

    async initialize() {
        this.isInitialized = true;
        console.log("Feature gating initialized");
    }

    async isFeatureAvailable(featureId) {
        if (!this.isInitialized) {
            throw new Error("Feature gating not initialized");
        }

        try {
            // Check with the monetization service if the feature is available
            return await window.electronAPI.isFeatureAvailable(featureId);
        } catch (error) {
            console.error("Error checking feature availability:", error);
            // Default to false for premium features if there's an error
            return false;
        }
    }

    async checkAndExecute(featureId, callback) {
        if (!this.isInitialized) {
            throw new Error("Feature gating not initialized");
        }

        try {
            const isAvailable = await this.isFeatureAvailable(featureId);

            if (isAvailable) {
                // Execute the callback if feature is available
                return callback();
            } else {
                // Show a message or redirect to upgrade if feature is not available
                this.showUpgradeMessage(featureId);
                return null;
            }
        } catch (error) {
            console.error("Error checking and executing feature:", error);
            return null;
        }
    }

    showUpgradeMessage(featureId) {
        // Map feature IDs to user-friendly messages
        const featureMessages = {
            "advanced-debugging":
                "Advanced debugging tools are available in the Pro plan.",
            "ai-code-assistance":
                "AI code assistance is available in the Pro plan.",
            "cloud-sync": "Cloud sync is available in the Pro plan.",
            "premium-themes": "Premium themes are available in the Pro plan.",
            "advanced-collaboration":
                "Advanced collaboration features are available in the Pro plan.",
            "priority-support":
                "Priority support is available in the Pro plan.",
            "custom-domain-hosting":
                "Custom domain hosting is available in the Pro plan.",
        };

        const message =
            featureMessages[featureId] ||
            "This feature is available in the Pro plan.";

        // Show an alert or modal with upgrade information
        alert(`${message} Upgrade to Pro to access this feature.`);
    }

    async getUsageLimits() {
        if (!this.isInitialized) {
            throw new Error("Feature gating not initialized");
        }

        try {
            return await window.electronAPI.getUsageLimits();
        } catch (error) {
            console.error("Error getting usage limits:", error);
            // Return default limits for free plan if there's an error
            return {
                maxProjects: 5,
                maxCollaborators: 3,
                maxStorage: 500, // MB
                maxAiAssistance: 50, // requests per month
            };
        }
    }
}

module.exports = new FeatureGating();
