// AI Service Manager for KODEON IDE
const CodeCompletionEngine = require("./completion/engine");
const NLPProcessor = require("./nlp/parser");
const QualityAnalyzer = require("./analysis/quality");

class AIServiceManager {
    constructor() {
        this.codeCompletionEngine = new CodeCompletionEngine();
        this.nlpProcessor = new NLPProcessor();
        this.qualityAnalyzer = new QualityAnalyzer();
        this.isInitialized = false;
    }

    async initialize() {
        try {
            // Initialize all AI services
            await this.codeCompletionEngine.initialize();
            await this.nlpProcessor.initialize();
            await this.qualityAnalyzer.initialize();

            this.isInitialized = true;
            console.log("AI services initialized successfully");
            return true;
        } catch (error) {
            console.error("Error initializing AI services:", error);
            return false;
        }
    }

    isReady() {
        return this.isInitialized;
    }

    // Code completion methods
    async getCodeSuggestions(context) {
        if (!this.isReady()) {
            throw new Error("AI services not initialized");
        }

        return await this.codeCompletionEngine.getSuggestions(context);
    }

    async getAdvancedCodeSuggestions(context) {
        if (!this.isReady()) {
            throw new Error("AI services not initialized");
        }

        return await this.codeCompletionEngine.getAdvancedSuggestions(context);
    }

    async learnFromContext(context) {
        if (!this.isReady()) {
            throw new Error("AI services not initialized");
        }

        return await this.codeCompletionEngine.learnFromContext(context);
    }

    // NLP processing methods
    async parseNaturalLanguage(text) {
        if (!this.isReady()) {
            throw new Error("AI services not initialized");
        }

        return await this.nlpProcessor.parse(text);
    }

    async generateCodeFromComment(comment) {
        if (!this.isReady()) {
            throw new Error("AI services not initialized");
        }

        return await this.nlpProcessor.generateFromComment(comment);
    }

    async explainError(error) {
        if (!this.isReady()) {
            throw new Error("AI services not initialized");
        }

        return await this.nlpProcessor.explainError(error);
    }

    async parseComplexRequest(text) {
        if (!this.isReady()) {
            throw new Error("AI services not initialized");
        }

        return await this.nlpProcessor.parseComplexRequest(text);
    }

    async generateDocumentationForCode(code) {
        if (!this.isReady()) {
            throw new Error("AI services not initialized");
        }

        return await this.nlpProcessor.generateDocumentationForCode(code);
    }

    async improveCodeWithSuggestions(code, suggestions) {
        if (!this.isReady()) {
            throw new Error("AI services not initialized");
        }

        return await this.nlpProcessor.improveCodeWithSuggestions(
            code,
            suggestions
        );
    }

    // Quality analysis methods
    async analyzeCodeQuality(code) {
        if (!this.isReady()) {
            throw new Error("AI services not initialized");
        }

        return await this.qualityAnalyzer.analyze(code);
    }

    async getBestPracticeSuggestions(code) {
        if (!this.isReady()) {
            throw new Error("AI services not initialized");
        }

        return await this.qualityAnalyzer.getBestPracticeSuggestions(code);
    }

    async getPerformanceOptimizationTips(code) {
        if (!this.isReady()) {
            throw new Error("AI services not initialized");
        }

        return await this.qualityAnalyzer.getPerformanceTips(code);
    }

    async scanForSecurityIssues(code) {
        if (!this.isReady()) {
            throw new Error("AI services not initialized");
        }

        return await this.qualityAnalyzer.scanForSecurityIssues(code);
    }

    async getRefactoringSuggestions(code) {
        if (!this.isReady()) {
            throw new Error("AI services not initialized");
        }

        return await this.qualityAnalyzer.getRefactoringSuggestions(code);
    }
}

module.exports = new AIServiceManager();
