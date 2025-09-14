# KODEON IDE Source Code

This directory contains the source code for the KODEON IDE.

## Directory Structure

-   `ai/` - AI services and utilities
-   `components/` - UI components
    -   `collaboration/` - Collaboration-specific UI components
-   `keybindings/` - Keyboard shortcut configurations
-   `layouts/` - Layout configurations
-   `learning/` - Learning system components
-   `preferences/` - Preference management system
-   `services/` - Backend services
-   `styles/` - Global styles and themes
-   `utils/` - Utility functions
-   `assets/` - Static assets (images, icons, etc.)

## Main Files

-   `main.js` - Electron main process
-   `preload.js` - Electron preload script
-   `renderer.js` - Electron renderer process

## Entry Point

The IDE is launched from the root `main.js` file which loads `src/main.js`.
