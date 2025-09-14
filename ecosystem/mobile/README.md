# KODEON Mobile IDE

The KODEON Mobile IDE is a cross-platform mobile application that allows developers to write, compile, and run KODEON code directly on their mobile devices.

## Features

-   **Code Editor**: Full-featured code editor with syntax highlighting
-   **Project Management**: Create, manage, and organize KODEON projects
-   **Compiler Integration**: Compile and run KODEON code using the remote compiler
-   **AI Assistant**: Get code suggestions, refactoring advice, and explanations
-   **Cloud Sync**: Synchronize projects across devices
-   **Touch Gestures**: Optimized for touch interaction
-   **Voice Input**: Dictate code using voice recognition

## Directory Structure

```
mobile/
├── src/                 # Main source code
├── components/          # React Native components
├── services/            # Business logic and API integrations
├── utils/               # Utility functions
├── assets/              # Images, fonts, and other assets
├── config/              # Configuration files
├── platforms/           # Platform-specific code
│   ├── android/         # Android-specific files
│   └── ios/             # iOS-specific files
├── docs/                # Documentation
├── __tests__/           # Test files
└── ...
```

## Installation

1. Install dependencies:

    ```bash
    npm install
    ```

2. For iOS, install CocoaPods dependencies:

    ```bash
    cd platforms/ios && pod install
    ```

3. Start the development server:

    ```bash
    npm start
    ```

4. Run on Android:

    ```bash
    npm run android
    ```

5. Run on iOS:
    ```bash
    npm run ios
    ```

## Architecture

The mobile IDE follows a modular architecture with clear separation of concerns:

-   **Components**: UI elements and screens
-   **Services**: Business logic and external API integrations
-   **Utils**: Helper functions and utilities
-   **Config**: Configuration files

## Services

-   **FileManager**: Handles local file operations and project management
-   **CompilerService**: Integrates with the KODEON remote compiler
-   **AIAssistant**: Provides AI-powered code assistance
-   **CloudSync**: Manages cloud synchronization of projects

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.
