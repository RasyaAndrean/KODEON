// Preference Manager for KODEON IDE
const fs = require("fs");
const path = require("path");

class PreferenceManager {
    constructor() {
        this.configPath = path.join(__dirname, "config.json");
        this.themesDir = path.join(__dirname, "themes");
        this.keybindingsDir = path.join(__dirname, "..", "keybindings");
        this.layoutsDir = path.join(__dirname, "..", "layouts");

        // Load default configuration
        this.defaultConfig = this.loadDefaultConfig();

        // Load user configuration or create default if it doesn't exist
        this.userConfig = this.loadUserConfig();
    }

    loadDefaultConfig() {
        try {
            const configData = fs.readFileSync(this.configPath, "utf8");
            return JSON.parse(configData);
        } catch (error) {
            console.error("Error loading default configuration:", error);
            return this.getDefaultConfig();
        }
    }

    getDefaultConfig() {
        return {
            version: "1.0",
            theme: "dark",
            fontSize: 14,
            zoomLevel: 1.0,
            layout: "default",
            keybindings: "default",
            panels: {
                editor: {
                    visible: true,
                    position: "center",
                    size: "70%",
                },
                output: {
                    visible: true,
                    position: "right",
                    size: "30%",
                },
                problems: {
                    visible: true,
                    position: "bottom",
                    size: "30%",
                },
            },
            shortcuts: {
                newFile: "Ctrl+N",
                openFile: "Ctrl+O",
                saveFile: "Ctrl+S",
                compile: "F5",
                run: "F6",
                undo: "Ctrl+Z",
                redo: "Ctrl+Y",
            },
        };
    }

    loadUserConfig() {
        const userConfigPath = path.join(__dirname, "..", "user-config.json");

        try {
            if (fs.existsSync(userConfigPath)) {
                const configData = fs.readFileSync(userConfigPath, "utf8");
                return { ...this.defaultConfig, ...JSON.parse(configData) };
            } else {
                // Create default user config file
                this.saveUserConfig(this.defaultConfig);
                return this.defaultConfig;
            }
        } catch (error) {
            console.error("Error loading user configuration:", error);
            return this.defaultConfig;
        }
    }

    saveUserConfig(config) {
        const userConfigPath = path.join(__dirname, "..", "user-config.json");

        try {
            fs.writeFileSync(userConfigPath, JSON.stringify(config, null, 2));
            this.userConfig = config;
            return true;
        } catch (error) {
            console.error("Error saving user configuration:", error);
            return false;
        }
    }

    getConfig() {
        return this.userConfig;
    }

    updateConfig(newConfig) {
        this.userConfig = { ...this.userConfig, ...newConfig };
        return this.saveUserConfig(this.userConfig);
    }

    getTheme(themeName) {
        const themePath = path.join(this.themesDir, `${themeName}.json`);

        try {
            if (fs.existsSync(themePath)) {
                const themeData = fs.readFileSync(themePath, "utf8");
                return JSON.parse(themeData);
            } else {
                console.warn(
                    `Theme ${themeName} not found, returning default dark theme`
                );
                return this.getTheme("dark");
            }
        } catch (error) {
            console.error(`Error loading theme ${themeName}:`, error);
            return this.getTheme("dark");
        }
    }

    getAllThemes() {
        try {
            const themeFiles = fs.readdirSync(this.themesDir);
            const themes = {};

            themeFiles.forEach((file) => {
                if (file.endsWith(".json")) {
                    const themeName = path.basename(file, ".json");
                    themes[themeName] = this.getTheme(themeName);
                }
            });

            return themes;
        } catch (error) {
            console.error("Error loading themes:", error);
            return {};
        }
    }

    getKeybindingScheme(schemeName) {
        const keybindingPath = path.join(
            this.keybindingsDir,
            `${schemeName}.json`
        );

        try {
            if (fs.existsSync(keybindingPath)) {
                const keybindingData = fs.readFileSync(keybindingPath, "utf8");
                return JSON.parse(keybindingData);
            } else {
                console.warn(
                    `Keybinding scheme ${schemeName} not found, returning default scheme`
                );
                return this.getKeybindingScheme("vscode");
            }
        } catch (error) {
            console.error(
                `Error loading keybinding scheme ${schemeName}:`,
                error
            );
            return this.getKeybindingScheme("vscode");
        }
    }

    getAllKeybindingSchemes() {
        try {
            const keybindingFiles = fs.readdirSync(this.keybindingsDir);
            const schemes = {};

            keybindingFiles.forEach((file) => {
                if (file.endsWith(".json")) {
                    const schemeName = path.basename(file, ".json");
                    schemes[schemeName] = this.getKeybindingScheme(schemeName);
                }
            });

            return schemes;
        } catch (error) {
            console.error("Error loading keybinding schemes:", error);
            return {};
        }
    }

    getLayout(layoutName) {
        const layoutPath = path.join(this.layoutsDir, `${layoutName}.json`);

        try {
            if (fs.existsSync(layoutPath)) {
                const layoutData = fs.readFileSync(layoutPath, "utf8");
                return JSON.parse(layoutData);
            } else {
                console.warn(
                    `Layout ${layoutName} not found, returning default layout`
                );
                return this.getDefaultLayout();
            }
        } catch (error) {
            console.error(`Error loading layout ${layoutName}:`, error);
            return this.getDefaultLayout();
        }
    }

    getDefaultLayout() {
        return {
            name: "Default",
            description: "Default layout",
            fontSize: 14,
            zoomLevel: 1.0,
            panels: {
                editor: {
                    visible: true,
                    position: "center",
                    size: "70%",
                },
                output: {
                    visible: true,
                    position: "right",
                    size: "30%",
                },
                problems: {
                    visible: true,
                    position: "bottom",
                    size: "30%",
                },
            },
        };
    }

    getAllLayouts() {
        try {
            const layoutFiles = fs.readdirSync(this.layoutsDir);
            const layouts = {};

            layoutFiles.forEach((file) => {
                if (file.endsWith(".json")) {
                    const layoutName = path.basename(file, ".json");
                    layouts[layoutName] = this.getLayout(layoutName);
                }
            });

            return layouts;
        } catch (error) {
            console.error("Error loading layouts:", error);
            return {};
        }
    }
}

module.exports = new PreferenceManager();
