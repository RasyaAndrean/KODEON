# KODEON Mobile IDE User Guide

## Getting Started

The KODEON Mobile IDE allows you to write, compile, and run KODEON code directly on your mobile device. This guide will help you get started with the mobile IDE.

## Installation

1. Ensure you have Node.js (version 16 or higher) installed on your development machine
2. Clone the KODEON repository
3. Navigate to the mobile IDE directory:
    ```bash
    cd ecosystem/mobile
    ```
4. Install dependencies:
    ```bash
    npm install
    ```
5. For iOS development, install CocoaPods dependencies:
    ```bash
    cd platforms/ios && pod install
    ```

## Running the Mobile IDE

### Android

To run on an Android device or emulator:

```bash
npm run android
```

### iOS

To run on an iOS device or simulator:

```bash
npm run ios
```

## Interface Overview

### Home Screen

The home screen displays your recent projects and provides options to:

-   Create a new project
-   Open an existing project
-   Access settings

### Code Editor

The code editor provides:

-   Syntax highlighting for KODEON
-   Line numbers
-   Auto-completion suggestions
-   Error highlighting
-   Run and save buttons

### Project Explorer

The project explorer allows you to:

-   Navigate through your project files
-   Create new files and folders
-   Rename or delete existing files

### Settings

The settings screen allows you to configure:

-   Editor preferences (theme, font size)
-   Cloud synchronization
-   AI assistant features

## Features

### Code Editing

-   Full syntax highlighting for KODEON
-   Line numbering
-   Auto-indentation
-   Undo/redo functionality

### Project Management

-   Create, open, and delete projects
-   Organize files in folders
-   Cloud synchronization across devices

### Compilation and Execution

-   Compile KODEON code using the remote compiler
-   Run programs and view output
-   Error detection and reporting

### AI Assistant

-   Code completion suggestions
-   Refactoring recommendations
-   Code explanations
-   Bug detection

### Mobile-Specific Features

-   Touch gesture support
-   Voice input for code dictation
-   Optimized interface for mobile screens

## Creating a New Project

1. From the home screen, tap "Create New Project"
2. Enter a name for your project
3. The IDE will create a new project with a default main.kodeon file
4. Start coding in the editor

## Managing Files

### Creating Files

1. Open the project explorer
2. Tap the file icon to create a new file
3. Enter a name for your file
4. The file will be created in the current directory

### Creating Folders

1. Open the project explorer
2. Tap the folder icon to create a new folder
3. Enter a name for your folder
4. The folder will be created in the current directory

### Renaming Files/Folders

1. Long press on a file or folder in the project explorer
2. Select "Rename" from the context menu
3. Enter the new name
4. Tap "OK" to confirm

### Deleting Files/Folders

1. Long press on a file or folder in the project explorer
2. Select "Delete" from the context menu
3. Confirm the deletion

## Using the AI Assistant

### Code Completion

As you type, the AI assistant will provide code completion suggestions. Tap on a suggestion to insert it into your code.

### Refactoring

To get refactoring suggestions:

1. Open the command palette (three dots menu)
2. Select "AI Assistant" > "Refactor Code"
3. Review the suggestions and apply them as needed

### Code Explanation

To get an explanation of your code:

1. Select the code you want to understand
2. Open the command palette
3. Select "AI Assistant" > "Explain Code"
4. Read the explanation in the output panel

## Cloud Synchronization

To enable cloud synchronization:

1. Go to Settings
2. Enable "Cloud Sync"
3. Sign in with your KODEON account
4. Your projects will automatically sync across devices

## Voice Input

To use voice input:

1. Open the code editor
2. Tap the microphone icon in the toolbar
3. Speak your code naturally
4. The IDE will convert your speech to code
5. Tap the microphone icon again to stop

## Troubleshooting

### Common Issues

**Issue: The app crashes on startup**
Solution: Ensure all dependencies are installed correctly and try rebuilding the project.

**Issue: Compilation fails**
Solution: Check your code for syntax errors and ensure you have an internet connection to access the remote compiler.

**Issue: Cloud sync not working**
Solution: Verify your internet connection and check that you're signed in to your KODEON account.

### Getting Help

If you encounter issues not covered in this guide:

1. Check the KODEON community forums
2. Submit a bug report through the IDE
3. Contact KODEON support

## Feedback and Suggestions

We're constantly improving the KODEON Mobile IDE. If you have feedback or suggestions:

1. Use the feedback form in the settings
2. Submit issues on the KODEON GitHub repository
3. Join the KODEON community discussions
