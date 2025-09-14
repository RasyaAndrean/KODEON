# KODEON Marketplace

The KODEON Marketplace is a platform for discovering, installing, and managing extensions, themes, and other resources for the KODEON IDE.

## Directory Structure

```
marketplace/
├── api/                 # API interface and controllers
├── config/              # Configuration files
├── controllers/         # Request handlers
├── models/              # Data models
├── services/            # Business logic services
└── utils/               # Utility functions
```

## Components

### API (`api/`)

-   Main entry point for the marketplace API
-   Handles communication between the IDE and marketplace services

### Models (`models/`)

-   Extension model: Represents marketplace extensions
-   User model: Represents marketplace users
-   Category model: Represents marketplace categories

### Services (`services/`)

-   Marketplace service: Core business logic for marketplace operations
-   Database service: Handles data persistence

### Controllers (`controllers/`)

-   Marketplace controller: Handles HTTP requests and responses

### Utilities (`utils/`)

-   Database utilities: Database connection and query helpers

## Features

1. **Extension Discovery**: Browse and search extensions by category, popularity, and ratings
2. **Installation Management**: Install, uninstall, and update extensions
3. **User Accounts**: Manage user profiles and subscription status
4. **Payment Processing**: Handle purchases of paid extensions
5. **Rating and Reviews**: Allow users to rate and review extensions
6. **Categories**: Organize extensions by type (Themes, Plugins, Snippets, etc.)

## Integration with IDE

The marketplace is integrated with the KODEON IDE through IPC (Inter-Process Communication) handlers:

-   `get-marketplace-extensions`: Fetch available extensions
-   `get-marketplace-categories`: Fetch extension categories
-   `install-marketplace-extension`: Install an extension
-   `get-user-account`: Get current user account information

## Development

To run the marketplace locally:

1. Ensure all dependencies are installed
2. Configure the database connection in `config/marketplace.config.js`
3. Start the marketplace service

## Future Enhancements

-   Real-time notifications for extension updates
-   Social features for sharing extensions
-   Advanced search and filtering options
-   Extension analytics and usage tracking
-   Developer dashboard for extension publishers
