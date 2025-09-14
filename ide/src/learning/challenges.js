// Challenge Generator for KODEON IDE
class ChallengeGenerator {
    constructor() {
        this.isInitialized = false;
        this.challengeTemplates = [];
        this.skillAreas = [];
    }

    async initialize() {
        try {
            // Initialize with challenge templates
            this.challengeTemplates = [
                {
                    id: "basic-output",
                    name: "Basic Output Challenge",
                    description:
                        "Create a program that outputs a specific message",
                    difficulty: "Beginner",
                    skillArea: "syntax",
                    template: `// Create a program that outputs the following message:
// "Welcome to KODEON programming!"
//
// Requirements:
// 1. Use both Indonesian and English syntax
// 2. Output the exact message shown above
// 3. Run the program successfully

// Your code here:`,
                    solution: `// English version
show "Welcome to KODEON programming!"

// Indonesian version
tampilkan "Welcome to KODEON programming!"`,
                    validation: this.validateBasicOutput.bind(this),
                },
                {
                    id: "simple-calculator",
                    name: "Simple Calculator",
                    description:
                        "Build a calculator that performs basic arithmetic operations",
                    difficulty: "Beginner",
                    skillArea: "functions",
                    template: `// Create a simple calculator with the following functions:
// 1. Addition (tambah/add)
// 2. Subtraction (kurang/subtract)
// 3. Multiplication (kali/multiply)
// 4. Division (bagi/divide)
//
// Requirements:
// 1. Create functions for each operation
// 2. Test each function with sample values
// 3. Handle division by zero

// Your code here:`,
                    solution: `// Calculator functions
fungsi tambah(a, b):
    kembalikan a + b

fungsi kurang(a, b):
    kembalikan a - b

fungsi kali(a, b):
    kembalikan a * b

fungsi bagi(a, b):
    jika b == 0:
        kembalikan "Error: Division by zero"
    sebaliknya:
        kembalikan a / b

// Test the functions
buah hasil1 = tambah(10, 5)
buah hasil2 = kurang(10, 5)
buah hasil3 = kali(10, 5)
buah hasil4 = bagi(10, 5)
buah hasil5 = bagi(10, 0)

tampilkan "10 + 5 = " + hasil1
tampilkan "10 - 5 = " + hasil2
tampilkan "10 * 5 = " + hasil3
tampilkan "10 / 5 = " + hasil4
tampilkan "10 / 0 = " + hasil5

// English version
function add(a, b):
    return a + b

function subtract(a, b):
    return a - b

function multiply(a, b):
    return a * b

function divide(a, b):
    if b == 0:
        return "Error: Division by zero"
    otherwise:
        return a / b

// Test the functions
create result1 = add(10, 5)
create result2 = subtract(10, 5)
create result3 = multiply(10, 5)
create result4 = divide(10, 5)
create result5 = divide(10, 0)

show "10 + 5 = " + result1
show "10 - 5 = " + result2
show "10 * 5 = " + result3
show "10 / 5 = " + result4
show "10 / 0 = " + result5`,
                    validation: this.validateCalculator.bind(this),
                },
                {
                    id: "data-structures",
                    name: "Data Structures Challenge",
                    description:
                        "Work with lists and dictionaries to manage data",
                    difficulty: "Intermediate",
                    skillArea: "data-structures",
                    template: `// Create a program to manage a student database using lists and dictionaries
//
// Requirements:
// 1. Create a list of students (each student is a dictionary)
// 2. Each student should have: name, age, grades (list of numbers)
// 3. Implement functions to:
//    - Add a new student
//    - Calculate average grade for a student
//    - Find students above a certain grade average
//    - Display all students
//
// Sample data:
// Student 1: John, 20, grades [85, 92, 78]
// Student 2: Jane, 19, grades [90, 88, 95]
// Student 3: Bob, 21, grades [76, 82, 89]

// Your code here:`,
                    solution: `// Student database
buat students = []

// Function to add a new student
fungsi tambahSiswa(nama, umur, nilai):
    buat siswa = {
        nama: nama,
        umur: umur,
        nilai: nilai
    }
    students.tambah(siswa)

// Function to calculate average grade
fungsi hitungRataRata(nilai):
    buat total = 0
    untuk nilai di nilai:
        total = total + nilai
    kembalikan total / panjang(nilai)

// Function to find students above average
fungsi cariSiswaDiAtasRataRata(rataRataTarget):
    buat hasil = []
    untuk siswa di students:
        buat rataRata = hitungRataRata(siswa.nilai)
        jika rataRata > rataRataTarget:
            hasil.tambah(siswa)
    kembalikan hasil

// Function to display all students
fungsi tampilkanSemuaSiswa():
    untuk siswa di students:
        buat rataRata = hitungRataRata(siswa.nilai)
        tampilkan "Nama: " + siswa.nama + ", Umur: " + siswa.umur + ", Rata-rata: " + rataRata

// Add sample students
tambahSiswa("John", 20, [85, 92, 78])
tambahSiswa("Jane", 19, [90, 88, 95])
tambahSiswa("Bob", 21, [76, 82, 89])

// Display all students
tampilkanSemuaSiswa()

// Find students with average above 85
buat siswaBaik = cariSiswaDiAtasRataRata(85)
tampilkan "Siswa dengan rata-rata di atas 85:"
untuk siswa di siswaBaik:
    tampilkan siswa.nama

// English version
create students = []

// Function to add a new student
function addStudent(name, age, grades):
    create student = {
        name: name,
        age: age,
        grades: grades
    }
    students.add(student)

// Function to calculate average grade
function calculateAverage(grades):
    create total = 0
    for grade in grades:
        total = total + grade
    return total / length(grades)

// Function to find students above average
function findStudentsAboveAverage(targetAverage):
    create result = []
    for student in students:
        create average = calculateAverage(student.grades)
        if average > targetAverage:
            result.add(student)
    return result

// Function to display all students
function displayAllStudents():
    for student in students:
        create average = calculateAverage(student.grades)
        show "Name: " + student.name + ", Age: " + student.age + ", Average: " + average

// Add sample students
addStudent("John", 20, [85, 92, 78])
addStudent("Jane", 19, [90, 88, 95])
addStudent("Bob", 21, [76, 82, 89])

// Display all students
displayAllStudents()

// Find students with average above 85
create goodStudents = findStudentsAboveAverage(85)
show "Students with average above 85:"
for student in goodStudents:
    show student.name`,
                    validation: this.validateDataStructures.bind(this),
                },
            ];

            // Define skill areas
            this.skillAreas = [
                "syntax",
                "control-flow",
                "functions",
                "data-structures",
                "oop",
                "error-handling",
                "modules",
            ];

            this.isInitialized = true;
            console.log("Challenge generator initialized");
            return true;
        } catch (error) {
            console.error("Error initializing challenge generator:", error);
            return false;
        }
    }

