// Skill Assessment for KODEON IDE
class SkillAssessment {
    constructor() {
        this.isInitialized = false;
        this.skillMetrics = {
            syntax: 0,
            controlFlow: 0,
            functions: 0,
            dataStructures: 0,
            oop: 0,
            errorHandling: 0,
            modules: 0,
        };
    }

    async initialize() {
        try {
            // Initialize skill assessment system
            this.skillMetrics = {
                syntax: 0,
                controlFlow: 0,
                functions: 0,
                dataStructures: 0,
                oop: 0,
                errorHandling: 0,
                modules: 0,
            };

            this.isInitialized = true;
            console.log("Skill assessment system initialized");
            return true;
        } catch (error) {
            console.error("Error initializing skill assessment system:", error);
            return false;
        }
    }

    isReady() {
        return this.isInitialized;
    }

    async assess(codeSamples) {
        if (!this.isReady()) {
            throw new Error("Skill assessment system not initialized");
        }

        if (!Array.isArray(codeSamples) || codeSamples.length === 0) {
            throw new Error("No code samples provided for assessment");
        }

        // Assess each code sample
        const assessments = codeSamples.map((sample) =>
            this.analyzeCodeSample(sample)
        );

        // Calculate overall skill level
        const overallSkill = this.calculateOverallSkill(assessments);

        return {
            timestamp: new Date().toISOString(),
            overallSkill: overallSkill,
            detailedAssessment: assessments,
            recommendations: this.generateRecommendations(overallSkill),
        };
    }

    analyzeCodeSample(code) {
        const assessment = {
            syntax: this.assessSyntax(code),
            controlFlow: this.assessControlFlow(code),
            functions: this.assessFunctions(code),
            dataStructures: this.assessDataStructures(code),
            oop: this.assessOOP(code),
            errorHandling: this.assessErrorHandling(code),
            modules: this.assessModules(code),
        };

        return assessment;
    }

    assessSyntax(code) {
        let score = 0;

        // Check for proper syntax elements
        if (code.includes(";")) {
            score += 10; // KODEON doesn't use semicolons, so this might indicate confusion
        }

        if (code.includes("{") && code.includes("}")) {
            score += 10; // KODEON doesn't use braces, so this might indicate confusion
        }

        // Check for proper KODEON syntax
        const kodeonKeywords = [
            "buat",
            "create",
            "jika",
            "if",
            "fungsi",
            "function",
            "kelas",
            "class",
            "tampilkan",
            "show",
        ];

        const keywordCount = kodeonKeywords.filter((keyword) =>
            code.includes(keyword)
        ).length;
        score += Math.min(keywordCount * 5, 50); // Max 50 points for keywords

        // Check for syntax errors (simplified)
        const syntaxErrors = (code.match(/syntax\s*error/i) || []).length;
        score -= syntaxErrors * 10;

        return Math.max(0, Math.min(100, score));
    }

    assessControlFlow(code) {
        let score = 0;

        // Check for control flow structures
        const ifStatements = (code.match(/(?:jika|if)/g) || []).length;
        const loopStatements = (code.match(/(?:selama|while|untuk|for)/g) || [])
            .length;
        const conditionalStatements = (
            code.match(/sebaliknya|otherwise/g) || []
        ).length;

        score += Math.min(ifStatements * 10, 30);
        score += Math.min(loopStatements * 10, 30);
        score += Math.min(conditionalStatements * 10, 20);

        return Math.max(0, Math.min(100, score));
    }

