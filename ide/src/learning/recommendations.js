// Recommendation Engine for KODEON IDE
class RecommendationEngine {
    constructor() {
        this.isInitialized = false;
        this.tutorials = [];
        this.challenges = [];
        this.userProfiles = new Map();
    }

    async initialize() {
        try {
            // Initialize with sample tutorials and challenges
            this.tutorials = [
                {
                    id: "basics-1",
                    title: "Introduction to KODEON",
                    description:
                        "Learn the fundamentals of the KODEON programming language",
                    difficulty: "Beginner",
                    estimatedTime: 30, // minutes
                    topics: ["syntax", "variables", "output"],
                    prerequisites: [],
                },
                {
                    id: "functions-1",
                    title: "Functions in KODEON",
                    description: "Learn how to create and use functions",
                    difficulty: "Beginner",
                    estimatedTime: 45,
                    topics: ["functions", "parameters", "return"],
                    prerequisites: ["basics-1"],
                },
                {
                    id: "control-flow-1",
                    title: "Control Flow",
                    description: "Master conditionals and loops",
                    difficulty: "Beginner",
                    estimatedTime: 60,
                    topics: ["if", "jika", "for", "while", "loops"],
                    prerequisites: ["basics-1"],
                },
                {
                    id: "data-structures-1",
                    title: "Data Structures",
                    description: "Learn about arrays, lists, and dictionaries",
                    difficulty: "Intermediate",
                    estimatedTime: 90,
                    topics: ["arrays", "lists", "dictionaries"],
                    prerequisites: ["functions-1"],
                },
                {
                    id: "oop-1",
                    title: "Object-Oriented Programming",
                    description: "Learn about classes and objects",
                    difficulty: "Intermediate",
                    estimatedTime: 120,
                    topics: ["classes", "objects", "inheritance"],
                    prerequisites: ["data-structures-1"],
                },
                {
                    id: "error-handling-1",
                    title: "Error Handling",
                    description: "Learn how to handle errors gracefully",
                    difficulty: "Advanced",
                    estimatedTime: 60,
                    topics: ["try", "catch", "exceptions"],
                    prerequisites: ["oop-1"],
                },
            ];

            this.challenges = [
                {
                    id: "hello-world",
                    title: "Hello World",
                    description: "Write your first KODEON program",
                    difficulty: "Beginner",
                    estimatedTime: 15,
                    skills: ["syntax", "output"],
                    reward: "Beginner Badge",
                },
                {
                    id: "calculator",
                    title: "Simple Calculator",
                    description:
                        "Create a calculator that performs basic operations",
                    difficulty: "Beginner",
                    estimatedTime: 45,
                    skills: ["functions", "control-flow"],
                    reward: "Calculator Badge",
                },
                {
                    id: "todo-list",
                    title: "To-Do List",
                    description: "Build a simple to-do list application",
                    difficulty: "Intermediate",
                    estimatedTime: 90,
                    skills: ["data-structures", "functions"],
                    reward: "Productivity Badge",
                },
                {
                    id: "quiz-app",
                    title: "Quiz Application",
                    description:
                        "Create a quiz application with multiple questions",
                    difficulty: "Intermediate",
                    estimatedTime: 120,
                    skills: ["classes", "data-structures", "control-flow"],
                    reward: "Quiz Master Badge",
                },
                {
                    id: "file-manager",
                    title: "File Manager",
                    description: "Build a simple file management system",
                    difficulty: "Advanced",
                    estimatedTime: 180,
                    skills: ["modules", "error-handling", "data-structures"],
                    reward: "File Expert Badge",
                },
            ];

            this.isInitialized = true;
            console.log("Recommendation engine initialized");
            return true;
        } catch (error) {
            console.error("Error initializing recommendation engine:", error);
            return false;
        }
    }

    isReady() {
        return this.isInitialized;
    }

