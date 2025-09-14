// Code Quality Analyzer for KODEON IDE
class QualityAnalyzer {
    constructor() {
        this.isInitialized = false;
        this.analysisRules = [];
        this.refactoringRules = [];
        this.securityRules = [];
    }

    async initialize() {
        try {
            // Initialize analysis rules
            this.analysisRules = [
                {
                    id: "naming-convention",
                    name: "Naming Convention Check",
                    description:
                        "Check if variable and function names follow conventions",
                    severity: "warning",
                    check: this.checkNamingConvention.bind(this),
                },
                {
                    id: "complexity",
                    name: "Complexity Analysis",
                    description: "Analyze code complexity",
                    severity: "info",
                    check: this.analyzeComplexity.bind(this),
                },
                {
                    id: "duplicate-code",
                    name: "Duplicate Code Detection",
                    description: "Detect duplicate code blocks",
                    severity: "warning",
                    check: this.detectDuplicateCode.bind(this),
                },
                {
                    id: "best-practices",
                    name: "Best Practices",
                    description: "Check for best coding practices",
                    severity: "info",
                    check: this.checkBestPractices.bind(this),
                },
                {
                    id: "performance",
                    name: "Performance Analysis",
                    description: "Analyze code performance",
                    severity: "info",
                    check: this.analyzePerformance.bind(this),
                },
                {
                    id: "neural-network-patterns",
                    name: "Neural Network Pattern Analysis",
                    description: "Analyze neural network code patterns",
                    severity: "info",
                    check: this.analyzeNeuralNetworkPatterns.bind(this),
                },
                {
                    id: "quantum-computing-patterns",
                    name: "Quantum Computing Pattern Analysis",
                    description: "Analyze quantum computing code patterns",
                    severity: "info",
                    check: this.analyzeQuantumComputingPatterns.bind(this),
                },
            ];

            // Initialize refactoring rules
            this.refactoringRules = [
                {
                    id: "extract-function",
                    name: "Extract Function",
                    description: "Suggest extracting code into functions",
                    severity: "info",
                    check: this.suggestExtractFunction.bind(this),
                },
                {
                    id: "simplify-conditionals",
                    name: "Simplify Conditionals",
                    description: "Suggest simplifying complex conditionals",
                    severity: "info",
                    check: this.suggestSimplifyConditionals.bind(this),
                },
                {
                    id: "remove-duplicate-code",
                    name: "Remove Duplicate Code",
                    description: "Suggest removing duplicate code blocks",
                    severity: "warning",
                    check: this.suggestRemoveDuplicateCode.bind(this),
                },
                {
                    id: "optimize-loops",
                    name: "Optimize Loops",
                    description: "Suggest optimizing loop structures",
                    severity: "info",
                    check: this.suggestOptimizeLoops.bind(this),
                },
            ];

            // Initialize security rules
            this.securityRules = [
                {
                    id: "sql-injection",
                    name: "SQL Injection Detection",
                    description:
                        "Detect potential SQL injection vulnerabilities",
                    severity: "high",
                    check: this.detectSQLInjection.bind(this),
                },
                {
                    id: "xss",
                    name: "XSS Detection",
                    description: "Detect potential XSS vulnerabilities",
                    severity: "high",
                    check: this.detectXSS.bind(this),
                },
                {
                    id: "hardcoded-secrets",
                    name: "Hardcoded Secrets Detection",
                    description: "Detect hardcoded sensitive information",
                    severity: "high",
                    check: this.detectHardcodedSecrets.bind(this),
                },
                {
                    id: "insecure-random",
                    name: "Insecure Random Detection",
                    description: "Detect insecure random number generation",
                    severity: "medium",
                    check: this.detectInsecureRandom.bind(this),
                },
                {
                    id: "neural-network-security",
                    name: "Neural Network Security",
                    description: "Detect neural network security issues",
                    severity: "medium",
                    check: this.detectNeuralNetworkSecurityIssues.bind(this),
                },
                {
                    id: "quantum-computing-security",
                    name: "Quantum Computing Security",
                    description: "Detect quantum computing security issues",
                    severity: "medium",
                    check: this.detectQuantumComputingSecurityIssues.bind(this),
                },
            ];

            this.isInitialized = true;
            console.log("Enhanced quality analyzer initialized");
            return true;
        } catch (error) {
            console.error("Error initializing quality analyzer:", error);
            return false;
        }
    }