    isReady() {
        return this.isInitialized;
    }

    async createChallenge(userProfile, skillLevel) {
        if (!this.isReady()) {
            throw new Error("Challenge generator not initialized");
        }

        // Filter challenges by skill level
        const levelChallenges = this.challengeTemplates.filter(
            (challenge) => challenge.difficulty === skillLevel
        );

        // If no challenges for this level, get beginner challenges
        const challengesToUse =
            levelChallenges.length > 0
                ? levelChallenges
                : this.challengeTemplates.filter(
                      (c) => c.difficulty === "Beginner"
                  );

        // Select a random challenge
        const randomIndex = Math.floor(Math.random() * challengesToUse.length);
        const challenge = challengesToUse[randomIndex];

        return {
            ...challenge,
            id: `${challenge.id}-${Date.now()}`, // Unique ID for this instance
            assignedAt: new Date().toISOString(),
        };
    }

    async createSkillChallenge(skillArea, difficulty) {
        if (!this.isReady()) {
            throw new Error("Challenge generator not initialized");
        }

        // Filter challenges by skill area and difficulty
        const relevantChallenges = this.challengeTemplates.filter(
            (challenge) =>
                challenge.skillArea === skillArea &&
                challenge.difficulty === difficulty
        );

        // If no specific challenges, get any challenge for this difficulty
        const challengesToUse =
            relevantChallenges.length > 0
                ? relevantChallenges
                : this.challengeTemplates.filter(
                      (c) => c.difficulty === difficulty
                  );

        // Select a random challenge
        const randomIndex = Math.floor(Math.random() * challengesToUse.length);
        const challenge = challengesToUse[randomIndex];

        return {
            ...challenge,
            id: `${challenge.id}-${Date.now()}`, // Unique ID for this instance
            assignedAt: new Date().toISOString(),
        };
    }

