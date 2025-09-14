// Subscription Reminder Utility for KODEON IDE

class SubscriptionReminder {
    constructor() {
        this.isInitialized = false;
        this.reminderInterval = null;
    }

    async initialize() {
        this.isInitialized = true;

        // Start checking for subscription reminders
        this.startReminderCheck();

        console.log("Subscription reminder initialized");
    }

    startReminderCheck() {
        if (!this.isInitialized) {
            throw new Error("Subscription reminder not initialized");
        }

        // Check for reminders every hour
        this.reminderInterval = setInterval(() => {
            this.checkSubscriptionReminders();
        }, 60 * 60 * 1000); // 1 hour in milliseconds

        // Also check immediately when initialized
        this.checkSubscriptionReminders();
    }

    async checkSubscriptionReminders() {
        if (!this.isInitialized) {
            throw new Error("Subscription reminder not initialized");
        }

        try {
            // Get current subscription information
            const subscription =
                await window.electronAPI.getCurrentSubscription();

            if (!subscription || subscription.planId === "free") {
                return;
            }

            // Calculate days until expiration
            const endDate = new Date(subscription.endDate);
            const today = new Date();
            const timeDiff = endDate.getTime() - today.getTime();
            const daysUntilExpiration = Math.ceil(
                timeDiff / (1000 * 3600 * 24)
            );

            // Show reminders at different intervals
            if (daysUntilExpiration === 7) {
                this.showReminder(
                    "Your subscription will expire in 7 days. Please renew to continue enjoying premium features."
                );
            } else if (daysUntilExpiration === 3) {
                this.showReminder(
                    "Your subscription will expire in 3 days. Please renew to continue enjoying premium features."
                );
            } else if (daysUntilExpiration === 1) {
                this.showReminder(
                    "Your subscription will expire tomorrow. Please renew to continue enjoying premium features."
                );
            } else if (daysUntilExpiration === 0) {
                this.showReminder(
                    "Your subscription expires today. Please renew to continue enjoying premium features."
                );
            } else if (daysUntilExpiration < 0) {
                this.showReminder(
                    "Your subscription has expired. Please renew to continue enjoying premium features."
                );
            }
        } catch (error) {
            console.error("Error checking subscription reminders:", error);
        }
    }

    showReminder(message) {
        // Show a notification to the user
        if (Notification.permission === "granted") {
            new Notification("KODEON Subscription Reminder", {
                body: message,
                icon: "assets/icons/icon.png", // In a real implementation, this would be the actual icon path
            });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                    new Notification("KODEON Subscription Reminder", {
                        body: message,
                        icon: "assets/icons/icon.png",
                    });
                }
            });
        }

        // Also show in the console for development
        console.log("Subscription Reminder:", message);
    }

    stopReminderCheck() {
        if (this.reminderInterval) {
            clearInterval(this.reminderInterval);
            this.reminderInterval = null;
        }
    }

    async calculateRenewalDate(subscription) {
        if (!this.isInitialized) {
            throw new Error("Subscription reminder not initialized");
        }

        // Calculate renewal date based on subscription period
        const endDate = new Date(subscription.endDate);

        if (subscription.planId === "pro") {
            // Pro plan renews monthly
            endDate.setMonth(endDate.getMonth() + 1);
        } else if (subscription.planId === "team") {
            // Team plan renews monthly
            endDate.setMonth(endDate.getMonth() + 1);
        }

        return endDate;
    }

    async scheduleRenewalReminder(subscription) {
        if (!this.isInitialized) {
            throw new Error("Subscription reminder not initialized");
        }

        try {
            const renewalDate = await this.calculateRenewalDate(subscription);
            const today = new Date();
            const timeDiff = renewalDate.getTime() - today.getTime();
            const daysUntilRenewal = Math.ceil(timeDiff / (1000 * 3600 * 24));

            console.log(
                `Subscription renewal scheduled for ${renewalDate.toDateString()} (${daysUntilRenewal} days from now)`
            );
        } catch (error) {
            console.error("Error scheduling renewal reminder:", error);
        }
    }
}

module.exports = new SubscriptionReminder();
