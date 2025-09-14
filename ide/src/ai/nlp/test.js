// Test file for enhanced NLP processor
const NLPProcessor = require("./parser");

async function testNLPProcessor() {
    console.log("Testing enhanced NLP processor...\n");

    const nlp = new NLPProcessor();
    await nlp.initialize();

    // Test basic parsing
    console.log("1. Testing basic parsing:");
    const basicResult = await nlp.parse(
        "Create a function that prints hello world"
    );
    console.log("Result:", JSON.stringify(basicResult, null, 2));
    console.log("\n");

    // Test complex request parsing
    console.log("2. Testing complex request parsing:");
    const complexResult = await nlp.parseComplexRequest(
        "Create a neural network with 3 layers and train it for 10 epochs"
    );
    console.log("Result:", JSON.stringify(complexResult, null, 2));
    console.log("\n");

    // Test error explanation
    console.log("3. Testing error explanation:");
    const errorResult = await nlp.explainError(
        "Syntax error: missing closing parenthesis"
    );
    console.log("Result:", JSON.stringify(errorResult, null, 2));
    console.log("\n");

    // Test context update
    console.log("4. Testing context update:");
    nlp.updateContext({ projectName: "MyProject", language: "English" });
    console.log("Context updated");
    console.log("\n");

    // Test conversation history
    console.log("5. Testing conversation history:");
    const history = nlp.getConversationHistory();
    console.log("History length:", history.length);
    console.log("\n");

    console.log("All tests completed!");
}

// Run the tests
testNLPProcessor().catch(console.error);