    isReady() {
        return this.isInitialized;
    }

    // Add new refactoring suggestion methods
    suggestExtractFunction(code, issues) {
        const suggestions = [];

        // Look for repeated code blocks that could be extracted
        const functionPattern = /fungsi\s+\w+\s*\([^)]*\)\s*\{[^}]*\}/g;
        const matches = code.match(functionPattern) || [];

        // Simple heuristic: if a function is very long, suggest extracting parts
        matches.forEach((func, index) => {
            const lines = func.split("\n");
            if (lines.length > 20) {
                suggestions.push({
                    type: "refactor",
                    priority: "medium",
                    message:
                        "Consider extracting parts of this long function into smaller functions",
                    location: {
                        line: code.substring(0, code.indexOf(func)).split("\n")
                            .length,
                    },
                    suggestion:
                        "Extract complex logic into separate helper functions",
                });
            }
        });

        return suggestions;
    }

    suggestSimplifyConditionals(code, issues) {
        const suggestions = [];

        // Look for complex conditional statements
        const complexIfPattern =
            /jika\s*\([^)]*\)\s*\{[^}]*\}\s*(atau jika|else)/g;
        const matches = code.match(complexIfPattern) || [];

        matches.forEach((conditional, index) => {
            // If conditional has many conditions, suggest simplification
            if ((conditional.match(/&&|\|\|/g) || []).length > 3) {
                suggestions.push({
                    type: "refactor",
                    priority: "medium",
                    message:
                        "This conditional statement is complex and could be simplified",
                    location: {
                        line: code
                            .substring(0, code.indexOf(conditional))
                            .split("\n").length,
                    },
                    suggestion:
                        "Extract complex conditions into well-named variables or functions",
                });
            }
        });

        return suggestions;
    }

    suggestRemoveDuplicateCode(code, issues) {
        const suggestions = [];

        // Simple duplicate code detection
        const lines = code.split("\n");
        const lineCounts = {};

        lines.forEach((line, index) => {
            if (line.trim() !== "" && line.trim().length > 10) {
                if (!lineCounts[line]) {
                    lineCounts[line] = [];
                }
                lineCounts[line].push(index + 1);
            }
        });

        // Suggest removing duplicates that appear more than twice
        Object.keys(lineCounts).forEach((line) => {
            if (lineCounts[line].length > 2) {
                suggestions.push({
                    type: "refactor",
                    priority: "high",
                    message:
                        "This code appears multiple times and could be refactored",
                    location: { line: lineCounts[line][0] },
                    suggestion:
                        "Extract this code into a reusable function or constant",
                });
            }
        });

        return suggestions;
    }

    suggestOptimizeLoops(code, issues) {
        const suggestions = [];

        // Look for potential loop optimizations
        const loopPattern = /(untuk|while)\s*\([^)]*\)\s*\{[^}]*\}/g;
        const matches = code.match(loopPattern) || [];

        matches.forEach((loop, index) => {
            // Check for nested loops that might be optimized
            if (loop.includes("untuk(") || loop.includes("untuk (")) {
                const nestedLoopPattern =
                    /(untuk|while)\s*\([^)]*\)\s*\{[^}]*\}/g;
                const nestedMatches = loop.match(nestedLoopPattern) || [];

                if (nestedMatches.length > 1) {
                    suggestions.push({
                        type: "refactor",
                        priority: "medium",
                        message:
                            "Nested loops detected that might benefit from optimization",
                        location: {
                            line: code
                                .substring(0, code.indexOf(loop))
                                .split("\n").length,
                        },
                        suggestion:
                            "Consider using more efficient algorithms or data structures",
                    });
                }
            }
        });

        return suggestions;
    }

    // Add new security scanning methods
    checkForInsecureAPIUsage(code, issues) {
        const vulnerabilities = [];

        // Check for potentially insecure API usage
        const insecurePatterns = [
            {
                pattern: /eval\s*\([^)]*\)/,
                message:
                    "Use of eval() can lead to code injection vulnerabilities",
            },
            {
                pattern: /setTimeout\s*\([^,]+,\s*[^,]+,\s*[^)]*\)/,
                message:
                    "Dynamic setTimeout with string arguments can be unsafe",
            },
            {
                pattern: /Function\s*\([^)]*\)/,
                message:
                    "Use of Function constructor can lead to code injection",
            },
        ];

        insecurePatterns.forEach(({ pattern, message }) => {
            const matches = code.match(pattern);
            if (matches) {
                vulnerabilities.push({
                    type: "security",
                    priority: "high",
                    message: message,
                    location: {
                        line: code
                            .substring(0, code.indexOf(matches[0]))
                            .split("\n").length,
                    },
                });
            }
        });

        return vulnerabilities;
    }

    checkForHardcodedSecrets(code, issues) {
        const vulnerabilities = [];

        // Look for potential hardcoded secrets
        const secretPatterns = [
            {
                pattern: /password\s*=\s*["'][^"']*["']/i,
                message: "Hardcoded password detected",
            },
            {
                pattern: /api[key]?\s*=\s*["'][^"']*["']/i,
                message: "Hardcoded API key detected",
            },
            {
                pattern: /secret\s*=\s*["'][^"']*["']/i,
                message: "Hardcoded secret detected",
            },
        ];

        secretPatterns.forEach(({ pattern, message }) => {
            const matches = code.match(pattern);
            if (matches) {
                vulnerabilities.push({
                    type: "security",
                    priority: "high",
                    message: message,
                    location: {
                        line: code
                            .substring(0, code.indexOf(matches[0]))
                            .split("\n").length,
                    },
                });
            }
        });

        return vulnerabilities;
    }

    checkForInsecureNetworkRequests(code, issues) {
        const vulnerabilities = [];

        // Check for insecure network requests
        const insecureRequestPatterns = [
            {
                pattern: /http:\/\//,
                message: "Insecure HTTP request detected, consider using HTTPS",
            },
            {
                pattern: /xmlhttprequest/i,
                message:
                    "XMLHttpRequest detected, consider using fetch with proper security headers",
            },
        ];

        insecureRequestPatterns.forEach(({ pattern, message }) => {
            const matches = code.match(pattern);
            if (matches) {
                vulnerabilities.push({
                    type: "security",
                    priority: "medium",
                    message: message,
                    location: {
                        line: code
                            .substring(0, code.indexOf(matches[0]))
                            .split("\n").length,
                    },
                });
            }
        });

        return vulnerabilities;
    }

    // Enhanced analyze method that runs all analysis rules
    async analyze(code) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const issues = [];
        const suggestions = [];
        const vulnerabilities = [];

        // Run all analysis rules
        for (const rule of this.analysisRules) {
            try {
                const result = await rule.check(code, issues);
                if (result && Array.isArray(result)) {
                    issues.push(...result);
                }
            } catch (error) {
                console.error(`Error running analysis rule ${rule.id}:`, error);
            }
        }

        // Run all refactoring rules
        for (const rule of this.refactoringRules) {
            try {
                const result = await rule.check(code, issues);
                if (result && Array.isArray(result)) {
                    suggestions.push(...result);
                }
            } catch (error) {
                console.error(
                    `Error running refactoring rule ${rule.id}:`,
                    error
                );
            }
        }

        // Run all security rules
        for (const rule of this.securityRules) {
            try {
                const result = await rule.check(code, issues);
                if (result && Array.isArray(result)) {
                    vulnerabilities.push(...result);
                }
            } catch (error) {
                console.error(`Error running security rule ${rule.id}:`, error);
            }
        }

        return {
            issues: issues,
            suggestions: suggestions,
            vulnerabilities: vulnerabilities,
            overallQuality: this.calculateOverallQuality(
                issues,
                suggestions,
                vulnerabilities
            ),
        };
    }

    calculateOverallQuality(issues, suggestions, vulnerabilities) {
        // Simple quality scoring algorithm
        const issueScore = Math.max(0, 100 - issues.length * 5);
        const vulnerabilityScore = Math.max(
            0,
            100 - vulnerabilities.length * 10
        );
        const suggestionScore = Math.min(100, suggestions.length * 2);

        // Weighted average
        return Math.round(
            issueScore * 0.5 + vulnerabilityScore * 0.3 + suggestionScore * 0.2
        );
    }

    checkNamingConvention(code) {
        const issues = [];

        // Check for variable naming (should be camelCase or snake_case)
        const variableMatches = code.match(
            /(?:buat|create)\s+([a-zA-Z_][a-zA-Z0-9_]*)/g
        );
        if (variableMatches) {
            for (const match of variableMatches) {
                const varName = match.split(/\s+/)[1];
                if (varName && this.isPoorlyNamed(varName)) {
                    issues.push({
                        type: "naming-convention",
                        message: `Variable name '${varName}' could be more descriptive`,
                        suggestion: `Consider using a more descriptive name like 'userCount' or 'totalItems'`,
                        line: this.getLineNumberOfText(code, match),
                    });
                }
            }
        }

        // Check for function naming
        const functionMatches = code.match(
            /(?:fungsi|function)\s+([a-zA-Z_][a-zA-Z0-9_]*)/g
        );
        if (functionMatches) {
            for (const match of functionMatches) {
                const funcName = match.split(/\s+/)[1];
                if (funcName && this.isPoorlyNamed(funcName)) {
                    issues.push({
                        type: "naming-convention",
                        message: `Function name '${funcName}' could be more descriptive`,
                        suggestion: `Consider using a more descriptive name like 'calculateTotal' or 'getUserInfo'`,
                        line: this.getLineNumberOfText(code, match),
                    });
                }
            }
        }

        return { issues };
    }

    isPoorlyNamed(name) {
        // Simple check for poor naming (single letters, generic names)
        const poorNames = [
            "a",
            "b",
            "c",
            "x",
            "y",
            "z",
            "temp",
            "data",
            "value",
            "item",
        ];
        return poorNames.includes(name) || name.length === 1;
    }

    getLineNumberOfText(code, text) {
        const lines = code.split("\n");
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(text)) {
                return i + 1;
            }
        }
        return 1;
    }

    analyzeComplexity(code) {
        const issues = [];

        // Count nested control structures as a complexity indicator
        const ifCount = (code.match(/(?:jika|if)/g) || []).length;
        const loopCount = (code.match(/(?:selama|while|untuk|for)/g) || [])
            .length;
        const functionCount = (code.match(/(?:fungsi|function)/g) || []).length;

        const complexityScore = ifCount + loopCount + functionCount * 2;

        if (complexityScore > 10) {
            issues.push({
                type: "complexity",
                message: "High code complexity detected",
                suggestion:
                    "Consider breaking this code into smaller functions or modules",
                severity: "warning",
            });
        } else if (complexityScore > 5) {
            issues.push({
                type: "complexity",
                message: "Moderate code complexity",
                suggestion: "Code is reasonably complex but still manageable",
                severity: "info",
            });
        }

        return { issues };
    }

    detectDuplicateCode(code) {
        const issues = [];

        // Simple duplicate line detection
        const lines = code.split("\n");
        const lineCounts = {};

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.length > 10) {
                // Only consider substantial lines
                if (lineCounts[line]) {
                    lineCounts[line].push(i + 1);
                } else {
                    lineCounts[line] = [i + 1];
                }
            }
        }

        // Report duplicates
        for (const [line, lineNumbers] of Object.entries(lineCounts)) {
            if (lineNumbers.length > 1) {
                issues.push({
                    type: "duplicate-code",
                    message: `Duplicate code found on lines ${lineNumbers.join(
                        ", "
                    )}`,
                    suggestion:
                        "Consider refactoring this code into a reusable function",
                    lines: lineNumbers,
                });
            }
        }

        return { issues };
    }

    checkBestPractices(code) {
        const issues = [];

        // Check for commented out code
        const commentedCode = code.match(/\/{2}.*[a-zA-Z]+\s+[a-zA-Z]+/g);
        if (commentedCode && commentedCode.length > 3) {
            issues.push({
                type: "best-practices",
                message: "Multiple lines of commented-out code detected",
                suggestion:
                    "Remove commented-out code or document why it is kept",
                severity: "info",
            });
        }

        // Check for TODO comments
        const todos = code.match(/TODO|FIXME/g);
        if (todos && todos.length > 2) {
            issues.push({
                type: "best-practices",
                message: "Multiple TODO/FIXME comments found",
                suggestion:
                    "Address these items or create formal tasks for them",
                severity: "info",
            });
        }

        // Check for magic numbers
        const magicNumbers = code.match(/=\s*[0-9]+/g);
        if (magicNumbers && magicNumbers.length > 3) {
            issues.push({
                type: "best-practices",
                message: "Multiple magic numbers detected",
                suggestion:
                    "Consider using named constants instead of magic numbers",
                severity: "info",
            });
        }

        return { issues };
    }

    suggestRefactoring(code) {
        const suggestions = [];

        // Check for long functions
        const functions = code.match(
            /(?:fungsi|function)\s+[a-zA-Z_][a-zA-Z0-9_]*\s*\([^)]*\)\s*:/g
        );
        if (functions) {
            for (const func of functions) {
                const funcName = func.match(
                    /(?:fungsi|function)\s+([a-zA-Z_][a-zA-Z0-9_]*)/
                )[1];
                const funcBody = this.getFunctionBody(code, funcName);
                if (funcBody && funcBody.split("\n").length > 20) {
                    suggestions.push({
                        type: "refactoring",
                        message: `Function '${funcName}' is quite long`,
                        suggestion:
                            "Consider breaking this function into smaller, more focused functions",
                        severity: "info",
                    });
                }
            }
        }

        // Check for nested callbacks (simplified)
        if (code.includes("fungsi") && code.includes("fungsi")) {
            const nestedFuncs = (code.match(/fungsi/g) || []).length;
            if (nestedFuncs > 5) {
                suggestions.push({
                    type: "refactoring",
                    message: "Many nested functions detected",
                    suggestion:
                        "Consider using modular design or separating concerns into different files",
                    severity: "info",
                });
            }
        }

        // Check for repeated code blocks
        const duplicateIssues = this.detectDuplicateCode(code).issues;
        if (duplicateIssues.length > 0) {
            suggestions.push({
                type: "refactoring",
                message: "Duplicate code detected",
                suggestion:
                    "Consider refactoring duplicate code into reusable functions",
                severity: "info",
            });
        }

        // Check for complex conditionals
        const complexConditions = code.match(
            /(?:jika|if)\s*\(.*(?:&&|\|\|).*\(.*(?:&&|\|\|).*/g
        );
        if (complexConditions) {
            for (const condition of complexConditions) {
                suggestions.push({
                    type: "refactoring",
                    message: "Complex conditional detected",
                    suggestion:
                        "Consider extracting complex conditions into well-named variables or functions",
                    severity: "info",
                });
            }
        }

        return suggestions;
    }

    getFunctionBody(code, functionName) {
        // Simplified function body extraction
        const funcStart = code.indexOf(`fungsi ${functionName}`);
        if (funcStart === -1) {
            funcStart = code.indexOf(`function ${functionName}`);
            if (funcStart === -1) {
                return null;
            }
        }

        const funcLine = code.substring(
            funcStart,
            code.indexOf("\n", funcStart)
        );
        const indentLevel = funcLine.search(/\S/);

        let body = "";
        const lines = code.substring(funcStart).split("\n");
        let inFunction = false;
        let functionIndent = 0;

        for (const line of lines) {
            const currentIndent = line.search(/\S/);

            if (
                line.includes(`fungsi ${functionName}`) ||
                line.includes(`function ${functionName}`)
            ) {
                inFunction = true;
                functionIndent = currentIndent;
                continue;
            }

            if (inFunction) {
                if (
                    currentIndent <= functionIndent &&
                    currentIndent !== -1 &&
                    !line.trim().startsWith("fungsi") &&
                    !line.trim().startsWith("function")
                ) {
                    break;
                }
                body += line + "\n";
            }
        }

        return body;
    }

    async getPerformanceTips(code) {
        if (!this.isReady()) {
            throw new Error("Quality analyzer not initialized");
        }

        const tips = [];

        // Check for potential performance issues
        if (code.includes("tampilkan") || code.includes("show")) {
            const outputCount = (code.match(/(?:tampilkan|show)/g) || [])
                .length;
            if (outputCount > 10) {
                tips.push({
                    type: "performance",
                    message: "Many output statements detected",
                    suggestion:
                        "Consider batching output or using more efficient output methods",
                });
            }
        }

        // Check for nested loops
        const loopLines = code
            .split("\n")
            .filter(
                (line) =>
                    line.includes("selama") ||
                    line.includes("while") ||
                    line.includes("untuk") ||
                    line.includes("for")
            );

        if (loopLines.length > 3) {
            tips.push({
                type: "performance",
                message: "Multiple loops detected",
                suggestion: "Check if loops can be optimized or combined",
            });
        }

        return tips;
    }

    async getRefactoringSuggestions(code) {
        if (!this.isReady()) {
            throw new Error("Quality analyzer not initialized");
        }

        return this.suggestRefactoring(code);
    }

    async scanForSecurityIssues(code) {
        if (!this.isReady()) {
            throw new Error("Quality analyzer not initialized");
        }

        const issues = [];

        // Run all security rules
        for (const rule of this.securityRules) {
            try {
                const ruleIssues = await rule.check(code);
                if (ruleIssues && ruleIssues.length > 0) {
                    issues.push(...ruleIssues);
                }
            } catch (error) {
                console.error(`Error running security rule ${rule.id}:`, error);
            }
        }

        return issues;
    }

    // Neural Network Pattern Analysis
    analyzeNeuralNetworkPatterns(code) {
        const issues = [];

        // Check for neural network anti-patterns
        if (
            code.includes("latih") &&
            code.includes("epoch") &&
            !code.includes("batch")
        ) {
            issues.push({
                type: "neural-network",
                message: "Missing batch size in training",
                suggestion:
                    "Consider adding batch size parameter for better training performance",
                severity: "info",
            });
        }

        // Check for proper model evaluation
        if (
            code.includes("latih") &&
            !code.includes("evaluasi") &&
            !code.includes("evaluate")
        ) {
            issues.push({
                type: "neural-network",
                message: "Missing model evaluation",
                suggestion: "Consider evaluating your model after training",
                severity: "info",
            });
        }

        return { issues };
    }

    // Quantum Computing Pattern Analysis
    analyzeQuantumComputingPatterns(code) {
        const issues = [];

        // Check for quantum computing anti-patterns
        if (code.includes("ukur") && !code.includes("simulasi")) {
            issues.push({
                type: "quantum-computing",
                message: "Measurement without simulation",
                suggestion:
                    "Consider running simulation before measurement for better results",
                severity: "info",
            });
        }

        // Check for proper qubit management
        const qubitDeclarations = (code.match(/(?:kubit|qubit)\s+\w+/g) || [])
            .length;
        const qubitMeasurements = (code.match(/(?:ukur|measure)/g) || [])
            .length;

        if (qubitDeclarations > 0 && qubitMeasurements === 0) {
            issues.push({
                type: "quantum-computing",
                message: "Qubits declared but not measured",
                suggestion:
                    "Consider measuring qubits to get results from quantum computation",
                severity: "warning",
            });
        }

        return { issues };
    }

    // Performance Analysis
    analyzePerformance(code) {
        const issues = [];

        // Check for performance anti-patterns
        const loopNesting = (
            code.match(
                /(?:selama|while|untuk|for).*\n.*(?:selama|while|untuk|for)/g
            ) || []
        ).length;
        if (loopNesting > 3) {
            issues.push({
                type: "performance",
                message: "Deeply nested loops detected",
                suggestion:
                    "Consider optimizing nested loop structures for better performance",
                severity: "warning",
            });
        }

        // Check for inefficient string concatenation
        if (code.includes("+") && code.includes("=") && code.includes('"')) {
            issues.push({
                type: "performance",
                message: "Potential inefficient string concatenation",
                suggestion:
                    "Consider using string builders or templates for better performance",
                severity: "info",
            });
        }

        return { issues };
    }

    // Security Detection Methods
    detectSQLInjection(code) {
        const issues = [];

        // Check for SQL injection vulnerabilities
        const sqlPatterns = [
            /(?:tampilkan|show)\s*.*\+\s*.*(?:jika|if)/i,
            /(?:tampilkan|show)\s*.*\+\s*.*(?:selama|while)/i,
        ];

        for (const pattern of sqlPatterns) {
            if (pattern.test(code)) {
                issues.push({
                    type: "security",
                    message: "Potential SQL injection vulnerability detected",
                    suggestion:
                        "Use parameterized queries or escape user input properly",
                    severity: "high",
                });
            }
        }

        return issues;
    }

    detectXSS(code) {
        const issues = [];

        // Check for XSS vulnerabilities
        if (code.includes("innerHTML") || code.includes("outerHTML")) {
            issues.push({
                type: "security",
                message: "Potential XSS vulnerability detected",
                suggestion:
                    "Use textContent or other safe methods instead of innerHTML/outerHTML",
                severity: "high",
            });
        }

        return issues;
    }

    detectHardcodedSecrets(code) {
        const issues = [];

        // Check for hardcoded passwords or keys
        const sensitivePatterns = [
            /password\s*=\s*['"][^'"]+['"]/i,
            /api[key]?\s*=\s*['"][^'"]+['"]/i,
            /secret\s*=\s*['"][^'"]+['"]/i,
        ];

        for (const pattern of sensitivePatterns) {
            if (pattern.test(code)) {
                issues.push({
                    type: "security",
                    message: "Hardcoded sensitive information detected",
                    suggestion:
                        "Use environment variables or secure configuration management",
                    severity: "high",
                });
            }
        }

        return issues;
    }

    detectInsecureRandom(code) {
        const issues = [];

        // Check for insecure random number generation
        if (code.includes("Math.random")) {
            issues.push({
                type: "security",
                message: "Insecure random number generation detected",
                suggestion:
                    "Use a cryptographically secure random number generator for security-sensitive applications",
                severity: "medium",
            });
        }

        return issues;
    }

    detectNeuralNetworkSecurityIssues(code) {
        const issues = [];

        // Check for neural network security issues
        if (
            code.includes("latih") &&
            code.includes("data") &&
            !code.includes("validasi")
        ) {
            issues.push({
                type: "security",
                message: "Missing data validation in neural network training",
                suggestion:
                    "Validate training data to prevent data poisoning attacks",
                severity: "medium",
            });
        }

        return issues;
    }

    detectQuantumComputingSecurityIssues(code) {
        const issues = [];

        // Check for quantum computing security issues
        if (
            code.includes("simulasi") &&
            code.includes("kunci") &&
            !code.includes("acak")
        ) {
            issues.push({
                type: "security",
                message: "Missing randomness in quantum key distribution",
                suggestion:
                    "Ensure proper randomness in quantum key distribution protocols",
                severity: "medium",
            });
        }

        return issues;
    }
}

module.exports = QualityAnalyzer;
