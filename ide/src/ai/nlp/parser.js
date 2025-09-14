// Natural Language Processing for KODEON IDE
const sentiment = require("sentiment");

class NLPProcessor {
    constructor() {
        this.isInitialized = false;
        this.nlpModel = null;
        this.context = {};
        this.conversationHistory = [];
    }

    async initialize() {
        try {
            // In a real implementation, this would load the NLP model
            // For now, we'll simulate the initialization
            this.nlpModel = {
                name: "KODEON-NLP-v2",
                version: "2.0.0",
                capabilities: [
                    "parsing",
                    "generation",
                    "explanation",
                    "context",
                    "sentiment",
                ],
            };

            // Initialize sentiment analyzer
            this.sentimentAnalyzer = new sentiment();

            this.isInitialized = true;
            console.log("Enhanced NLP processor initialized");
            return true;
        } catch (error) {
            console.error("Error initializing NLP processor:", error);
            return false;
        }
    }

    isReady() {
        return this.isInitialized && this.nlpModel !== null;
    }

    async parse(text) {
        if (!this.isReady()) {
            throw new Error("NLP processor not initialized");
        }

        // In a real implementation, this would use an NLP model to parse the text
        // For now, we'll simulate parsing with simple pattern matching

        const lowerText = text.toLowerCase();
        const result = {
            intent: null,
            entities: [],
            confidence: 0.0,
            generatedCode: "",
            sentiment: null,
            context: { ...this.context },
        };

        // Analyze sentiment of the input text
        const sentimentAnalysis = this.sentimentAnalyzer.analyze(text);
        result.sentiment = {
            score: sentimentAnalysis.score,
            comparative: sentimentAnalysis.comparative,
            calculation: sentimentAnalysis.calculation,
        };

        // Update conversation history
        this.conversationHistory.push({
            input: text,
            timestamp: new Date(),
            sentiment: result.sentiment,
        });

        // Keep only the last 10 conversations for context
        if (this.conversationHistory.length > 10) {
            this.conversationHistory.shift();
        }

        // Enhanced intent recognition with more patterns and context awareness
        if (
            lowerText.includes("print") ||
            lowerText.includes("show") ||
            lowerText.includes("display") ||
            lowerText.includes("tampilkan") ||
            lowerText.includes("cetak")
        ) {
            result.intent = "output";
            result.confidence = 0.9;
            result.generatedCode = this.generateOutputCode(text);
        } else if (
            lowerText.includes("function") ||
            lowerText.includes("fungsi") ||
            lowerText.includes("buat fungsi") ||
            lowerText.includes("create function") ||
            lowerText.includes("definisikan fungsi")
        ) {
            result.intent = "function";
            result.confidence = 0.85;
            result.generatedCode = this.generateFunctionCode(text);
        } else if (
            lowerText.includes("variable") ||
            lowerText.includes("variabel") ||
            lowerText.includes("buat") ||
            lowerText.includes("create") ||
            lowerText.includes("deklarasi") ||
            lowerText.includes("assign") ||
            lowerText.includes("tetapkan")
        ) {
            result.intent = "variable";
            result.confidence = 0.8;
            result.generatedCode = this.generateVariableCode(text);
        } else if (
            lowerText.includes("loop") ||
            lowerText.includes("ulangi") ||
            lowerText.includes("for") ||
            lowerText.includes("while") ||
            lowerText.includes("untuk") ||
            lowerText.includes("selama") ||
            lowerText.includes("iterate") ||
            lowerText.includes("iterasi")
        ) {
            result.intent = "loop";
            result.confidence = 0.75;
            result.generatedCode = this.generateLoopCode(text);
        } else if (
            lowerText.includes("condition") ||
            lowerText.includes("kondisi") ||
            lowerText.includes("if") ||
            lowerText.includes("jika") ||
            lowerText.includes("else") ||
            lowerText.includes("lain") ||
            lowerText.includes("check") ||
            lowerText.includes("periksa")
        ) {
            result.intent = "conditional";
            result.confidence = 0.7;
            result.generatedCode = this.generateConditionalCode(text);
        } else if (
            lowerText.includes("class") ||
            lowerText.includes("kelas") ||
            lowerText.includes("object") ||
            lowerText.includes("objek") ||
            lowerText.includes("define class") ||
            lowerText.includes("definisikan kelas")
        ) {
            result.intent = "class";
            result.confidence = 0.65;
            result.generatedCode = this.generateClassCode(text);
        } else if (
            lowerText.includes("array") ||
            lowerText.includes("larik") ||
            lowerText.includes("list") ||
            lowerText.includes("daftar") ||
            lowerText.includes("collection") ||
            lowerText.includes("koleksi")
        ) {
            result.intent = "collection";
            result.confidence = 0.6;
            result.generatedCode = this.generateCollectionCode(text);
        } else if (
            lowerText.includes("error") ||
            lowerText.includes("exception") ||
            lowerText.includes("kesalahan") ||
            lowerText.includes("pengecualian")
        ) {
            result.intent = "errorHandling";
            result.confidence = 0.55;
            result.generatedCode = this.generateErrorHandlingCode(text);
        } else if (
            lowerText.includes("neural") ||
            lowerText.includes("network") ||
            lowerText.includes("jaringan") ||
            lowerText.includes("tensor") ||
            lowerText.includes("model")
        ) {
            result.intent = "neuralNetwork";
            result.confidence = 0.7;
            result.generatedCode = this.generateNeuralNetworkCode(text);
        } else if (
            lowerText.includes("quantum") ||
            lowerText.includes("qubit") ||
            lowerText.includes("kubit") ||
            lowerText.includes("gate") ||
            lowerText.includes("gerbang")
        ) {
            result.intent = "quantumComputing";
            result.confidence = 0.7;
            result.generatedCode = this.generateQuantumComputingCode(text);
        } else {
            result.intent = "unknown";
            result.confidence = 0.1;
            result.generatedCode = `// Could not understand: ${text}`;
        }

        return result;
    }

