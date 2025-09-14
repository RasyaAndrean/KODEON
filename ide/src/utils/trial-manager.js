// Trial Management Utility for KODEON IDE

class TrialManager {
    constructor() {
        this.isInitialized = false;
        this.trialPeriodDays = 14; // 14-day trial period
    }

    async initialize() {
        this.isInitialized = true;

        // Check if trial period needs to be started
        await this.checkTrialStatus();

        console.log("Trial manager initialized");
    }

    async checkTrialStatus() {
        if (!this.isInitialized) {
            throw new Error("Trial manager not initialized");
        }

        try {
            // Get user account information
            const userAccount = await window.electronAPI.getUserAccount();

            // Check if user is on free plan and doesn't have an active subscription
            if (
                userAccount.subscription.planId === "free" &&
                !userAccount.trialStarted
            ) {
                // Start trial period
                await this.startTrial(userAccount.id);
            } else if (userAccount.trialStarted && !userAccount.trialEnded) {
                // Check if trial has expired
                await this.checkTrialExpiration(userAccount);
            }
        } catch (error) {
            console.error("Error checking trial status:", error);
        }
    }

    async startTrial(userId) {
        if (!this.isInitialized) {
            throw new Error("Trial manager not initialized");
        }

        try {
            // In a real implementation, this would update the user's account on the server
            const trialEndDate = new Date();
            trialEndDate.setDate(trialEndDate.getDate() + this.trialPeriodDays);

            console.log(
                `Trial period started for user ${userId}. Ends on ${trialEndDate.toDateString()}`
            );

            // Show trial started notification
            this.showTrialNotification(
                "Your free trial has started! Enjoy all Pro features for 14 days."
            );

            return {
                trialStarted: true,
                trialEndDate: trialEndDate,
            };
        } catch (error) {
            console.error("Error starting trial:", error);
            throw error;
        }
    }

    async checkTrialExpiration(userAccount) {
        if (!this.isInitialized) {
            throw new Error("Trial manager not initialized");
        }

        try {
            const trialEndDate = new Date(userAccount.trialEndDate);
            const today = new Date();

            if (today > trialEndDate) {
                // Trial has expired
                await this.endTrial(userAccount.id);
            } else {
                // Calculate days remaining
                const timeDiff = trialEndDate.getTime() - today.getTime();
                const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

                // Show reminders at different intervals
                if (daysRemaining === 7) {
                    this.showTrialNotification(
                        "Your free trial expires in 7 days. Upgrade to Pro to continue enjoying premium features."
                    );
                } else if (daysRemaining === 3) {
                    this.showTrialNotification(
                        "Your free trial expires in 3 days. Upgrade to Pro to continue enjoying premium features."
                    );
                } else if (daysRemaining === 1) {
                    this.showTrialNotification(
                        "Your free trial expires tomorrow. Upgrade to Pro to continue enjoying premium features."
                    );
                }
            }
        } catch (error) {
            console.error("Error checking trial expiration:", error);
        }
    }

    async endTrial(userId) {
        if (!this.isInitialized) {
            throw new Error("Trial manager not initialized");
        }

        try {
            // In a real implementation, this would update the user's account on the server
            console.log(`Trial period ended for user ${userId}`);

            // Show trial ended notification
            this.showTrialNotification(
                "Your free trial has ended. Upgrade to Pro to continue enjoying premium features."
            );

            // Downgrade user to free plan features
            await this.downgradeToFreePlan(userId);

            return {
                trialEnded: true,
            };
        } catch (error) {
            console.error("Error ending trial:", error);
            throw error;
        }
    }

    async downgradeToFreePlan(userId) {
        if (!this.isInitialized) {
            throw new Error("Trial manager not initialized");
        }

        try {
            // In a real implementation, this would update the user's subscription on the server
            console.log(`User ${userId} downgraded to free plan`);

            return true;
        } catch (error) {
            console.error("Error downgrading to free plan:", error);
            throw error;
        }
    }

    showTrialNotification(message) {
        // Show a notification to the user
        if (Notification.permission === "granted") {
            new Notification("KODEON Trial Reminder", {
                body: message,
                icon: "assets/icons/icon.png", // In a real implementation, this would be the actual icon path
            });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                    new Notification("KODEON Trial Reminder", {
                        body: message,
                        icon: "assets/icons/icon.png",
                    });
                }
            });
        }

        // Also show in the console for development
        console.log("Trial Notification:", message);
    }

    async extendTrial(userId, days) {
        if (!this.isInitialized) {
            throw new Error("Trial manager not initialized");
        }

        try {
            // In a real implementation, this would extend the user's trial period on the server
            console.log(
                `Trial period extended by ${days} days for user ${userId}`
            );

            return true;
        } catch (error) {
            console.error("Error extending trial:", error);
            throw error;
        }
    }

    getTrialInfo(userAccount) {
        if (!this.isInitialized) {
            throw new Error("Trial manager not initialized");
        }

        if (!userAccount.trialStarted) {
            return {
                inTrial: false,
                daysRemaining: 0,
                trialEndDate: null,
            };
        }

        const trialEndDate = new Date(userAccount.trialEndDate);
        const today = new Date();
        const timeDiff = trialEndDate.getTime() - today.getTime();
        const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

        return {
            inTrial: daysRemaining > 0,
            daysRemaining: Math.max(0, daysRemaining),
            trialEndDate: trialEndDate,
        };
    }
}

module.exports = new TrialManager();