    async getTutorials(userProfile) {
        if (!this.isReady()) {
            throw new Error("Recommendation engine not initialized");
        }

        // Get user's skill level
        const skillLevel = userProfile.skillLevel || "Beginner";

        // Filter tutorials by skill level and prerequisites
        const relevantTutorials = this.tutorials.filter((tutorial) => {
            // Match skill level
            if (
                skillLevel === "Beginner" &&
                tutorial.difficulty !== "Beginner"
            ) {
                return false;
            }

            if (
                skillLevel === "Intermediate" &&
                (tutorial.difficulty === "Advanced" ||
                    tutorial.difficulty === "Expert")
            ) {
                return false;
            }

            // Check if user has completed prerequisites
            if (userProfile.completedTutorials) {
                const hasPrerequisites = tutorial.prerequisites.every(
                    (prereq) => userProfile.completedTutorials.includes(prereq)
                );
                return hasPrerequisites;
            }

            // For users without completed tutorials, only show beginner tutorials without prerequisites
            return (
                tutorial.difficulty === "Beginner" &&
                tutorial.prerequisites.length === 0
            );
        });

        // Sort by relevance and estimated time
        relevantTutorials.sort((a, b) => {
            // Prioritize tutorials that match user's current skill level
            if (a.difficulty === skillLevel && b.difficulty !== skillLevel)
                return -1;
            if (b.difficulty === skillLevel && a.difficulty !== skillLevel)
                return 1;

            // Then sort by estimated time (shorter first)
            return a.estimatedTime - b.estimatedTime;
        });

        return relevantTutorials;
    }

    async getChallenges(userProfile) {
        if (!this.isReady()) {
            throw new Error("Recommendation engine not initialized");
        }

        // Get user's skill level
        const skillLevel = userProfile.skillLevel || "Beginner";

        // Filter challenges by skill level
        const relevantChallenges = this.challenges.filter((challenge) => {
            if (skillLevel === "Beginner") {
                return challenge.difficulty === "Beginner";
            }

            if (skillLevel === "Intermediate") {
                return (
                    challenge.difficulty === "Beginner" ||
                    challenge.difficulty === "Intermediate"
                );
            }

            if (skillLevel === "Advanced" || skillLevel === "Expert") {
                return challenge.difficulty !== "Expert"; // Exclude expert-only challenges for now
            }

            return challenge.difficulty === "Beginner";
        });

        // Sort by relevance and estimated time
        relevantChallenges.sort((a, b) => {
            // Prioritize challenges that match user's current skill level
            if (a.difficulty === skillLevel && b.difficulty !== skillLevel)
                return -1;
            if (b.difficulty === skillLevel && a.difficulty !== skillLevel)
                return 1;

            // Then sort by estimated time (shorter first)
            return a.estimatedTime - b.estimatedTime;
        });

        return relevantChallenges;
    }

    async getPersonalizedRecommendations(userProfile) {
        if (!this.isReady()) {
            throw new Error("Recommendation engine not initialized");
        }

        // Get tutorials and challenges
        const tutorials = await this.getTutorials(userProfile);
        const challenges = await this.getChallenges(userProfile);

        // Combine and prioritize based on user profile
        const recommendations = [];

        // Add tutorials
        tutorials.slice(0, 3).forEach((tutorial) => {
            recommendations.push({
                type: "tutorial",
                ...tutorial,
                priority: this.calculatePriority(
                    tutorial,
                    userProfile,
                    "tutorial"
                ),
            });
        });

        // Add challenges
        challenges.slice(0, 2).forEach((challenge) => {
            recommendations.push({
                type: "challenge",
                ...challenge,
                priority: this.calculatePriority(
                    challenge,
                    userProfile,
                    "challenge"
                ),
            });
        });

        // Sort by priority
        recommendations.sort((a, b) => b.priority - a.priority);

        return recommendations;
    }