    generateCollectionCode(text) {
        // Extract collection name if possible
        let collectionName = "myList";

        const nameMatches = text.match(
            /(?:array|larik|list|daftar|collection|koleksi)\s+(\w+)/i
        );
        if (nameMatches && nameMatches[1]) {
            collectionName = nameMatches[1];
        }

        // Determine collection type based on context
        let collectionType = "list";
        let initialValue = "[]";

        if (
            text.toLowerCase().includes("map") ||
            text.toLowerCase().includes("dictionary") ||
            text.toLowerCase().includes("kamus")
        ) {
            collectionType = "dictionary";
            initialValue = "{}";
        } else if (
            text.toLowerCase().includes("set") ||
            text.toLowerCase().includes("himpunan")
        ) {
            collectionType = "set";
            initialValue = "set()";
        }

        // Generate code in both languages
        return `// English version
create ${collectionName} = ${initialValue}
show ${collectionName}

// Indonesian version
buat ${collectionName} = ${initialValue}
tampilkan ${collectionName}`;
    }

    generateErrorHandlingCode(text) {
        // Generate code in both languages
        return `// English version
try:
    // Code that might throw an error
    show "This might fail"
catch exception:
    show "An error occurred: " + exception

// Indonesian version
coba:
    // Kode yang mungkin menghasilkan kesalahan
    tampilkan "Ini mungkin gagal"
tangkap pengecualian:
    tampilkan "Terjadi kesalahan: " + pengecualian`;
    }

