/**
 * Initialization script for KODEON Mobile IDE
 * Sets up the initial project structure and configuration
 */

const fs = require("fs");
const path = require("path");

// Create initial directories if they don't exist
const directories = [
    "src",
    "components",
    "services",
    "utils",
    "assets",
    "config",
    "platforms/android",
    "platforms/ios",
    "docs",
    "__tests__",
    "scripts",
];

console.log("Initializing KODEON Mobile IDE...");

directories.forEach((dir) => {
    const dirPath = path.join(__dirname, "..", dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }
});

// Create a basic project structure
const initialProjects = [
    {
        id: "welcome-project",
        name: "Welcome to KODEON",
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        files: [
            {
                id: "main",
                name: "main.kodeon",
                content: `// Welcome to KODEON Mobile IDE!
// This is a sample KODEON program

function main() {
  print("Hello, KODEON Mobile IDE!");

  // Try running this program
  // You can also create new projects and files
}

main();`,
                path: "main.kodeon",
            },
            {
                id: "readme",
                name: "README.md",
                content:
                    "# Welcome to KODEON\n\nThis is your first KODEON project. Feel free to explore and start coding!",
                path: "README.md",
            },
        ],
    },
];

// Save initial projects to a mock storage file
const storagePath = path.join(__dirname, "..", "storage");
if (!fs.existsSync(storagePath)) {
    fs.mkdirSync(storagePath);
}

const projectsPath = path.join(storagePath, "projects.json");
if (!fs.existsSync(projectsPath)) {
    fs.writeFileSync(projectsPath, JSON.stringify(initialProjects, null, 2));
    console.log("Created initial project structure");
}

console.log("KODEON Mobile IDE initialization complete!");
console.log("\nTo start developing:");
console.log('1. Run "npm install" to install dependencies');
console.log('2. Run "npm start" to start the development server');
console.log(
    '3. Run "npm run android" or "npm run ios" to launch on a device or emulator'
);
