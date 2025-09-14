// Analytics Engine for KODEON IDE
class AnalyticsEngine {
    constructor() {
        this.isInitialized = false;
        this.userAnalytics = new Map();
    }

    async initialize() {
        try {
            this.userAnalytics = new Map();

            this.isInitialized = true;
            console.log("Analytics engine initialized");
            return true;
        } catch (error) {
            console.error("Error initializing analytics engine:", error);
            return false;
        }
    }

    isReady() {
        return this.isInitialized;
    }

    async recordActivity(userId, activity) {
        if (!this.isReady()) {
            throw new Error("Analytics engine not initialized");
        }

        // Get or create user analytics data
        let userData = this.userAnalytics.get(userId);
        if (!userData) {
            userData = this.createInitialUserData(userId);
            this.userAnalytics.set(userId, userData);
        }

        // Record activity
        const activityRecord = {
            id: `activity-${Date.now()}-${Math.random()
                .toString(36)
                .substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            ...activity,
        };

        userData.activities.push(activityRecord);

        // Update metrics based on activity type
        this.updateMetrics(userData, activity);

        // Update user analytics
        this.userAnalytics.set(userId, userData);

        return activityRecord;
    }

    createInitialUserData(userId) {
        return {
            userId: userId,
            createdAt: new Date().toISOString(),
            activities: [],
            metrics: {
                // Code metrics
                linesOfCode: 0,
                programsRun: 0,
                functionsCreated: 0,
                loopPrograms: 0,
                classesDefined: 0,
                debugSessions: 0,

                // Learning metrics
                tutorialsCompleted: 0,
                challengesCompleted: 0,
                goalsSet: 0,
                goalsAchieved: 0,

                // Engagement metrics
                sessionCount: 0,
                totalSessionTime: 0, // in minutes
                lastActivity: null,
                streakDays: 0,
                longestStreak: 0,

                // Skill metrics
                skillLevel: "Beginner",
                skillProgress: 0,
                strongestSkills: [],
                weakestSkills: [],

                // Path metrics
                pathsStarted: 0,
                pathsCompleted: 0,
                currentPathProgress: 0,
            },
            dailyActivity: {}, // Track activity by date
            weeklySummary: [], // Weekly activity summaries
            monthlySummary: [], // Monthly activity summaries
        };
    }

    updateMetrics(userData, activity) {
        const metrics = userData.metrics;

        // Update metrics based on activity type
        switch (activity.type) {
            case "code_written":
                metrics.linesOfCode += activity.lines || 0;
                break;

            case "program_run":
                metrics.programsRun += 1;
                break;

            case "function_created":
                metrics.functionsCreated += 1;
                break;

            case "loop_used":
                metrics.loopPrograms += 1;
                break;

            case "class_defined":
                metrics.classesDefined += 1;
                break;

            case "debug_session":
                metrics.debugSessions += 1;
                break;

            case "tutorial_completed":
                metrics.tutorialsCompleted += 1;
                break;

            case "challenge_completed":
                metrics.challengesCompleted += 1;
                break;

            case "goal_set":
                metrics.goalsSet += 1;
                break;

            case "goal_achieved":
                metrics.goalsAchieved += 1;
                break;

            case "learning_path_started":
                metrics.pathsStarted += 1;
                break;

            case "learning_path_completed":
                metrics.pathsCompleted += 1;
                break;

            case "session_start":
                metrics.sessionCount += 1;
                break;
        }

        // Update daily activity tracking
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        if (!userData.dailyActivity[today]) {
            userData.dailyActivity[today] = {
                date: today,
                activities: 0,
                linesOfCode: 0,
                sessionTime: 0, // in minutes
            };
        }

        userData.dailyActivity[today].activities += 1;

        if (activity.type === "code_written") {
            userData.dailyActivity[today].linesOfCode += activity.lines || 0;
        }

        // Update streak tracking
        this.updateStreak(userData, today);

        // Update last activity timestamp
        userData.metrics.lastActivity = new Date().toISOString();
    }

    updateStreak(userData, today) {
        // Convert today to Date object
        const todayDate = new Date(today);

        // Get yesterday's date
        const yesterday = new Date(todayDate);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        // Check if user was active yesterday
        if (userData.dailyActivity[yesterdayStr]) {
            // Continue streak
            userData.metrics.streakDays += 1;
        } else if (!userData.dailyActivity[today]) {
            // New day, start new streak if there was activity
            userData.metrics.streakDays = 1;
        }

        // Update longest streak
        if (userData.metrics.streakDays > userData.metrics.longestStreak) {
            userData.metrics.longestStreak = userData.metrics.streakDays;
        }
    }

    async getUserAnalytics(userId) {
        if (!this.isReady()) {
            throw new Error("Analytics engine not initialized");
        }

        return (
            this.userAnalytics.get(userId) || this.createInitialUserData(userId)
        );
    }

    async getDailyActivity(userId, days = 30) {
        if (!this.isReady()) {
            throw new Error("Analytics engine not initialized");
        }

        const userData = this.userAnalytics.get(userId);
        if (!userData) {
            return {};
        }

        // Get recent daily activity
        const recentActivity = {};
        const today = new Date();

        for (let i = 0; i < days; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split("T")[0];

            recentActivity[dateStr] = userData.dailyActivity[dateStr] || {
                date: dateStr,
                activities: 0,
                linesOfCode: 0,
                sessionTime: 0,
            };
        }

        return recentActivity;
    }

    async getWeeklySummary(userId, weeks = 12) {
        if (!this.isReady()) {
            throw new Error("Analytics engine not initialized");
        }

        const userData = this.userAnalytics.get(userId);
        if (!userData) {
            return [];
        }

        // Generate weekly summaries from daily activity
        const weeklySummaries = [];
        const today = new Date();

        for (let i = 0; i < weeks; i++) {
            const weekStart = new Date(today);
            weekStart.setDate(weekStart.getDate() - i * 7);

            const weekSummary = {
                week: i + 1,
                startDate: new Date(weekStart),
                endDate: new Date(
                    weekStart.getTime() + 6 * 24 * 60 * 60 * 1000
                ),
                activities: 0,
                linesOfCode: 0,
                sessionTime: 0,
                daysActive: 0,
            };

            // Sum activity for the week
            for (let j = 0; j < 7; j++) {
                const date = new Date(weekStart);
                date.setDate(date.getDate() + j);
                const dateStr = date.toISOString().split("T")[0];

                if (userData.dailyActivity[dateStr]) {
                    const dayActivity = userData.dailyActivity[dateStr];
                    weekSummary.activities += dayActivity.activities;
                    weekSummary.linesOfCode += dayActivity.linesOfCode;
                    weekSummary.sessionTime += dayActivity.sessionTime;
                    weekSummary.daysActive += 1;
                }
            }

            weeklySummaries.push(weekSummary);
        }

        return weeklySummaries;
    }

    async getSkillProgression(userId) {
        if (!this.isReady()) {
            throw new Error("Analytics engine not initialized");
        }

        const userData = this.userAnalytics.get(userId);
        if (!userData) {
            return [];
        }

        // Generate skill progression data based on activities
        const skillProgression = [];

        // We'll simulate skill progression based on activities
        // In a real implementation, this would be more sophisticated

        // Calculate skill levels based on activities
        const skillLevels = {
            syntax: Math.min(
                100,
                Math.round((userData.metrics.linesOfCode / 100) * 20)
            ),
            functions: Math.min(100, userData.metrics.functionsCreated * 10),
            controlFlow: Math.min(100, userData.metrics.loopPrograms * 15),
            dataStructures: Math.min(
                100,
                Math.round((userData.metrics.linesOfCode / 100) * 10)
            ),
            oop: Math.min(100, userData.metrics.classesDefined * 20),
            debugging: Math.min(100, userData.metrics.debugSessions * 15),
            problemSolving: Math.min(
                100,
                userData.metrics.challengesCompleted * 20
            ),
        };

        // Convert to array format
        Object.keys(skillLevels).forEach((skill) => {
            skillProgression.push({
                skill: skill,
                level: skillLevels[skill],
                lastUpdated: userData.metrics.lastActivity,
            });
        });

        return skillProgression;
    }

    async getLearningInsights(userId) {
        if (!this.isReady()) {
            throw new Error("Analytics engine not initialized");
        }

        const userData = this.userAnalytics.get(userId);
        if (!userData) {
            return {};
        }

        // Generate learning insights
        const insights = {
            mostActiveDay: this.getMostActiveDay(userData),
            mostProductiveTime: this.getMostProductiveTime(userData),
            learningPace: this.calculateLearningPace(userData),
            skillGaps: this.identifySkillGaps(userData),
            recommendations: this.generateRecommendations(userData),
        };

        return insights;
    }

    getMostActiveDay(userData) {
        // Find the day with the most activities
        let maxActivities = 0;
        let mostActiveDay = "No activity";

        Object.keys(userData.dailyActivity).forEach((date) => {
            const dayActivity = userData.dailyActivity[date];
            if (dayActivity.activities > maxActivities) {
                maxActivities = dayActivity.activities;
                mostActiveDay = date;
            }
        });

        return mostActiveDay;
    }

    getMostProductiveTime(userData) {
        // This would require more detailed timestamp data
        // For now, we'll return a placeholder
        return "Evening (most common)";
    }

    calculateLearningPace(userData) {
        // Calculate learning pace based on activities over time
        const totalActivities = userData.activities.length;
        const daysActive = Object.keys(userData.dailyActivity).length;

        if (daysActive === 0) {
            return "No data available";
        }

        const activitiesPerDay = totalActivities / daysActive;

        if (activitiesPerDay > 5) {
            return "Fast learner";
        } else if (activitiesPerDay > 2) {
            return "Steady learner";
        } else {
            return "Casual learner";
        }
    }

    identifySkillGaps(userData) {
        // Identify skills that need improvement
        const skillLevels = {
            syntax: Math.min(
                100,
                Math.round((userData.metrics.linesOfCode / 100) * 20)
            ),
            functions: Math.min(100, userData.metrics.functionsCreated * 10),
            controlFlow: Math.min(100, userData.metrics.loopPrograms * 15),
            dataStructures: Math.min(
                100,
                Math.round((userData.metrics.linesOfCode / 100) * 10)
            ),
            oop: Math.min(100, userData.metrics.classesDefined * 20),
            debugging: Math.min(100, userData.metrics.debugSessions * 15),
            problemSolving: Math.min(
                100,
                userData.metrics.challengesCompleted * 20
            ),
        };

        const gaps = [];
        Object.keys(skillLevels).forEach((skill) => {
            if (skillLevels[skill] < 50) {
                gaps.push({
                    skill: skill,
                    currentLevel: skillLevels[skill],
                    recommendation: `Focus on ${skill} exercises to improve your skills`,
                });
            }
        });

        return gaps;
    }

    generateRecommendations(userData) {
        const recommendations = [];

        // Recommend based on activity patterns
        if (userData.metrics.streakDays >= 7) {
            recommendations.push({
                type: "achievement",
                message: "Great consistency! You have a 7-day coding streak.",
                priority: "high",
            });
        }

        if (userData.metrics.linesOfCode > 1000) {
            recommendations.push({
                type: "milestone",
                message: "You have written over 1000 lines of code!",
                priority: "high",
            });
        }

        if (
            userData.metrics.challengesCompleted === 0 &&
            userData.metrics.tutorialsCompleted > 3
        ) {
            recommendations.push({
                type: "suggestion",
                message:
                    "Try completing some coding challenges to apply what you have learned.",
                priority: "medium",
            });
        }

        if (userData.metrics.debugSessions === 0) {
            recommendations.push({
                type: "suggestion",
                message:
                    "Consider using the debugger to better understand your code execution.",
                priority: "medium",
            });
        }

        return recommendations;
    }

    async getComparisonData(userId) {
        if (!this.isReady()) {
            throw new Error("Analytics engine not initialized");
        }

        const userData = this.userAnalytics.get(userId);
        if (!userData) {
            return {};
        }

        // Generate comparison data with community averages
        // These would come from a database in a real implementation
        const communityAverages = {
            linesOfCode: 500,
            tutorialsCompleted: 3,
            challengesCompleted: 2,
            streakDays: 3,
        };

        const userMetrics = userData.metrics;

        return {
            linesOfCode: {
                user: userMetrics.linesOfCode,
                community: communityAverages.linesOfCode,
                comparison:
                    userMetrics.linesOfCode > communityAverages.linesOfCode
                        ? "above"
                        : "below",
            },
            tutorialsCompleted: {
                user: userMetrics.tutorialsCompleted,
                community: communityAverages.tutorialsCompleted,
                comparison:
                    userMetrics.tutorialsCompleted >
                    communityAverages.tutorialsCompleted
                        ? "above"
                        : "below",
            },
            challengesCompleted: {
                user: userMetrics.challengesCompleted,
                community: communityAverages.challengesCompleted,
                comparison:
                    userMetrics.challengesCompleted >
                    communityAverages.challengesCompleted
                        ? "above"
                        : "below",
            },
            streakDays: {
                user: userMetrics.streakDays,
                community: communityAverages.streakDays,
                comparison:
                    userMetrics.streakDays > communityAverages.streakDays
                        ? "above"
                        : "below",
            },
        };
    }

    async exportAnalytics(userId, format = "json") {
        if (!this.isReady()) {
            throw new Error("Analytics engine not initialized");
        }

        const userData = this.userAnalytics.get(userId);
        if (!userData) {
            throw new Error("No analytics data found for user");
        }

        // Export data in requested format
        switch (format.toLowerCase()) {
            case "json":
                return JSON.stringify(userData, null, 2);

            case "csv":
                // Simplified CSV export
                let csv = "Metric,Value\n";
                Object.keys(userData.metrics).forEach((metric) => {
                    csv += `${metric},${userData.metrics[metric]}\n`;
                });
                return csv;

            default:
                throw new Error(`Unsupported export format: ${format}`);
        }
    }
}

module.exports = AnalyticsEngine;
