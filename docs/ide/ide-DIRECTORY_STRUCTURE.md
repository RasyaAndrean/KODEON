# KODEON IDE Directory Structure

This document outlines the organized directory structure for the KODEON IDE.

## Root Directory

```
ide/
├── index.js                  # Entry point
├── main.js                   # Bootstrap file
├── package.json             # Project configuration
├── README.md                # Project overview
└── src/                     # Source code directory
```

## Source Directory

```
src/
├── ai/                      # AI services and utilities
├── assets/                  # Static assets (images, icons, etc.)
├── components/              # UI components
│   ├── collaboration/       # Collaboration-specific UI components
│   ├── analytics-dashboard.js
│   ├── goals-dashboard.js
│   ├── layout-manager.js
│   ├── learning-path.js
│   ├── shortcut-editor.js
│   ├── theme-selector.js
│   └── zoom-controls.js
├── keybindings/             # Keyboard shortcut configurations
├── layouts/                 # Layout configurations
├── learning/                # Learning system components
├── preferences/             # Preference management system
├── services/                # Backend services
│   ├── comment-manager.js
│   ├── index.js
│   ├── sync-engine.js
│   ├── version-control.js
│   └── workspace-manager.js
├── styles/                  # Global styles and themes
├── utils/                   # Utility functions
├── main.js                  # Electron main process
├── preload.js               # Electron preload script
└── renderer.js              # Electron renderer process
```

## Components Directory

The `components/` directory contains all UI components organized by feature area:

-   **General Components**: Core UI components used throughout the IDE
-   **Collaboration Components**: Specialized components for collaborative features

## Services Directory

The `services/` directory contains all backend services:

-   **Sync Engine**: Real-time collaborative coding functionality
-   **Workspace Manager**: Shared project workspaces management
-   **Comment Manager**: Code review and commenting system
-   **Version Control**: Git integration and repository management

## Benefits of This Structure

1. **Modularity**: Each feature area is contained in its own directory
2. **Scalability**: Easy to add new features without disrupting existing code
3. **Maintainability**: Clear separation of concerns makes code easier to maintain
4. **Discoverability**: Intuitive organization makes it easy to find files
5. **Collaboration**: Team members can work on different areas without conflicts

## Migration Notes

All existing files have been moved to this new structure while maintaining their functionality. Import paths have been updated accordingly.
