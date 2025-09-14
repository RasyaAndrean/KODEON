// Utility script to verify the directory structure
const fs = require("fs");
const path = require("path");

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
    const basePath = path.join(__dirname, "..");
    const componentsPath = path.join(basePath, "components");
    const collaborationComponentsPath = path.join(
        componentsPath,
        "collaboration"
    );
    const servicesPath = path.join(basePath, "services");

    console.log("Verifying KODEON IDE directory structure...\n");

    // Check components directory
    console.log("Checking components directory...");
    const expectedComponents = [
        "analytics-dashboard.js",
        "goals-dashboard.js",
        "layout-manager.js",
        "learning-path.js",
        "shortcut-editor.js",
        "theme-selector.js",
        "zoom-controls.js",
        "collaboration",
    ];

    let componentsValid = true;
    for (const item of expectedComponents) {
        const itemPath = path.join(componentsPath, item);
        if (item === "collaboration") {
            if (!directoryExists(itemPath)) {
                console.log(`❌ Missing directory: components/${item}`);
                componentsValid = false;
            } else {
                console.log(`✅ Found directory: components/${item}`);
            }
        } else {
            if (!fileExists(itemPath)) {
                console.log(`❌ Missing file: components/${item}`);
                componentsValid = false;
            } else {
                console.log(`✅ Found file: components/${item}`);
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
    const expectedCollaborationComponents = [
        "workspaces-panel.js",
        "code-review-panel.js",
        "version-control-panel.js",
    ];

    let collaborationComponentsValid = true;
    for (const item of expectedCollaborationComponents) {
        const itemPath = path.join(collaborationComponentsPath, item);
        if (!fileExists(itemPath)) {
            console.log(`❌ Missing file: components/collaboration/${item}`);
            collaborationComponentsValid = false;
        } else {
            console.log(`✅ Found file: components/collaboration/${item}`);
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
    const expectedServices = [
        "comment-manager.js",
        "index.js",
        "sync-engine.js",
        "version-control.js",
        "workspace-manager.js",
    ];

    let servicesValid = true;
    for (const item of expectedServices) {
        const itemPath = path.join(servicesPath, item);
        if (!fileExists(itemPath)) {
            console.log(`❌ Missing file: services/${item}`);
            servicesValid = false;
        } else {
            console.log(`✅ Found file: services/${item}`);
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

// Run verification if this script is executed directly
if (require.main === module) {
    verifyStructure();
}

module.exports = { verifyStructure };
