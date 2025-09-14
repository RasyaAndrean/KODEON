const QualityAnalyzer = require("./quality");

// Test code with various issues to analyze
const testCode = `
fungsi utama() {
    // Hardcoded secret
    const password = "123456";

    // Complex conditional
    jika (a > 0 && b < 10 && c === "test" && d !== null && e >= 5) {
        tampilkan("Complex condition");
    } atau jika (f < 100 || g > 50) {
        tampilkan("Another condition");
    } else {
        tampilkan("Else condition");
    }

    // Long function that should be refactored
    untuk (biarkan i = 0; i < 100; i++) {
        // Some complex logic here
        biarkan hasil = i * 2;
        jika (hasil > 50) {
            tampilkan("Result: " + hasil);
        }

        // More complex logic
        untuk (biarkan j = 0; j < 10; j++) {
            biarkan subResult = hasil * j;
            jika (subResult > 100) {
                tampilkan("Sub result: " + subResult);
            }
        }

        // Even more logic
        untuk (biarkan k = 0; k < 5; k++) {
            biarkan anotherResult = hasil * k;
            jika (anotherResult > 25) {
                tampilkan("Another result: " + anotherResult);
            }
        }
    }

    // Duplicate code
    tampilkan("This is a test message");
    tampilkan("This is a test message");
    tampilkan("This is a test message");

    // Insecure API usage
    eval("console.log('This is dangerous')");

    // Insecure network request
    biarkan xhr = new XMLHttpRequest();
    xhr.open("GET", "http://example.com/data");
    xhr.send();
}

// Another function with issues
fungsi processData(data) {
    // Hardcoded API key
    const apiKey = "abc123xyz";

    // Complex logic that should be simplified
    jika (data !== null && data.length > 0 && data[0].isValid && data[0].value > 0 && data[0].timestamp > Date.now() - 3600000) {
        kembalikan data[0].value;
    }

    kembalikan 0;
}
`;

async function runTests() {
    console.log("Testing QualityAnalyzer enhancements...");

    const analyzer = new QualityAnalyzer();
    await analyzer.initialize();

    const results = await analyzer.analyze(testCode);

    console.log("\\n=== ANALYSIS RESULTS ===");
    console.log("Overall Quality Score:", results.overallQuality);

    console.log("\\n--- ISSUES FOUND ---");
    results.issues.forEach((issue, index) => {
        console.log(
            `${index + 1}. ${issue.message} (Line: ${
                issue.location?.line || "N/A"
            })`
        );
    });

    console.log("\\n--- REFACTORING SUGGESTIONS ---");
    results.suggestions.forEach((suggestion, index) => {
        console.log(
            `${index + 1}. ${suggestion.message} (Line: ${
                suggestion.location?.line || "N/A"
            })`
        );
        console.log(`   Suggestion: ${suggestion.suggestion}`);
    });

    console.log("\\n--- SECURITY VULNERABILITIES ---");
    results.vulnerabilities.forEach((vuln, index) => {
        console.log(
            `${index + 1}. ${vuln.message} (Line: ${
                vuln.location?.line || "N/A"
            })`
        );
    });

    // Test individual methods
    console.log("\\n=== TESTING INDIVIDUAL METHODS ===");

    const issues = [];

    // Test refactoring suggestions
    console.log("\\n--- REFACTORING SUGGESTIONS ---");
    const extractSuggestions = analyzer.suggestExtractFunction(
        testCode,
        issues
    );
    console.log("Extract function suggestions:", extractSuggestions.length);

    const simplifySuggestions = analyzer.suggestSimplifyConditionals(
        testCode,
        issues
    );
    console.log(
        "Simplify conditionals suggestions:",
        simplifySuggestions.length
    );

    const duplicateSuggestions = analyzer.suggestRemoveDuplicateCode(
        testCode,
        issues
    );
    console.log(
        "Remove duplicate code suggestions:",
        duplicateSuggestions.length
    );

    const optimizeSuggestions = analyzer.suggestOptimizeLoops(testCode, issues);
    console.log("Optimize loops suggestions:", optimizeSuggestions.length);

    // Test security scanning
    console.log("\\n--- SECURITY SCANNING ---");
    const insecureAPIIssues = analyzer.checkForInsecureAPIUsage(
        testCode,
        issues
    );
    console.log("Insecure API usage issues:", insecureAPIIssues.length);

    const hardcodedSecrets = analyzer.checkForHardcodedSecrets(
        testCode,
        issues
    );
    console.log("Hardcoded secrets issues:", hardcodedSecrets.length);

    const insecureNetwork = analyzer.checkForInsecureNetworkRequests(
        testCode,
        issues
    );
    console.log("Insecure network requests issues:", insecureNetwork.length);

    console.log("\\n=== TEST COMPLETE ===");
}

// Run the tests
runTests().catch(console.error);