    async parseComplexRequest(text) {
        if (!this.isReady()) {
            throw new Error("NLP processor not initialized");
        }

        // Parse a more complex natural language request
        const lowerText = text.toLowerCase();
        const result = {
            intent: null,
            entities: [],
            confidence: 0.0,
            generatedCode: "",
            steps: [],
            context: { ...this.context },
        };

        // Analyze sentiment of the input text
        const sentimentAnalysis = this.sentimentAnalyzer.analyze(text);
        result.sentiment = {
            score: sentimentAnalysis.score,
            comparative: sentimentAnalysis.comparative,
            calculation: sentimentAnalysis.calculation,
        };

        // Update conversation history
        this.conversationHistory.push({
            input: text,
            timestamp: new Date(),
            sentiment: result.sentiment,
        });

        // Keep only the last 10 conversations for context
        if (this.conversationHistory.length > 10) {
            this.conversationHistory.shift();
        }

        // Handle multi-step requests
        if (
            lowerText.includes("create") &&
            lowerText.includes("function") &&
            lowerText.includes("call")
        ) {
            result.intent = "multiStep";
            result.confidence = 0.9;
            result.steps = [
                { action: "createFunction", description: "Create a function" },
                { action: "callFunction", description: "Call the function" },
            ];
            result.generatedCode = this.generateMultiStepCode(text);
        } else if (
            lowerText.includes("loop") &&
            lowerText.includes("condition")
        ) {
            result.intent = "loopWithCondition";
            result.confidence = 0.85;
            result.generatedCode = this.generateLoopWithConditionCode(text);
        } else if (
            lowerText.includes("neural") &&
            lowerText.includes("network") &&
            lowerText.includes("train")
        ) {
            result.intent = "neuralNetworkTraining";
            result.confidence = 0.8;
            result.steps = [
                {
                    action: "createNetwork",
                    description: "Create a neural network",
                },
                {
                    action: "addLayers",
                    description: "Add layers to the network",
                },
                { action: "trainModel", description: "Train the model" },
                { action: "makePredictions", description: "Make predictions" },
            ];
            result.generatedCode = this.generateNeuralNetworkTrainingCode(text);
        } else if (
            lowerText.includes("quantum") &&
            lowerText.includes("circuit") &&
            lowerText.includes("simulate")
        ) {
            result.intent = "quantumCircuitSimulation";
            result.confidence = 0.8;
            result.steps = [
                {
                    action: "createCircuit",
                    description: "Create a quantum circuit",
                },
                { action: "addGates", description: "Add quantum gates" },
                {
                    action: "simulateCircuit",
                    description: "Simulate the circuit",
                },
            ];
            result.generatedCode =
                this.generateQuantumCircuitSimulationCode(text);
        } else {
            // Fall back to simple parsing
            return this.parse(text);
        }

        return result;
    }

    generateMultiStepCode(text) {
        // Generate code for multi-step requests
        return `// English version
// Step 1: Create a function
function calculateSquare(x):
    return x * x

// Step 2: Call the function
result = calculateSquare(5)
show result

// Indonesian version
// Langkah 1: Buat fungsi
fungsi hitungKuadrat(x):
    kembalikan x * x

// Langkah 2: Panggil fungsi
hasil = hitungKuadrat(5)
tampilkan hasil`;
    }

    generateLoopWithConditionCode(text) {
        // Generate code for loops with conditions
        return `// English version
for i in range(1, 10):
    if i % 2 == 0:
        show "Even number: " + i

// Indonesian version
untuk i di jangkauan(1, 10):
    jika i % 2 == 0:
        tampilkan "Angka genap: " + i`;
    }

    generateNeuralNetworkTrainingCode(text) {
        // Extract network name if possible
        let networkName = "myNetwork";
        let modelName = "myModel";
        let epochs = "10";
        let batchSize = "32";

        const nameMatches = text.match(/(?:network|jaringan)\s+(\w+)/i);
        if (nameMatches && nameMatches[1]) {
            networkName = nameMatches[1];
        }

        const modelMatches = text.match(/(?:model)\s+(\w+)/i);
        if (modelMatches && modelMatches[1]) {
            modelName = modelMatches[1];
        }

        const epochMatches = text.match(/(?:epochs|epoch)\s+(\d+)/i);
        if (epochMatches && epochMatches[1]) {
            epochs = epochMatches[1];
        }

        const batchMatches = text.match(/(?:batch\s+size|batch)\s+(\d+)/i);
        if (batchMatches && batchMatches[1]) {
            batchSize = batchMatches[1];
        }

        // Generate code in both languages
        return `// English version
// Step 1: Create a neural network
network ${networkName} = ()

// Step 2: Add layers
layer.input(784)
layer.hidden(128, "relu")
layer.output(10, "softmax")

// Step 3: Create model
model ${modelName} = ${networkName}

// Step 4: Train the model
train(${modelName}, trainingData, labels, ${epochs}, ${batchSize})

// Step 5: Make predictions
predict result = predict(${modelName}, testData)

// Indonesian version
// Langkah 1: Buat jaringan saraf
jaringan ${networkName} = ()

// Langkah 2: Tambahkan lapisan
lapisan.input(784)
lapisan.tersembunyi(128, "relu")
lapisan.keluaran(10, "softmax")

// Langkah 3: Buat model
model ${modelName} = ${networkName}

// Langkah 4: Latih model
latih(${modelName}, dataLatih, label, ${epochs}, ${batchSize})

// Langkah 5: Buat prediksi
prediksi hasil = prediksi(${modelName}, dataUji)`;
    }

