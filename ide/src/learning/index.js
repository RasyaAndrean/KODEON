// Learning System Manager for KODEON IDE
const SkillAssessment = require("./skill-assessment");
const RecommendationEngine = require("./recommendations");
const ProgressTracker = require("./progress-tracking");
const ChallengeGenerator = require("./challenges");
const LearningPathManager = require("./path-manager");
const GoalManager = require("./goal-manager");
const AnalyticsEngine = require("./analytics");

class LearningSystemManager {
    constructor() {
        this.skillAssessment = new SkillAssessment();
        this.recommendationEngine = new RecommendationEngine();
        this.progressTracker = new ProgressTracker();
        this.challengeGenerator = new ChallengeGenerator();
        this.pathManager = new LearningPathManager();
        this.goalManager = new GoalManager();
        this.analyticsEngine = new AnalyticsEngine();
        this.isInitialized = false;
    }

    async initialize() {
        try {
            // Initialize all learning services
            await this.skillAssessment.initialize();
            await this.recommendationEngine.initialize();
            await this.progressTracker.initialize();
            await this.challengeGenerator.initialize();
            await this.pathManager.initialize();
            await this.goalManager.initialize();
            await this.analyticsEngine.initialize();

            this.isInitialized = true;
            console.log("Learning system initialized successfully");
            return true;
        } catch (error) {
            console.error("Error initializing learning system:", error);
            return false;
        }
    }

    isReady() {
        return this.isInitialized;
    }

    // Skill assessment methods
    async assessSkillLevel(codeSamples) {
        if (!this.isReady()) {
            throw new Error("Learning system not initialized");
        }

        return await this.skillAssessment.assess(codeSamples);
    }

    // Recommendation methods
    async getTutorialRecommendations(userProfile) {
        if (!this.isReady()) {
            throw new Error("Learning system not initialized");
        }

        return await this.recommendationEngine.getTutorials(userProfile);
    }

    async getChallengeRecommendations(userProfile) {
        if (!this.isReady()) {
            throw new Error("Learning system not initialized");
        }

        return await this.recommendationEngine.getChallenges(userProfile);
    }

    async getPersonalizedRecommendations(userProfile) {
        if (!this.isReady()) {
            throw new Error("Learning system not initialized");
        }

        return await this.recommendationEngine.getPersonalizedRecommendations(
            userProfile
        );
    }

    // Progress tracking methods
    async trackProgress(userId, activity) {
        if (!this.isReady()) {
            throw new Error("Learning system not initialized");
        }

        // Record activity in analytics engine
        await this.analyticsEngine.recordActivity(userId, activity);

        // Update progress tracker
        const progressResult = await this.progressTracker.recordActivity(
            userId,
            activity
        );

        // Update goal progress if applicable
        const goalUpdates =
            await this.goalManager.updateGoalProgressFromActivity(
                userId,
                activity
            );

        return {
            progress: progressResult,
            goalUpdates: goalUpdates,
        };
    }

    async getUserProgress(userId) {
        if (!this.isReady()) {
            throw new Error("Learning system not initialized");
        }

        return await this.progressTracker.getProgress(userId);
    }

    // Challenge generation methods
    async generatePersonalizedChallenge(userProfile, skillLevel) {
        if (!this.isReady()) {
            throw new Error("Learning system not initialized");
        }

        return await this.challengeGenerator.createChallenge(
            userProfile,
            skillLevel
        );
    }

    async generateSkillSpecificChallenge(skillArea, difficulty) {
        if (!this.isReady()) {
            throw new Error("Learning system not initialized");
        }

        return await this.challengeGenerator.createSkillChallenge(
            skillArea,
            difficulty
        );
    }

    // Learning path methods
    async generateLearningPath(userProfile) {
        if (!this.isReady()) {
            throw new Error("Learning system not initialized");
        }

        return await this.pathManager.generateLearningPath(userProfile);
    }

    async getUserLearningPaths(userId) {
        if (!this.isReady()) {
            throw new Error("Learning system not initialized");
        }

        return await this.pathManager.getUserLearningPaths(userId);
    }