    assessFunctions(code) {
        let score = 0;

        // Check for function definitions
        const functionDefs = (code.match(/(?:fungsi|function)/g) || []).length;
        score += Math.min(functionDefs * 15, 50);

        // Check for function calls
        // This is a simplified check - in reality, we'd need a proper parser
        const functionCalls = (code.match(/\w+\s*\(/g) || []).length;
        score += Math.min(functionCalls * 5, 30);

        // Check for return statements
        const returnStatements = (code.match(/(?:kembalikan|return)/g) || [])
            .length;
        score += Math.min(returnStatements * 10, 20);

        return Math.max(0, Math.min(100, score));
    }

    assessDataStructures(code) {
        let score = 0;

        // Check for array usage
        const arrayUsage = (code.match(/\[/g) || []).length;
        score += Math.min(arrayUsage * 5, 25);

        // Check for object/dictionary usage
        const objectUsage = (code.match(/:/g) || []).length;
        score += Math.min(objectUsage * 5, 25);

        // Check for list operations
        const listOps = [
            "tambah",
            "hapus",
            "panjang",
            "add",
            "remove",
            "length",
        ];
        const listOpCount = listOps.filter((op) => code.includes(op)).length;
        score += Math.min(listOpCount * 10, 30);

        // Check for iteration
        const iteration = (code.match(/(?:untuk|for).*di/g) || []).length;
        score += Math.min(iteration * 10, 20);

        return Math.max(0, Math.min(100, score));
    }

    assessOOP(code) {
        let score = 0;

        // Check for class definitions
        const classDefs = (code.match(/(?:kelas|class)/g) || []).length;
        score += Math.min(classDefs * 20, 60);

        // Check for object instantiation
        const newInstances = (code.match(/baru|new/g) || []).length;
        score += Math.min(newInstances * 10, 20);

        // Check for method calls
        const methodCalls = (code.match(/\w+\.\w+/g) || []).length;
        score += Math.min(methodCalls * 5, 20);

        return Math.max(0, Math.min(100, score));
    }

    assessErrorHandling(code) {
        let score = 0;

        // Check for try/catch blocks
        const tryBlocks = (code.match(/coba|try/g) || []).length;
        const catchBlocks = (code.match(/tangkap|catch/g) || []).length;

        score += Math.min(tryBlocks * 20, 50);
        score += Math.min(catchBlocks * 10, 30);

        // Check for throw statements
        const throwStatements = (code.match(/lempar|throw/g) || []).length;
        score += Math.min(throwStatements * 10, 20);

        return Math.max(0, Math.min(100, score));
    }

    assessModules(code) {
        let score = 0;

        // Check for import statements
        const importStatements = (code.match(/impor|import/g) || []).length;
        score += Math.min(importStatements * 20, 60);

        // Check for module usage
        const moduleUsage = (code.match(/\w+\.\w+/g) || []).length;
        score += Math.min(moduleUsage * 5, 40);

        return Math.max(0, Math.min(100, score));
    }

    calculateOverallSkill(assessments) {
        if (assessments.length === 0) {
            return 0;
        }

        // Calculate average scores across all assessments
        const totals = {
            syntax: 0,
            controlFlow: 0,
            functions: 0,
            dataStructures: 0,
            oop: 0,
            errorHandling: 0,
            modules: 0,
        };

        assessments.forEach((assessment) => {
            totals.syntax += assessment.syntax;
            totals.controlFlow += assessment.controlFlow;
            totals.functions += assessment.functions;
            totals.dataStructures += assessment.dataStructures;
            totals.oop += assessment.oop;
            totals.errorHandling += assessment.errorHandling;
            totals.modules += assessment.modules;
        });

        const averages = {
            syntax: totals.syntax / assessments.length,
            controlFlow: totals.controlFlow / assessments.length,
            functions: totals.functions / assessments.length,
            dataStructures: totals.dataStructures / assessments.length,
            oop: totals.oop / assessments.length,
            errorHandling: totals.errorHandling / assessments.length,
            modules: totals.modules / assessments.length,
        };

        // Weighted average based on importance
        const weightedScore =
            averages.syntax * 0.15 +
            averages.controlFlow * 0.15 +
            averages.functions * 0.2 +
            averages.dataStructures * 0.15 +
            averages.oop * 0.15 +
            averages.errorHandling * 0.1 +
            averages.modules * 0.1;

        // Categorize skill level
        let skillLevel = "Beginner";
        if (weightedScore >= 80) {
            skillLevel = "Expert";
        } else if (weightedScore >= 60) {
            skillLevel = "Advanced";
        } else if (weightedScore >= 40) {
            skillLevel = "Intermediate";
        }

        return {
            score: Math.round(weightedScore),
            level: skillLevel,
            breakdown: averages,
        };
    }

    generateRecommendations(overallSkill) {
        const recommendations = [];

        switch (overallSkill.level) {
            case "Beginner":
                recommendations.push({
                    type: "tutorial",
                    title: "Getting Started with KODEON",
                    description:
                        "Learn the basics of KODEON syntax and structure",
                    priority: "high",
                });
                recommendations.push({
                    type: "challenge",
                    title: "Hello World Challenge",
                    description: "Write your first KODEON program",
                    priority: "high",
                });
                break;

            case "Intermediate":
                recommendations.push({
                    type: "tutorial",
                    title: "Functions and Control Flow",
                    description: "Master functions, loops, and conditionals",
                    priority: "medium",
                });
                recommendations.push({
                    type: "challenge",
                    title: "Calculator Challenge",
                    description: "Build a simple calculator application",
                    priority: "medium",
                });
                break;

            case "Advanced":
                recommendations.push({
                    type: "tutorial",
                    title: "Object-Oriented Programming",
                    description: "Learn advanced OOP concepts in KODEON",
                    priority: "low",
                });
                recommendations.push({
                    type: "challenge",
                    title: "Data Structure Challenge",
                    description: "Implement a complex data structure",
                    priority: "medium",
                });
                break;

            case "Expert":
                recommendations.push({
                    type: "tutorial",
                    title: "Advanced KODEON Patterns",
                    description: "Learn design patterns and best practices",
                    priority: "low",
                });
                recommendations.push({
                    type: "challenge",
                    title: "Module Development Challenge",
                    description: "Create a reusable KODEON module",
                    priority: "low",
                });
                break;
        }

        return recommendations;
    }
}

module.exports = SkillAssessment;
