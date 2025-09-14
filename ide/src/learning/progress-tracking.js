// Progress Tracking for KODEON IDE
class ProgressTracker {
    constructor() {
        this.isInitialized = false;
        this.userProgress = new Map();
        this.achievements = [];
    }

    async initialize() {
        try {
            // Initialize with sample achievements
            this.achievements = [
                {
                    id: "first-code",
                    name: "First Code",
                    description: "Write your first line of KODEON code",
                    criteria: { linesOfCode: 1 },
                    points: 10,
                    badge: "beginner",
                },
                {
                    id: "hello-world",
                    name: "Hello World",
                    description: "Successfully run your first program",
                    criteria: { programsRun: 1 },
                    points: 20,
                    badge: "beginner",
                },
                {
                    id: "function-master",
                    name: "Function Master",
                    description: "Create 5 functions",
                    criteria: { functionsCreated: 5 },
                    points: 50,
                    badge: "intermediate",
                },
                {
                    id: "loop-expert",
                    name: "Loop Expert",
                    description: "Use loops in 10 different programs",
                    criteria: { loopPrograms: 10 },
                    points: 75,
                    badge: "intermediate",
                },
                {
                    id: "class-creator",
                    name: "Class Creator",
                    description: "Define 3 classes",
                    criteria: { classesDefined: 3 },
                    points: 100,
                    badge: "advanced",
                },
                {
                    id: "debugger",
                    name: "Debugger",
                    description: "Use the debugger successfully",
                    criteria: { debugSessions: 1 },
                    points: 30,
                    badge: "intermediate",
                },
                {
                    id: "challenge-master",
                    name: "Challenge Master",
                    description: "Complete 5 coding challenges",
                    criteria: { challengesCompleted: 5 },
                    points: 150,
                    badge: "advanced",
                },
                {
                    id: "tutorial-expert",
                    name: "Tutorial Expert",
                    description: "Complete 10 tutorials",
                    criteria: { tutorialsCompleted: 10 },
                    points: 200,
                    badge: "expert",
                },
            ];

            this.isInitialized = true;
            console.log("Progress tracker initialized");
            return true;
        } catch (error) {
            console.error("Error initializing progress tracker:", error);
            return false;
        }
    }

    isReady() {
        return this.isInitialized;
    }

    async recordActivity(userId, activity) {
        if (!this.isReady()) {
            throw new Error("Progress tracker not initialized");
        }

        // Get or create user progress
        let progress = this.userProgress.get(userId);
        if (!progress) {
            progress = this.createInitialProgress(userId);
            this.userProgress.set(userId, progress);
        }

        // Update progress based on activity type
        switch (activity.type) {
            case "code_written":
                progress.linesOfCode += activity.lines || 0;
                progress.lastActivity = new Date();
                break;

            case "program_run":
                progress.programsRun += 1;
                progress.lastActivity = new Date();
                break;

            case "function_created":
                progress.functionsCreated += 1;
                progress.lastActivity = new Date();
                break;

            case "loop_used":
                progress.loopPrograms += 1;
                progress.lastActivity = new Date();
                break;

            case "class_defined":
                progress.classesDefined += 1;
                progress.lastActivity = new Date();
                break;

            case "debug_session":
                progress.debugSessions += 1;
                progress.lastActivity = new Date();
                break;

            case "challenge_completed":
                progress.challengesCompleted += 1;
                if (
                    !progress.completedChallenges.includes(activity.challengeId)
                ) {
                    progress.completedChallenges.push(activity.challengeId);
                }
                progress.lastActivity = new Date();
                break;

            case "tutorial_completed":
                progress.tutorialsCompleted += 1;
                if (
                    !progress.completedTutorials.includes(activity.tutorialId)
                ) {
                    progress.completedTutorials.push(activity.tutorialId);
                }
                progress.lastActivity = new Date();
                break;

            default:
                console.warn("Unknown activity type:", activity.type);
        }

        // Update total points and check for new achievements
        const newAchievements = this.checkAchievements(progress);
        progress.achievements = [
            ...new Set([...progress.achievements, ...newAchievements]),
        ];
        progress.totalPoints = this.calculateTotalPoints(progress);

        // Update user progress
        this.userProgress.set(userId, progress);

        return {
            progress: progress,
            newAchievements: newAchievements,
        };
    }

    createInitialProgress(userId) {
        return {
            userId: userId,
            linesOfCode: 0,
            programsRun: 0,
            functionsCreated: 0,
            loopPrograms: 0,
            classesDefined: 0,
            debugSessions: 0,
            challengesCompleted: 0,
            tutorialsCompleted: 0,
            completedChallenges: [],
            completedTutorials: [],
            achievements: [],
            totalPoints: 0,
            startDate: new Date(),
            lastActivity: new Date(),
        };
    }

