// Referral Program Utility for KODEON IDE

class ReferralProgram {
    constructor() {
        this.isInitialized = false;
        this.referralBonus = 10; // $10 credit for successful referrals
    }

    async initialize() {
        this.isInitialized = true;
        console.log("Referral program initialized");
    }

    async generateReferralLink(userId) {
        if (!this.isInitialized) {
            throw new Error("Referral program not initialized");
        }

        try {
            // Generate a unique referral code
            const referralCode = this.generateReferralCode(userId);

            // In a real implementation, this would be stored on the server
            const referralLink = `https://kodeon.ide/signup?ref=${referralCode}`;

            console.log(
                `Referral link generated for user ${userId}: ${referralLink}`
            );

            return {
                referralCode: referralCode,
                referralLink: referralLink,
            };
        } catch (error) {
            console.error("Error generating referral link:", error);
            throw error;
        }
    }

    generateReferralCode(userId) {
        // Generate a simple referral code based on user ID and timestamp
        const timestamp = Date.now().toString().slice(-6);
        const userPart = userId.toString().slice(-4);
        return `${userPart}${timestamp}`;
    }

    async trackReferral(referralCode, referredUserId) {
        if (!this.isInitialized) {
            throw new Error("Referral program not initialized");
        }

        try {
            // In a real implementation, this would track the referral on the server
            console.log(
                `Referral tracked: ${referralCode} referred ${referredUserId}`
            );

            return {
                success: true,
                referralCode: referralCode,
                referredUserId: referredUserId,
            };
        } catch (error) {
            console.error("Error tracking referral:", error);
            throw error;
        }
    }

    async rewardReferral(referralCode) {
        if (!this.isInitialized) {
            throw new Error("Referral program not initialized");
        }

        try {
            // In a real implementation, this would reward the referrer on the server
            console.log(`Referral reward issued for code: ${referralCode}`);

            return {
                success: true,
                rewardAmount: this.referralBonus,
                rewardType: "account_credit",
            };
        } catch (error) {
            console.error("Error rewarding referral:", error);
            throw error;
        }
    }

    async getReferralStats(userId) {
        if (!this.isInitialized) {
            throw new Error("Referral program not initialized");
        }

        try {
            // In a real implementation, this would fetch stats from the server
            // For now, we'll return mock data
            return {
                totalReferrals: 3,
                successfulReferrals: 2,
                pendingReferrals: 1,
                totalRewards: 20, // $20 in credits
                referralCode: `REF${userId.slice(-4)}${Date.now()
                    .toString()
                    .slice(-4)}`,
            };
        } catch (error) {
            console.error("Error getting referral stats:", error);
            throw error;
        }
    }

    showReferralNotification(message) {
        // Show a notification to the user
        if (Notification.permission === "granted") {
            new Notification("KODEON Referral Program", {
                body: message,
                icon: "assets/icons/icon.png", // In a real implementation, this would be the actual icon path
            });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                    new Notification("KODEON Referral Program", {
                        body: message,
                        icon: "assets/icons/icon.png",
                    });
                }
            });
        }

        // Also show in the console for development
        console.log("Referral Notification:", message);
    }

    async shareReferralLink(referralLink) {
        if (!this.isInitialized) {
            throw new Error("Referral program not initialized");
        }

        try {
            // In a real implementation, this would open sharing options
            console.log(`Sharing referral link: ${referralLink}`);

            // Copy to clipboard
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(referralLink);
                this.showReferralNotification(
                    "Referral link copied to clipboard!"
                );
            }

            return true;
        } catch (error) {
            console.error("Error sharing referral link:", error);
            throw error;
        }
    }
}

module.exports = new ReferralProgram();
