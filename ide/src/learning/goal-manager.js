// Goal Manager for KODEON IDE
class GoalManager {
    constructor() {
        this.isInitialized = false;
        this.userGoals = new Map();
        this.goalTemplates = [];
    }

    async initialize() {
        try {
            // Initialize with sample goal templates
            this.goalTemplates = [
                {
                    id: "complete-tutorials",
                    name: "Complete Tutorials",
                    description: "Complete a specific number of tutorials",
                    type: "tutorial",
                    defaultTarget: 5,
                    metrics: ["tutorialsCompleted"],
                    reward: "Learning Enthusiast Badge",
                },
                {
                    id: "master-functions",
                    name: "Master Functions",
                    description: "Create and use functions effectively",
                    type: "skill",
                    defaultTarget: 10,
                    metrics: ["functionsCreated"],
                    reward: "Function Master Badge",
                },
                {
                    id: "complete-challenges",
                    name: "Complete Challenges",
                    description: "Complete programming challenges",
                    type: "challenge",
                    defaultTarget: 3,
                    metrics: ["challengesCompleted"],
                    reward: "Challenge Solver Badge",
                },
                {
                    id: "coding-streak",
                    name: "Coding Streak",
                    description:
                        "Code for a specific number of consecutive days",
                    type: "habit",
                    defaultTarget: 7,
                    metrics: ["daysActive"],
                    reward: "Consistency Badge",
                },
                {
                    id: "syntax-mastery",
                    name: "Syntax Mastery",
                    description: "Write a specific number of lines of code",
                    type: "activity",
                    defaultTarget: 1000,
                    metrics: ["linesOfCode"],
                    reward: "Syntax Master Badge",
                },
            ];

            this.userGoals = new Map();

            this.isInitialized = true;
            console.log("Goal manager initialized");
            return true;
        } catch (error) {
            console.error("Error initializing goal manager:", error);
            return false;
        }
    }

    isReady() {
        return this.isInitialized;
    }

    async createGoal(userId, goalDefinition) {
        if (!this.isReady()) {
            throw new Error("Goal manager not initialized");
        }

        // Validate goal definition
        if (
            !goalDefinition.name ||
            !goalDefinition.type ||
            !goalDefinition.target
        ) {
            throw new Error(
                "Invalid goal definition: name, type, and target are required"
            );
        }

        // Create goal object
        const goal = {
            id: `goal-${userId}-${Date.now()}`,
            userId: userId,
            name: goalDefinition.name,
            description: goalDefinition.description || "",
            type: goalDefinition.type,
            target: goalDefinition.target,
            currentProgress: 0,
            startDate: new Date().toISOString(),
            targetDate:
                goalDefinition.targetDate ||
                this.calculateTargetDate(goalDefinition.target),
            completed: false,
            completionDate: null,
            metrics: goalDefinition.metrics || [],
            reward: goalDefinition.reward || "Achievement Unlocked!",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Store goal
        if (!this.userGoals.has(userId)) {
            this.userGoals.set(userId, []);
        }
        this.userGoals.get(userId).push(goal);

        return goal;
    }

    calculateTargetDate(target) {
        // Simple calculation: 1 unit per day
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + target);
        return targetDate.toISOString();
    }

    async createGoalFromTemplate(userId, templateId, customizations = {}) {
        if (!this.isReady()) {
            throw new Error("Goal manager not initialized");
        }

        // Find template
        const template = this.goalTemplates.find((t) => t.id === templateId);
        if (!template) {
            throw new Error(`Goal template not found: ${templateId}`);
        }

        // Create goal definition from template
        const goalDefinition = {
            name: customizations.name || template.name,
            description: customizations.description || template.description,
            type: template.type,
            target: customizations.target || template.defaultTarget,
            targetDate: customizations.targetDate,
            metrics: customizations.metrics || template.metrics,
            reward: customizations.reward || template.reward,
        };

        return await this.createGoal(userId, goalDefinition);
    }

    async getUserGoals(userId) {
        if (!this.isReady()) {
            throw new Error("Goal manager not initialized");
        }

        return this.userGoals.get(userId) || [];
    }

    async getActiveGoals(userId) {
        if (!this.isReady()) {
            throw new Error("Goal manager not initialized");
        }

        const userGoals = this.userGoals.get(userId) || [];
        return userGoals.filter((goal) => !goal.completed);
    }

    async getCompletedGoals(userId) {
        if (!this.isReady()) {
            throw new Error("Goal manager not initialized");
        }

        const userGoals = this.userGoals.get(userId) || [];
        return userGoals.filter((goal) => goal.completed);
    }