    checkAchievements(progress) {
        const newAchievements = [];

        for (const achievement of this.achievements) {
            // Skip if already earned
            if (progress.achievements.includes(achievement.id)) {
                continue;
            }

            // Check criteria
            let criteriaMet = true;

            if (
                achievement.criteria.linesOfCode &&
                progress.linesOfCode < achievement.criteria.linesOfCode
            ) {
                criteriaMet = false;
            }

            if (
                achievement.criteria.programsRun &&
                progress.programsRun < achievement.criteria.programsRun
            ) {
                criteriaMet = false;
            }

            if (
                achievement.criteria.functionsCreated &&
                progress.functionsCreated <
                    achievement.criteria.functionsCreated
            ) {
                criteriaMet = false;
            }

            if (
                achievement.criteria.loopPrograms &&
                progress.loopPrograms < achievement.criteria.loopPrograms
            ) {
                criteriaMet = false;
            }

            if (
                achievement.criteria.classesDefined &&
                progress.classesDefined < achievement.criteria.classesDefined
            ) {
                criteriaMet = false;
            }

            if (
                achievement.criteria.debugSessions &&
                progress.debugSessions < achievement.criteria.debugSessions
            ) {
                criteriaMet = false;
            }

            if (
                achievement.criteria.challengesCompleted &&
                progress.challengesCompleted <
                    achievement.criteria.challengesCompleted
            ) {
                criteriaMet = false;
            }

            if (
                achievement.criteria.tutorialsCompleted &&
                progress.tutorialsCompleted <
                    achievement.criteria.tutorialsCompleted
            ) {
                criteriaMet = false;
            }

            if (criteriaMet) {
                newAchievements.push(achievement.id);
            }
        }

        return newAchievements;
    }

    calculateTotalPoints(progress) {
        let totalPoints = 0;

        for (const achievementId of progress.achievements) {
            const achievement = this.achievements.find(
                (a) => a.id === achievementId
            );
            if (achievement) {
                totalPoints += achievement.points;
            }
        }

        return totalPoints;
    }

    async getProgress(userId) {
        if (!this.isReady()) {
            throw new Error("Progress tracker not initialized");
        }

        const progress = this.userProgress.get(userId);
        if (!progress) {
            return this.createInitialProgress(userId);
        }

        // Add achievement details
        const achievementDetails = progress.achievements
            .map((achievementId) => {
                return this.achievements.find((a) => a.id === achievementId);
            })
            .filter(Boolean);

        return {
            ...progress,
            achievementDetails: achievementDetails,
        };
    }

    async getLeaderboard(limit = 10) {
        if (!this.isReady()) {
            throw new Error("Progress tracker not initialized");
        }

        // Convert map to array and sort by points
        const allProgress = Array.from(this.userProgress.values());
        const sortedProgress = allProgress.sort(
            (a, b) => b.totalPoints - a.totalPoints
        );

        // Return top users
        return sortedProgress.slice(0, limit).map((progress) => ({
            userId: progress.userId,
            totalPoints: progress.totalPoints,
            achievements: progress.achievements.length,
        }));
    }

    async getStats(userId) {
        if (!this.isReady()) {
            throw new Error("Progress tracker not initialized");
        }

        const progress = this.userProgress.get(userId);
        if (!progress) {
            return null;
        }

        // Calculate stats
        const daysActive = Math.ceil(
            (new Date() - new Date(progress.startDate)) / (1000 * 60 * 60 * 24)
        );

        const avgLinesPerDay =
            daysActive > 0 ? Math.round(progress.linesOfCode / daysActive) : 0;

        const completionRate =
            progress.tutorialsCompleted + progress.challengesCompleted;

        return {
            linesOfCode: progress.linesOfCode,
            programsRun: progress.programsRun,
            functionsCreated: progress.functionsCreated,
            challengesCompleted: progress.challengesCompleted,
            tutorialsCompleted: progress.tutorialsCompleted,
            totalPoints: progress.totalPoints,
            achievements: progress.achievements.length,
            daysActive: daysActive,
            avgLinesPerDay: avgLinesPerDay,
            completionRate: completionRate,
        };
    }

    async resetProgress(userId) {
        if (!this.isReady()) {
            throw new Error("Progress tracker not initialized");
        }

        const initialProgress = this.createInitialProgress(userId);
        this.userProgress.set(userId, initialProgress);

        return initialProgress;
    }
}

module.exports = ProgressTracker;