    generateQuantumCircuitSimulationCode(text) {
        // Extract circuit name if possible
        let circuitName = "myCircuit";
        let qubitCount = "3";

        const nameMatches = text.match(/(?:circuit|sirkuit)\s+(\w+)/i);
        if (nameMatches && nameMatches[1]) {
            circuitName = nameMatches[1];
        }

        const qubitMatches = text.match(/(\d+)\s+(?:qubits|qubit|kubit)/i);
        if (qubitMatches && qubitMatches[1]) {
            qubitCount = qubitMatches[1];
        }

        // Generate code in both languages
        return `// English version
// Step 1: Create a quantum circuit
circuit ${circuitName}(${qubitCount})

// Step 2: Add quantum gates
H(0)
CNOT(0, 1)

// Step 3: Measure qubits
Measure([0, 1])

// Step 4: Simulate the circuit
simulate result = simulate(${circuitName}, 1000)

// Indonesian version
// Langkah 1: Buat sirkuit kuantum
sirkuit ${circuitName}(${qubitCount})

// Langkah 2: Tambahkan gerbang kuantum
H(0)
CNOT(0, 1)

// Langkah 3: Ukur qubit
Ukur([0, 1])

// Langkah 4: Simulasikan sirkuit
simulasi hasil = simulasi(${circuitName}, 1000)`;
    }

    async generateDocumentationForCode(code) {
        if (!this.isReady()) {
            throw new Error("NLP processor not initialized");
        }

        // Generate natural language documentation for code
        const lines = code.split("\n");
        let documentation = "Documentation for code:\n\n";

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (
                trimmedLine.startsWith("fungsi") ||
                trimmedLine.startsWith("function")
            ) {
                documentation += `- Function definition: ${trimmedLine}\n`;
            } else if (
                trimmedLine.startsWith("jika") ||
                trimmedLine.startsWith("if")
            ) {
                documentation += `- Conditional statement: ${trimmedLine}\n`;
            } else if (
                trimmedLine.startsWith("untuk") ||
                trimmedLine.startsWith("for") ||
                trimmedLine.startsWith("selama") ||
                trimmedLine.startsWith("while")
            ) {
                documentation += `- Loop statement: ${trimmedLine}\n`;
            } else if (
                trimmedLine.startsWith("tampilkan") ||
                trimmedLine.startsWith("show")
            ) {
                documentation += `- Output statement: ${trimmedLine}\n`;
            } else if (
                trimmedLine.startsWith("buat") ||
                trimmedLine.startsWith("create")
            ) {
                documentation += `- Variable declaration: ${trimmedLine}\n`;
            } else if (
                trimmedLine.startsWith("kembalikan") ||
                trimmedLine.startsWith("return")
            ) {
                documentation += `- Return statement: ${trimmedLine}\n`;
            }
        }

