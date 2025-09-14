// Learning Path Manager for KODEON IDE
class LearningPathManager {
    constructor() {
        this.isInitialized = false;
        this.learningPaths = new Map();
        this.userPaths = new Map();
    }

    async initialize() {
        try {
            // Initialize with sample learning paths
            this.learningPaths = new Map();
            this.userPaths = new Map();

            // Add sample learning paths
            this.addSampleLearningPaths();

            this.isInitialized = true;
            console.log("Learning path manager initialized");
            return true;
        } catch (error) {
            console.error("Error initializing learning path manager:", error);
            return false;
        }
    }

    addSampleLearningPaths() {
        // Beginner to Intermediate Path
        this.learningPaths.set("beginner-to-intermediate", {
            id: "beginner-to-intermediate",
            title: "Beginner to Intermediate Programming",
            description: "Path from basic syntax to intermediate concepts",
            difficultyLevel: "Beginner",
            estimatedDuration: 60, // days
            topics: ["syntax", "functions", "control-flow", "data-structures"],
            steps: [
                {
                    id: "step-1",
                    title: "Introduction to KODEON",
                    type: "tutorial",
                    resourceId: "basics-1",
                    estimatedTime: 30, // minutes
                    difficulty: "Beginner",
                    prerequisites: [],
                },
                {
                    id: "step-2",
                    title: "Variables and Data Types",
                    type: "tutorial",
                    resourceId: "variables-1",
                    estimatedTime: 45,
                    difficulty: "Beginner",
                    prerequisites: ["step-1"],
                },
                {
                    id: "step-3",
                    title: "Functions in KODEON",
                    type: "tutorial",
                    resourceId: "functions-1",
                    estimatedTime: 60,
                    difficulty: "Beginner",
                    prerequisites: ["step-2"],
                },
                {
                    id: "step-4",
                    title: "Control Flow",
                    type: "tutorial",
                    resourceId: "control-flow-1",
                    estimatedTime: 60,
                    difficulty: "Beginner",
                    prerequisites: ["step-3"],
                },
                {
                    id: "step-5",
                    title: "Hello World Challenge",
                    type: "challenge",
                    resourceId: "hello-world",
                    estimatedTime: 15,
                    difficulty: "Beginner",
                    prerequisites: ["step-4"],
                },
                {
                    id: "step-6",
                    title: "Calculator Challenge",
                    type: "challenge",
                    resourceId: "calculator",
                    estimatedTime: 45,
                    difficulty: "Beginner",
                    prerequisites: ["step-5"],
                },
                {
                    id: "step-7",
                    title: "Data Structures",
                    type: "tutorial",
                    resourceId: "data-structures-1",
                    estimatedTime: 90,
                    difficulty: "Intermediate",
                    prerequisites: ["step-6"],
                },
                {
                    id: "step-8",
                    title: "To-Do List Challenge",
                    type: "challenge",
                    resourceId: "todo-list",
                    estimatedTime: 90,
                    difficulty: "Intermediate",
                    prerequisites: ["step-7"],
                },
            ],
        });

        // Intermediate to Advanced Path
        this.learningPaths.set("intermediate-to-advanced", {
            id: "intermediate-to-advanced",
            title: "Intermediate to Advanced Programming",
            description:
                "Path from intermediate concepts to advanced programming",
            difficultyLevel: "Intermediate",
            estimatedDuration: 90, // days
            topics: ["data-structures", "oop", "error-handling", "modules"],
            steps: [
                {
                    id: "step-1",
                    title: "Object-Oriented Programming",
                    type: "tutorial",
                    resourceId: "oop-1",
                    estimatedTime: 120, // minutes
                    difficulty: "Intermediate",
                    prerequisites: [],
                },
                {
                    id: "step-2",
                    title: "Quiz Application Challenge",
                    type: "challenge",
                    resourceId: "quiz-app",
                    estimatedTime: 120,
                    difficulty: "Intermediate",
                    prerequisites: ["step-1"],
                },
                {
                    id: "step-3",
                    title: "Error Handling",
                    type: "tutorial",
                    resourceId: "error-handling-1",
                    estimatedTime: 60,
                    difficulty: "Advanced",
                    prerequisites: ["step-2"],
                },
                {
                    id: "step-4",
                    title: "File Manager Challenge",
                    type: "challenge",
                    resourceId: "file-manager",
                    estimatedTime: 180,
                    difficulty: "Advanced",
                    prerequisites: ["step-3"],
                },
            ],
        });
    }

