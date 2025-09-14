// Test file for enhanced CodeCompletionEngine
const CodeCompletionEngine = require("./engine");

async function testCodeCompletionEngine() {
    console.log("Testing enhanced CodeCompletionEngine...\n");

    const engine = new CodeCompletionEngine();
    await engine.initialize();

    // Test basic suggestions
    console.log("1. Testing basic suggestions:");
    const basicContext = {
        code: "fungsi helloWorld():\n    tampilkan ",
        position: { lineNumber: 2 },
        language: "kodeon",
    };

    const basicResult = await engine.getSuggestions(basicContext);
    console.log("Basic suggestions count:", basicResult.suggestions.length);
    console.log("\n");

    // Test advanced suggestions
    console.log("2. Testing advanced suggestions:");
    const advancedContext = {
        code: "jaringan myNetwork = ()\n",
        position: { lineNumber: 2 },
        language: "kodeon",
    };

    const advancedResult = await engine.getAdvancedSuggestions(advancedContext);
    console.log(
        "Advanced suggestions count:",
        advancedResult.suggestions.length
    );
    console.log("First suggestion:", advancedResult.suggestions[0]?.label);
    console.log("\n");

    // Test learning from context
    console.log("3. Testing learning from context:");
    const learnResult = await engine.learnFromContext(advancedContext);
    console.log("Learning result:", learnResult);
    console.log("\n");

    // Test user preferences
    console.log("4. Testing user preferences:");
    engine.updateUserPreferences({ language: "English", theme: "dark" });
    console.log("User preferences updated");
    console.log("\n");

    // Test project context
    console.log("5. Testing project context:");
    engine.updateProjectContext({
        projectName: "MyProject",
        framework: "neural-network",
    });
    console.log("Project context updated");
    console.log("\n");

    // Test usage statistics
    console.log("6. Testing usage statistics:");
    const stats = engine.getUsageStatistics();
    console.log("Usage statistics:", stats);
    console.log("\n");

    console.log("All tests completed!");
}

// Run the tests
testCodeCompletionEngine().catch(console.error);