        return documentation;
    }

    generateOutputCode(text) {
        const lowerText = text.toLowerCase();

        // Extract what to print
        let toPrint = "Hello, World!";

        if (lowerText.includes("hello") || lowerText.includes("halo")) {
            toPrint = '"Hello, World!"';
        } else if (lowerText.includes("name") || lowerText.includes("nama")) {
            toPrint = '"My name is KODEON"';
        } else if (
            lowerText.includes("message") ||
            lowerText.includes("pesan")
        ) {
            toPrint = '"This is a message"';
        } else if (lowerText.includes("time") || lowerText.includes("waktu")) {
            toPrint = '"Current time"';
        } else if (
            lowerText.includes("date") ||
            lowerText.includes("tanggal")
        ) {
            toPrint = '"Current date"';
        }

        // Generate code in both languages
        return `// English version
show ${toPrint}

// Indonesian version
tampilkan ${toPrint}`;
    }

    generateFunctionCode(text) {
        // Extract function name if possible
        let functionName = "myFunction";

        const nameMatches = text.match(/(?:function|fungsi)\s+(\w+)/i);
        if (nameMatches && nameMatches[1]) {
            functionName = nameMatches[1];
        }

        // Check if it's a void function or one that returns a value
        let isVoid = true;
        let returnValue = "";

        if (
            text.toLowerCase().includes("return") ||
            text.toLowerCase().includes("kembalikan")
        ) {
            isVoid = false;
            returnValue = '"Hello from function"';
        }

        // Generate code in both languages
        if (isVoid) {
            return `// English version
function ${functionName}():
    // Function body
    show "Hello from ${functionName}"

// Indonesian version
fungsi ${functionName}():
    // Badan fungsi
    tampilkan "Halo dari ${functionName}"`;
        } else {
            return `// English version
function ${functionName}():
    // Function body
    return ${returnValue}

// Indonesian version
fungsi ${functionName}():
    // Badan fungsi
    kembalikan ${returnValue}`;
        }
    }

    generateVariableCode(text) {
        // Extract variable name if possible
        let variableName = "myVariable";

        const nameMatches = text.match(
            /(?:variable|variabel|buat|create)\s+(\w+)/i
        );
        if (nameMatches && nameMatches[1]) {
            variableName = nameMatches[1];
        }

        // Determine variable type based on context
        let variableValue = '"Hello, World!"';
        let variableType = "string";

        if (
            text.toLowerCase().includes("number") ||
            text.toLowerCase().includes("angka")
        ) {
            variableValue = "42";
            variableType = "number";
        } else if (
            text.toLowerCase().includes("boolean") ||
            text.toLowerCase().includes("boolean")
        ) {
            variableValue = "true";
            variableType = "boolean";
        } else if (
            text.toLowerCase().includes("list") ||
            text.toLowerCase().includes("daftar")
        ) {
            variableValue = "[]";
            variableType = "list";
        } else if (
            text.toLowerCase().includes("dictionary") ||
            text.toLowerCase().includes("kamus")
        ) {
            variableValue = "{}";
            variableType = "dictionary";
        }

        // Generate code in both languages
        return `// English version
create ${variableName} = ${variableValue}
show ${variableName}

// Indonesian version
buat ${variableName} = ${variableValue}
tampilkan ${variableName}`;
    }

    generateLoopCode(text) {
        // Determine loop type based on context
        let loopType = "for";
        let loopVariable = "i";
        let loopRange = "1, 10";

        if (
            text.toLowerCase().includes("while") ||
            text.toLowerCase().includes("selama")
        ) {
            loopType = "while";
        }

        // Extract loop variable if possible
        const varMatches = text.match(/(?:loop|ulangi|for|untuk)\s+(\w+)/i);
        if (varMatches && varMatches[1]) {
            loopVariable = varMatches[1];
        }

        // Generate code in both languages
        if (loopType === "for") {
            return `// English version
for ${loopVariable} in range(1, 10):
    show "Number: " + ${loopVariable}

// Indonesian version
untuk ${loopVariable} di jangkauan(1, 10):
    tampilkan "Nomor: " + ${loopVariable}`;
        } else {
            return `// English version
while ${loopVariable} < 10:
    show "Number: " + ${loopVariable}
    ${loopVariable} = ${loopVariable} + 1

// Indonesian version
selama ${loopVariable} < 10:
    tampilkan "Nomor: " + ${loopVariable}
    ${loopVariable} = ${loopVariable} + 1`;
        }
    }

    generateConditionalCode(text) {
        // Extract condition if possible
        let condition = "x > 5";

        // Generate code in both languages
        return `// English version
if ${condition}:
    show "Condition is true"
else:
    show "Condition is false"

// Indonesian version
jika ${condition}:
    tampilkan "Kondisi benar"
lain:
    tampilkan "Kondisi salah"`;
    }

    generateClassCode(text) {
        // Extract class name if possible
        let className = "MyClass";

        const nameMatches = text.match(/(?:class|kelas)\s+(\w+)/i);
        if (nameMatches && nameMatches[1]) {
            className = nameMatches[1];
        }

        // Generate code in both languages
        return `// English version
class ${className}:
    constructor():
        // Initialize class properties

    method myMethod():
        // Method implementation
        return "Hello from ${className}"

// Indonesian version
kelas ${className}:
    konstruktor():
        // Inisialisasi properti kelas

    metode metodeSaya():
        // Implementasi metode
        kembalikan "Halo dari ${className}"`;
    }

    async generateFromComment(comment) {
        if (!this.isReady()) {
            throw new Error("NLP processor not initialized");
        }

        // In a real implementation, this would generate code from comments
        // For now, we'll simulate this with simple pattern matching

        const lowerComment = comment.toLowerCase();

        if (
            lowerComment.includes("print") ||
            lowerComment.includes("show") ||
            lowerComment.includes("tampilkan")
        ) {
            return `// ${comment}
tampilkan "Hello from comment"
show "Hello from comment"`;
        } else if (
            lowerComment.includes("function") ||
            lowerComment.includes("fungsi")
        ) {
            return `// ${comment}
fungsi calculateSum(a, b):
    kembalikan a + b

function calculateSum(a, b):
    return a + b`;
        } else if (
            lowerComment.includes("loop") ||
            lowerComment.includes("ulangi") ||
            lowerComment.includes("for") ||
            lowerComment.includes("while")
        ) {
            return `// ${comment}
untuk i di jangkauan(1, 10):
    tampilkan "Nomor: " + i

for i in range(1, 10):
    show "Number: " + i`;
        } else {
            return `// ${comment}
// Generated code would go here`;
        }
    }

    async explainError(error) {
        if (!this.isReady()) {
            throw new Error("NLP processor not initialized");
        }

        // In a real implementation, this would generate natural language explanations
        // For now, we'll simulate this with predefined explanations

        const explanations = {
            syntax: "There is a syntax error in your code. Check that all keywords, parentheses, and brackets are properly matched.",
            type: "There is a type mismatch in your code. Make sure you are using variables of the correct type.",
            reference:
                "You are trying to use a variable or function that has not been defined.",
            import: "There is an issue with importing a module. Check that the module name is correct and available.",
            neural: "There is an issue with your neural network code. Check that you are using the correct syntax for neural network constructs.",
            quantum:
                "There is an issue with your quantum computing code. Check that you are using the correct syntax for quantum computing constructs.",
        };

        // Try to determine the error type
        let errorType = "general";
        if (error.includes("syntax") || error.includes("Syntax")) {
            errorType = "syntax";
        } else if (error.includes("type") || error.includes("Type")) {
            errorType = "type";
        } else if (error.includes("reference") || error.includes("Reference")) {
            errorType = "reference";
        } else if (error.includes("import") || error.includes("Import")) {
            errorType = "import";
        } else if (
            error.includes("neural") ||
            error.includes("network") ||
            error.includes("jaringan")
        ) {
            errorType = "neural";
        } else if (
            error.includes("quantum") ||
            error.includes("qubit") ||
            error.includes("kubit")
        ) {
            errorType = "quantum";
        }

        // Analyze sentiment of the error message
        const sentimentAnalysis = this.sentimentAnalyzer.analyze(error);

        return {
            explanation: explanations[errorType] || explanations["general"],
            suggestions: this.getErrorSuggestions(errorType),
            examples: this.getErrorExamples(errorType),
            sentiment: {
                score: sentimentAnalysis.score,
                comparative: sentimentAnalysis.comparative,
            },
            severity: this.determineErrorSeverity(error),
        };
    }

    getErrorSuggestions(errorType) {
        const suggestions = {
            syntax: [
                "Check that all parentheses `()` and brackets `[]` are properly closed",
                "Ensure all statements end with the correct syntax",
                "Verify that keywords are spelled correctly",
            ],
            type: [
                "Check the types of variables you are using in operations",
                "Ensure function parameters match the expected types",
                "Use type conversion functions if needed",
            ],
            reference: [
                "Make sure the variable or function is defined before use",
                "Check the spelling of variable and function names",
                "Verify that imported modules are correctly imported",
            ],
            import: [
                "Check that the module name is spelled correctly",
                "Verify that the module is available in your project",
                "Ensure the import statement syntax is correct",
            ],
            general: [
                "Read the error message carefully for specific details",
                "Check the line number mentioned in the error",
                "Look at the code context around the error",
            ],
        };

        return suggestions[errorType] || suggestions["general"];
    }

    getErrorExamples(errorType) {
        const examples = {
            syntax: [
                '// Incorrect - missing closing parenthesis\njika (x > 5:\n    tampilkan "x is greater than 5"\n\n// Correct\njika (x > 5):\n    tampilkan "x is greater than 5"',
                '// Incorrect - missing colon\nfungsi myFunction()\n    kembalikan "Hello"\n\n// Correct\nfungsi myFunction():\n    kembalikan "Hello"',
            ],
            type: [
                '// Incorrect - adding string and number\nbuah pesan = "Hello"\nbuah angka = 5\nbuah hasil = pesan + angka\n\n// Correct - convert number to string\nbuah pesan = "Hello"\nbuah angka = 5\nbuah hasil = pesan + string(angka)',
            ],
            reference: [
                '// Incorrect - using undefined variable\ntampilkan nama\n\n// Correct - define variable first\nbuah nama = "KODEON"\ntampilkan nama',
            ],
            import: [
                "// Incorrect - wrong module name\nimpor matematika\n\n// Correct\nimpor math",
            ],
            neural: [
                "// Incorrect - wrong neural network syntax\njaringan myNet = jaringan()\n\n// Correct\njaringan myNet = ()",
            ],
            quantum: [
                "// Incorrect - wrong quantum syntax\nkubit q0 = kubit(0)\n\n// Correct\nkubit q0",
            ],
        };

        return examples[errorType] || [];
    }

    determineErrorSeverity(error) {
        // Determine error severity based on keywords
        if (error.includes("critical") || error.includes("fatal")) {
            return "critical";
        } else if (error.includes("error") || error.includes("kesalahan")) {
            return "high";
        } else if (error.includes("warning") || error.includes("peringatan")) {
            return "medium";
        } else if (error.includes("info") || error.includes("informasi")) {
            return "low";
        } else {
            return "medium"; // Default severity
        }
    }

    async improveCodeWithSuggestions(code, suggestions) {
        if (!this.isReady()) {
            throw new Error("NLP processor not initialized");
        }

        // In a real implementation, this would improve code based on suggestions
        // For now, we'll simulate this with simple pattern matching

        let improvedCode = code;

        // Apply refactoring suggestions
        for (const suggestion of suggestions) {
            if (suggestion.type === "refactoring" && suggestion.suggestion) {
                // This is a simplified implementation
                // In a real implementation, this would be much more sophisticated
                console.log(
                    "Applying refactoring suggestion:",
                    suggestion.suggestion
                );
            }
        }

        return improvedCode;
    }

    generateNeuralNetworkCode(text) {
        // Extract network name if possible
        let networkName = "myNetwork";

        const nameMatches = text.match(/(?:network|jaringan)\s+(\w+)/i);
        if (nameMatches && nameMatches[1]) {
            networkName = nameMatches[1];
        }

        // Generate code in both languages
        return `// English version
network ${networkName} = ()

// Add layers
layer.input(784)
layer.hidden(128, "relu")
layer.output(10, "softmax")

// Indonesian version
jaringan ${networkName} = ()

// Tambahkan lapisan
lapisan.input(784)
lapisan.tersembunyi(128, "relu")
lapisan.keluaran(10, "softmax")`;
    }

    generateQuantumComputingCode(text) {
        // Extract circuit name if possible
        let circuitName = "myCircuit";

        const nameMatches = text.match(/(?:circuit|sirkuit)\s+(\w+)/i);
        if (nameMatches && nameMatches[1]) {
            circuitName = nameMatches[1];
        }

        // Generate code in both languages
        return `// English version
circuit ${circuitName}(3)

// Apply gates
H(0)
CNOT(0, 1)
Measure([0, 1])

// Indonesian version
sirkuit ${circuitName}(3)

// Terapkan gerbang
H(0)
CNOT(0, 1)
Ukur([0, 1])`;
    }

    // Method to update context for context-aware parsing
    updateContext(newContext) {
        this.context = { ...this.context, ...newContext };
    }

    // Method to get conversation history
    getConversationHistory() {
        return [...this.conversationHistory];
    }

    // Method to clear conversation history
    clearConversationHistory() {
        this.conversationHistory = [];
    }
}

module.exports = NLPProcessor;