    calculatePriority(item, userProfile, type) {
        let priority = 0;

        // Base priority based on difficulty match
        const difficultyWeights = {
            Beginner: 1,
            Intermediate: 2,
            Advanced: 3,
            Expert: 4,
        };

        const userLevelWeight = difficultyWeights[userProfile.skillLevel] || 1;
        const itemLevelWeight = difficultyWeights[item.difficulty] || 1;

        // Higher priority for items slightly above user level
        if (itemLevelWeight === userLevelWeight + 1) {
            priority += 30;
        } else if (itemLevelWeight === userLevelWeight) {
            priority += 20;
        } else if (itemLevelWeight < userLevelWeight) {
            priority += 10;
        }

        // Adjust for time estimate
        if (item.estimatedTime <= 30) {
            priority += 10;
        } else if (item.estimatedTime <= 60) {
            priority += 5;
        }

        // Adjust for user interests (if available)
        if (userProfile.interests) {
            const matchingTopics = item.topics
                ? item.topics.filter((topic) =>
                      userProfile.interests.includes(topic)
                  ).length
                : 0;
            priority += matchingTopics * 5;
        }

        // Adjust for completion status
        if (type === "tutorial" && userProfile.completedTutorials) {
            if (userProfile.completedTutorials.includes(item.id)) {
                priority -= 50; // Lower priority for completed items
            }
        }

        if (type === "challenge" && userProfile.completedChallenges) {
            if (userProfile.completedChallenges.includes(item.id)) {
                priority -= 50; // Lower priority for completed items
            }
        }

        return priority;
    }

    async updateRecommendations(userId, activity) {
        if (!this.isReady()) {
            throw new Error("Recommendation engine not initialized");
        }

        // Update user profile based on activity
        if (!this.userProfiles.has(userId)) {
            this.userProfiles.set(userId, {
                skillLevel: "Beginner",
                completedTutorials: [],
                completedChallenges: [],
                interests: [],
                lastActivity: new Date(),
            });
        }

        const userProfile = this.userProfiles.get(userId);

        // Update based on activity type
        if (activity.type === "tutorial_completed") {
            if (!userProfile.completedTutorials.includes(activity.tutorialId)) {
                userProfile.completedTutorials.push(activity.tutorialId);
            }
        } else if (activity.type === "challenge_completed") {
            if (
                !userProfile.completedChallenges.includes(activity.challengeId)
            ) {
                userProfile.completedChallenges.push(activity.challengeId);
            }
        } else if (activity.type === "interest_declared") {
            if (!userProfile.interests.includes(activity.interest)) {
                userProfile.interests.push(activity.interest);
            }
        }

        userProfile.lastActivity = new Date();

        // Update skill level based on completed items
        userProfile.skillLevel = this.assessSkillLevelFromActivity(userProfile);

        // Save updated profile
        this.userProfiles.set(userId, userProfile);

        return await this.getPersonalizedRecommendations(userProfile);
    }

    assessSkillLevelFromActivity(userProfile) {
        const completedItems = [
            ...userProfile.completedTutorials,
            ...userProfile.completedChallenges,
        ];

        // Count advanced items
        const advancedItems = completedItems.filter((itemId) => {
            const tutorial = this.tutorials.find((t) => t.id === itemId);
            const challenge = this.challenges.find((c) => c.id === itemId);
            const item = tutorial || challenge;
            return (
                item &&
                (item.difficulty === "Advanced" || item.difficulty === "Expert")
            );
        }).length;

        // Count intermediate items
        const intermediateItems = completedItems.filter((itemId) => {
            const tutorial = this.tutorials.find((t) => t.id === itemId);
            const challenge = this.challenges.find((c) => c.id === itemId);
            const item = tutorial || challenge;
            return item && item.difficulty === "Intermediate";
        }).length;

        // Determine skill level based on completed items
        if (advancedItems >= 2) {
            return "Expert";
        } else if (advancedItems >= 1 || intermediateItems >= 3) {
            return "Advanced";
        } else if (intermediateItems >= 1) {
            return "Intermediate";
        } else {
            return "Beginner";
        }
    }
}

module.exports = RecommendationEngine;