    isReady() {
        return this.isInitialized;
    }

    async generateLearningPath(userProfile) {
        if (!this.isReady()) {
            throw new Error("Learning path manager not initialized");
        }

        // Determine appropriate path based on user profile
        const userSkillLevel = userProfile.skillLevel || "Beginner";
        let pathId = "beginner-to-intermediate";

        if (userSkillLevel === "Intermediate") {
            pathId = "intermediate-to-advanced";
        } else if (
            userSkillLevel === "Advanced" ||
            userSkillLevel === "Expert"
        ) {
            // For advanced users, we might create a custom path or suggest expert resources
            pathId = "intermediate-to-advanced";
        }

        const basePath = this.learningPaths.get(pathId);
        if (!basePath) {
            throw new Error(`Learning path not found: ${pathId}`);
        }

        // Create personalized path for user
        const userPath = {
            id: `user-path-${userProfile.userId}-${Date.now()}`,
            userId: userProfile.userId,
            basePathId: pathId,
            title: basePath.title,
            description: basePath.description,
            startDate: new Date().toISOString(),
            estimatedCompletion: this.calculateEstimatedCompletion(
                basePath.estimatedDuration
            ),
            currentStep: 0,
            totalSteps: basePath.steps.length,
            completionPercentage: 0,
            difficultyLevel: basePath.difficultyLevel,
            topics: [...basePath.topics],
            steps: basePath.steps.map((step, index) => ({
                ...step,
                completed: false,
                completionDate: null,
                userProgress: 0, // 0-100%
            })),
            progressHistory: [],
        };

        // Store user path
        if (!this.userPaths.has(userProfile.userId)) {
            this.userPaths.set(userProfile.userId, []);
        }
        this.userPaths.get(userProfile.userId).push(userPath);

        return userPath;
    }

    calculateEstimatedCompletion(days) {
        const startDate = new Date();
        const completionDate = new Date();
        completionDate.setDate(startDate.getDate() + days);
        return completionDate.toISOString();
    }

    async getUserLearningPaths(userId) {
        if (!this.isReady()) {
            throw new Error("Learning path manager not initialized");
        }

        return this.userPaths.get(userId) || [];
    }

    async getCurrentLearningPath(userId) {
        if (!this.isReady()) {
            throw new Error("Learning path manager not initialized");
        }

        const userPaths = this.userPaths.get(userId) || [];
        if (userPaths.length === 0) {
            return null;
        }

        // Return the most recently created path
        return userPaths[userPaths.length - 1];
    }

    async updatePathProgress(userId, stepId, progress) {
        if (!this.isReady()) {
            throw new Error("Learning path manager not initialized");
        }

        const userPath = await this.getCurrentLearningPath(userId);
        if (!userPath) {
            throw new Error("No active learning path found for user");
        }

        // Find the step
        const stepIndex = userPath.steps.findIndex(
            (step) => step.id === stepId
        );
        if (stepIndex === -1) {
            throw new Error(`Step not found: ${stepId}`);
        }

        // Update step progress
        userPath.steps[stepIndex].userProgress = Math.min(
            100,
            Math.max(0, progress)
        );

        // If progress is 100%, mark as completed
        if (progress >= 100) {
            userPath.steps[stepIndex].completed = true;
            userPath.steps[stepIndex].completionDate = new Date().toISOString();

            // Update current step if this was the current step
            if (userPath.currentStep === stepIndex) {
                userPath.currentStep = Math.min(
                    userPath.currentStep + 1,
                    userPath.totalSteps - 1
                );
            }
        }

        // Update overall completion percentage
        const completedSteps = userPath.steps.filter(
            (step) => step.completed
        ).length;
        userPath.completionPercentage = Math.round(
            (completedSteps / userPath.totalSteps) * 100
        );

        // Add to progress history
        userPath.progressHistory.push({
            timestamp: new Date().toISOString(),
            stepId: stepId,
            progress: progress,
            overallCompletion: userPath.completionPercentage,
        });

        return userPath;
    }