    async getCurrentLearningPath(userId) {
        if (!this.isReady()) {
            throw new Error("Learning system not initialized");
        }

        return await this.pathManager.getCurrentLearningPath(userId);
    }

    async updatePathProgress(userId, stepId, progress) {
        if (!this.isReady()) {
            throw new Error("Learning system not initialized");
        }

        return await this.pathManager.updatePathProgress(
            userId,
            stepId,
            progress
        );
    }

    async getNextStep(userId) {
        if (!this.isReady()) {
            throw new Error("Learning system not initialized");
        }

        return await this.pathManager.getNextStep(userId);
    }

    async getRecommendedPaths(userProfile) {
        if (!this.isReady()) {
            throw new Error("Learning system not initialized");
        }

        return await this.pathManager.getRecommendedPaths(userProfile);
    }

    async adaptPathDifficulty(userId, performanceMetrics) {
        if (!this.isReady()) {
            throw new Error("Learning system not initialized");
        }

        return await this.pathManager.adaptPathDifficulty(
            userId,
            performanceMetrics
        );
    }

    // Goal management methods
    async createGoal(userId, goalDefinition) {
        if (!this.isReady()) {
            throw new Error("Learning system not initialized");
        }

        return await this.goalManager.createGoal(userId, goalDefinition);
    }

    async createGoalFromTemplate(userId, templateId, customizations = {}) {
        if (!this.isReady()) {
            throw new Error("Learning system not initialized");
        }

        return await this.goalManager.createGoalFromTemplate(
            userId,
            templateId,
            customizations
        );
    }

    async getUserGoals(userId) {
        if (!this.isReady()) {
            throw new Error("Learning system not initialized");
        }

        return await this.goalManager.getUserGoals(userId);
    }

    async getActiveGoals(userId) {
        if (!this.isReady()) {
            throw new Error("Learning system not initialized");
        }

        return await this.goalManager.getActiveGoals(userId);
    }

    async getCompletedGoals(userId) {
        if (!this.isReady()) {
            throw new Error("Learning system not initialized");
        }

        return await this.goalManager.getCompletedGoals(userId);
    }

    async updateGoalProgress(userId, goalId, progress) {
        if (!this.isReady()) {
            throw new Error("Learning system not initialized");
        }

        return await this.goalManager.updateGoalProgress(
            userId,
            goalId,
            progress
        );
    }

    async getGoalTemplates() {
        if (!this.isReady()) {
            throw new Error("Learning system not initialized");
        }

        return await this.goalManager.getGoalTemplates();
    }

    async getGoalStatistics(userId) {
        if (!this.isReady()) {
            throw new Error("Learning system not initialized");
        }

        return await this.goalManager.getGoalStatistics(userId);
    }

    // Analytics methods
    async getUserAnalytics(userId) {
        if (!this.isReady()) {
            throw new Error("Learning system not initialized");
        }

        return await this.analyticsEngine.getUserAnalytics(userId);
    }

    async getDailyActivity(userId, days = 30) {
        if (!this.isReady()) {
            throw new Error("Learning system not initialized");
        }

        return await this.analyticsEngine.getDailyActivity(userId, days);
    }

    async getWeeklySummary(userId, weeks = 12) {
        if (!this.isReady()) {
            throw new Error("Learning system not initialized");
        }

        return await this.analyticsEngine.getWeeklySummary(userId, weeks);
    }

    async getSkillProgression(userId) {
        if (!this.isReady()) {
            throw new Error("Learning system not initialized");
        }

        return await this.analyticsEngine.getSkillProgression(userId);
    }

    async getLearningInsights(userId) {
        if (!this.isReady()) {
            throw new Error("Learning system not initialized");
        }

        return await this.analyticsEngine.getLearningInsights(userId);
    }

    async getComparisonData(userId) {
        if (!this.isReady()) {
            throw new Error("Learning system not initialized");
        }

        return await this.analyticsEngine.getComparisonData(userId);
    }
}

module.exports = new LearningSystemManager();