    async updateGoalProgress(userId, goalId, progress) {
        if (!this.isReady()) {
            throw new Error("Goal manager not initialized");
        }

        // Find user's goals
        const userGoals = this.userGoals.get(userId) || [];
        const goal = userGoals.find((g) => g.id === goalId);

        if (!goal) {
            throw new Error(`Goal not found: ${goalId}`);
        }

        if (goal.completed) {
            throw new Error("Cannot update progress for completed goal");
        }

        // Update progress
        goal.currentProgress = Math.min(goal.target, Math.max(0, progress));
        goal.updatedAt = new Date().toISOString();

        // Check if goal is completed
        if (goal.currentProgress >= goal.target) {
            goal.completed = true;
            goal.completionDate = new Date().toISOString();

            // Return achievement notification
            return {
                goal: goal,
                achieved: true,
                message: `Congratulations! You've achieved your goal: ${goal.name}`,
                reward: goal.reward,
            };
        }

        return {
            goal: goal,
            achieved: false,
            message: `Progress updated for goal: ${goal.name}`,
            progress: Math.round((goal.currentProgress / goal.target) * 100),
        };
    }

    async updateGoalProgressFromActivity(userId, activity) {
        if (!this.isReady()) {
            throw new Error("Goal manager not initialized");
        }

        // Get active goals
        const activeGoals = await this.getActiveGoals(userId);
        const updatedGoals = [];

        // Update progress for goals that track this activity type
        for (const goal of activeGoals) {
            // Check if goal tracks this activity
            if (goal.metrics.includes(activity.type)) {
                // Update progress based on activity
                let progressIncrement = 1;

                // Special handling for different activity types
                if (activity.type === "linesOfCode") {
                    progressIncrement = activity.lines || 1;
                } else if (activity.type === "tutorial_completed") {
                    progressIncrement = 1;
                } else if (activity.type === "challenge_completed") {
                    progressIncrement = 1;
                }

                const newProgress = goal.currentProgress + progressIncrement;
                const result = await this.updateGoalProgress(
                    userId,
                    goal.id,
                    newProgress
                );
                updatedGoals.push(result);
            }
        }

        return updatedGoals;
    }

    async getGoalTemplates() {
        if (!this.isReady()) {
            throw new Error("Goal manager not initialized");
        }

        return [...this.goalTemplates];
    }

    async getGoalStatistics(userId) {
        if (!this.isReady()) {
            throw new Error("Goal manager not initialized");
        }

        const userGoals = this.userGoals.get(userId) || [];
        const activeGoals = userGoals.filter((goal) => !goal.completed);
        const completedGoals = userGoals.filter((goal) => goal.completed);

        // Calculate statistics
        const totalGoals = userGoals.length;
        const completionRate =
            totalGoals > 0
                ? Math.round((completedGoals.length / totalGoals) * 100)
                : 0;

        // Find most common goal type
        const goalTypeCount = {};
        userGoals.forEach((goal) => {
            goalTypeCount[goal.type] = (goalTypeCount[goal.type] || 0) + 1;
        });

        const mostCommonType = Object.keys(goalTypeCount).reduce(
            (a, b) => (goalTypeCount[a] > goalTypeCount[b] ? a : b),
            "None"
        );

        // Calculate average completion time
        let totalCompletionTime = 0;
        let completedWithTime = 0;

        completedGoals.forEach((goal) => {
            const startDate = new Date(goal.startDate);
            const completionDate = new Date(goal.completionDate);
            const completionTime =
                (completionDate - startDate) / (1000 * 60 * 60 * 24); // days
            totalCompletionTime += completionTime;
            completedWithTime++;
        });

        const averageCompletionTime =
            completedWithTime > 0
                ? Math.round(totalCompletionTime / completedWithTime)
                : 0;

        return {
            totalGoals: totalGoals,
            activeGoals: activeGoals.length,
            completedGoals: completedGoals.length,
            completionRate: completionRate,
            mostCommonGoalType: mostCommonType,
            averageCompletionTime: averageCompletionTime, // in days
            rewardsEarned: completedGoals.length,
        };
    }

    async deleteGoal(userId, goalId) {
        if (!this.isReady()) {
            throw new Error("Goal manager not initialized");
        }

        const userGoals = this.userGoals.get(userId) || [];
        const goalIndex = userGoals.findIndex((g) => g.id === goalId);

        if (goalIndex === -1) {
            throw new Error(`Goal not found: ${goalId}`);
        }

        // Remove goal
        const removedGoal = userGoals.splice(goalIndex, 1)[0];

        return removedGoal;
    }
}

module.exports = GoalManager;