    async getNextStep(userId) {
        if (!this.isReady()) {
            throw new Error("Learning path manager not initialized");
        }

        const userPath = await this.getCurrentLearningPath(userId);
        if (!userPath) {
            return null;
        }

        // If all steps are completed, return null
        if (userPath.currentStep >= userPath.totalSteps) {
            return null;
        }

        return userPath.steps[userPath.currentStep];
    }

    async getRecommendedPaths(userProfile) {
        if (!this.isReady()) {
            throw new Error("Learning path manager not initialized");
        }

        const userSkillLevel = userProfile.skillLevel || "Beginner";
        const recommendedPaths = [];

        // Recommend paths based on user skill level
        for (const [pathId, path] of this.learningPaths) {
            if (
                userSkillLevel === "Beginner" &&
                path.difficultyLevel === "Beginner"
            ) {
                recommendedPaths.push(path);
            } else if (
                userSkillLevel === "Intermediate" &&
                (path.difficultyLevel === "Beginner" ||
                    path.difficultyLevel === "Intermediate")
            ) {
                recommendedPaths.push(path);
            } else if (
                (userSkillLevel === "Advanced" ||
                    userSkillLevel === "Expert") &&
                path.difficultyLevel !== "Beginner"
            ) {
                recommendedPaths.push(path);
            }
        }

        return recommendedPaths;
    }

    async adaptPathDifficulty(userId, performanceMetrics) {
        if (!this.isReady()) {
            throw new Error("Learning path manager not initialized");
        }

        const userPath = await this.getCurrentLearningPath(userId);
        if (!userPath) {
            throw new Error("No active learning path found for user");
        }

        // Analyze performance metrics to determine if difficulty should be adjusted
        const { successRate, averageTime, confidenceLevel } =
            performanceMetrics;

        // Simple difficulty adaptation algorithm
        let difficultyAdjustment = 0;

        // Adjust based on success rate
        if (successRate < 0.5) {
            difficultyAdjustment = -1; // Make easier
        } else if (successRate > 0.9) {
            difficultyAdjustment = 1; // Make harder
        }

        // Adjust based on time (if completing too quickly, increase difficulty)
        // This would require more detailed metrics about expected vs actual completion time

        // Adjust based on confidence (if available)
        if (confidenceLevel !== undefined) {
            if (confidenceLevel < 0.3) {
                difficultyAdjustment = Math.min(difficultyAdjustment, -1); // Make easier
            } else if (confidenceLevel > 0.8) {
                difficultyAdjustment = Math.max(difficultyAdjustment, 1); // Make harder
            }
        }

        // Apply difficulty adjustment if needed
        if (difficultyAdjustment !== 0) {
            return this.adjustPathDifficulty(userPath, difficultyAdjustment);
        }

        return userPath;
    }

    adjustPathDifficulty(userPath, adjustment) {
        // This is a simplified implementation
        // In a real system, this would modify the actual steps or resources

        // For now, we'll just log the adjustment
        console.log(
            `Adjusting difficulty for user ${userPath.userId} by ${adjustment}`
        );

        // Add the adjustment to the path's metadata
        if (!userPath.difficultyAdjustments) {
            userPath.difficultyAdjustments = [];
        }

        userPath.difficultyAdjustments.push({
            timestamp: new Date().toISOString(),
            adjustment: adjustment,
            reason: "Performance-based adjustment",
        });

        return userPath;
    }
}

module.exports = LearningPathManager;