    validateBasicOutput(userCode) {
        // Simple validation - check if the expected output is present
        const hasShow =
            userCode.includes("show") || userCode.includes("tampilkan");
        const hasExpectedText = userCode.includes(
            "Welcome to KODEON programming"
        );

        return {
            passed: hasShow && hasExpectedText,
            feedback:
                hasShow && hasExpectedText
                    ? "Great job! Your program correctly outputs the required message."
                    : "Make sure to use the show/tampilkan command and include the exact message.",
            score: hasShow && hasExpectedText ? 100 : 0,
        };
    }

    validateCalculator(userCode) {
        // Check for required functions
        const hasAdd = userCode.includes("tambah") || userCode.includes("add");
        const hasSubtract =
            userCode.includes("kurang") || userCode.includes("subtract");
        const hasMultiply =
            userCode.includes("kali") || userCode.includes("multiply");
        const hasDivide =
            userCode.includes("bagi") || userCode.includes("divide");
        const hasFunction =
            userCode.includes("fungsi") || userCode.includes("function");

        // Check for function calls
        const hasFunctionCalls =
            (userCode.match(/\w+\s*\(/g) || []).length >= 4;

        const passed =
            hasAdd &&
            hasSubtract &&
            hasMultiply &&
            hasDivide &&
            hasFunction &&
            hasFunctionCalls;

        return {
            passed: passed,
            feedback: passed
                ? "Excellent! You have implemented all required calculator functions."
                : "Make sure to implement all four arithmetic functions and test them.",
            score: passed
                ? 100
                : Math.min(
                      25 *
                          [hasAdd, hasSubtract, hasMultiply, hasDivide].filter(
                              Boolean
                          ).length,
                      100
                  ),
        };
    }

    validateDataStructures(userCode) {
        // Check for required elements
        const hasList = userCode.includes("[") && userCode.includes("]");
        const hasDictionary = userCode.includes("{") && userCode.includes("}");
        const hasFunction =
            userCode.includes("fungsi") || userCode.includes("function");
        const hasLoop =
            userCode.includes("untuk") ||
            userCode.includes("for") ||
            userCode.includes("selama") ||
            userCode.includes("while");

        const passed = hasList && hasDictionary && hasFunction && hasLoop;

        return {
            passed: passed,
            feedback: passed
                ? "Well done! You have correctly implemented data structures and operations."
                : "Make sure to use lists, dictionaries, functions, and loops in your solution.",
            score: passed
                ? 100
                : Math.min(
                      25 *
                          [hasList, hasDictionary, hasFunction, hasLoop].filter(
                              Boolean
                          ).length,
                      100
                  ),
        };
    }

    async validateChallenge(challenge, userCode) {
        if (!this.isReady()) {
            throw new Error("Challenge generator not initialized");
        }

        // Use the challenge's validation function
        if (challenge.validation) {
            return challenge.validation(userCode);
        }

        // Default validation - check if code was written
        return {
            passed: userCode.trim().length > 20, // At least 20 characters
            feedback:
                userCode.trim().length > 20
                    ? "Thanks for attempting the challenge!"
                    : "Please write more code to complete this challenge.",
            score: userCode.trim().length > 20 ? 50 : 0,
        };
    }
}

module.exports = ChallengeGenerator;
