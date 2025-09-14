// Script to verify the directory structure
const fs = require("fs");
const path = require("path");

// Define expected file structure
const expectedStructure = {
    root: ["index.js", "main.js", "package.json", "README.md", "src"],
    src: [
        "ai",
        "assets",
        "components",
        "keybindings",
        "layouts",
        "learning",
        "preferences",
        "services",
        "styles",
        "utils",
        "main.js",
        "preload.js",
        "renderer.js",
    ],
    components: [
        "analytics-dashboard.js",
        "goals-dashboard.js",
        "layout-manager.js",
        "learning-path.js",
        "shortcut-editor.js",
        "theme-selector.js",
        "zoom-controls.js",
        "collaboration",
    ],
    collaborationComponents: [
        "workspaces-panel.js",
        "code-review-panel.js",
        "version-control-panel.js",
    ],
    services: [
        "comment-manager.js",
        "index.js",
        "sync-engine.js",
        "version-control.js",
        "workspace-manager.js",
    ],
};

// Function to check if a directory exists
function directoryExists(dirPath) {
    try {
        return fs.statSync(dirPath).isDirectory();
    } catch (err) {
        return false;
    }
}

// Function to check if a file exists
function fileExists(filePath) {
    try {
        return fs.statSync(filePath).isFile();
    } catch (err) {
        return false;
    }
}

// Function to verify structure
function verifyStructure() {
    const basePath = path.join(__dirname);
    const srcPath = path.join(basePath, "src");
    const componentsPath = path.join(srcPath, "components");
    const collaborationComponentsPath = path.join(
        componentsPath,
        "collaboration"
    );
    const servicesPath = path.join(srcPath, "services");

    console.log("Verifying KODEON IDE directory structure...\n");

    // Check root files
    console.log("Checking root directory...");
    let rootValid = true;
    for (const item of expectedStructure.root) {
        const itemPath = path.join(basePath, item);
        if (item === "src") {
            if (!directoryExists(itemPath)) {
                console.log(`❌ Missing directory: ${item}`);
                rootValid = false;
            } else {
                console.log(`✅ Found directory: ${item}`);
            }
        } else {
            if (!fileExists(itemPath)) {
                console.log(`❌ Missing file: ${item}`);
                rootValid = false;
            } else {
                console.log(`✅ Found file: ${item}`);
            }
        }
    }

    if (!rootValid) {
        console.log("\n❌ Root directory verification failed");
        return false;
    }
    console.log("✅ Root directory verification passed\n");

    // Check src directory
    console.log("Checking src directory...");
    let srcValid = true;
    for (const item of expectedStructure.src) {
        const itemPath = path.join(srcPath, item);
        if (
            [
                "ai",
                "assets",
                "components",
                "keybindings",
                "layouts",
                "learning",
                "preferences",
                "services",
                "styles",
                "utils",
            ].includes(item)
        ) {
            if (!directoryExists(itemPath)) {
                console.log(`❌ Missing directory: src/${item}`);
                srcValid = false;
            } else {
                console.log(`✅ Found directory: src/${item}`);
            }
        } else {
            if (!fileExists(itemPath)) {
                console.log(`❌ Missing file: src/${item}`);
                srcValid = false;
            } else {
                console.log(`✅ Found file: src/${item}`);
            }
        }
    }

    if (!srcValid) {
        console.log("\n❌ src directory verification failed");
        return false;
    }
    console.log("✅ src directory verification passed\n");

    // Check components directory
    console.log("Checking components directory...");
    let componentsValid = true;
    for (const item of expectedStructure.components) {
        const itemPath = path.join(componentsPath, item);
        if (item === "collaboration") {
            if (!directoryExists(itemPath)) {
                console.log(`❌ Missing directory: src/components/${item}`);
                componentsValid = false;
            } else {
                console.log(`✅ Found directory: src/components/${item}`);
            }
        } else {
            if (!fileExists(itemPath)) {
                console.log(`❌ Missing file: src/components/${item}`);
                componentsValid = false;
            } else {
                console.log(`✅ Found file: src/components/${item}`);
            }
        }
    }

    if (!componentsValid) {
        console.log("\n❌ components directory verification failed");
        return false;
    }
    console.log("✅ components directory verification passed\n");

    // Check collaboration components directory
    console.log("Checking collaboration components directory...");
    let collaborationComponentsValid = true;
    for (const item of expectedStructure.collaborationComponents) {
        const itemPath = path.join(collaborationComponentsPath, item);
        if (!fileExists(itemPath)) {
            console.log(
                `❌ Missing file: src/components/collaboration/${item}`
            );
            collaborationComponentsValid = false;
        } else {
            console.log(`✅ Found file: src/components/collaboration/${item}`);
        }
    }

    if (!collaborationComponentsValid) {
        console.log(
            "\n❌ collaboration components directory verification failed"
        );
        return false;
    }
    console.log("✅ collaboration components directory verification passed\n");

    // Check services directory
    console.log("Checking services directory...");
    let servicesValid = true;
    for (const item of expectedStructure.services) {
        const itemPath = path.join(servicesPath, item);
        if (!fileExists(itemPath)) {
            console.log(`❌ Missing file: src/services/${item}`);
            servicesValid = false;
        } else {
            console.log(`✅ Found file: src/services/${item}`);
        }
    }

    if (!servicesValid) {
        console.log("\n❌ services directory verification failed");
        return false;
    }
    console.log("✅ services directory verification passed\n");

    console.log("🎉 All directory structure verifications passed!");
    return true;
}

// Run verification
verifyStructure();
