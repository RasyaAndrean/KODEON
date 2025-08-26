//! Module resolver for the KODEON programming language
//! Handles import resolution for standard library, user modules, and external packages

use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};

/// Module resolver for handling imports
pub struct ModuleResolver {
    /// Standard library modules
    stdlib_modules: HashMap<String, String>,
    /// User modules
    user_modules: HashMap<String, String>,
    /// Search paths for modules
    search_paths: Vec<PathBuf>,
    /// Project root directory for package resolution
    project_root: Option<PathBuf>,
}

impl ModuleResolver {
    /// Create a new module resolver
    pub fn new() -> Self {
        let mut resolver = ModuleResolver {
            stdlib_modules: HashMap::new(),
            user_modules: HashMap::new(),
            search_paths: vec![],
            project_root: None,
        };

        // Initialize standard library modules
        resolver.init_stdlib_modules();

        resolver
    }

    /// Create a new module resolver with a project root
    pub fn with_project_root(project_root: PathBuf) -> Self {
        let mut resolver = Self::new();
        resolver.project_root = Some(project_root);
        resolver
    }

    /// Initialize standard library modules
    fn init_stdlib_modules(&mut self) {
        // Core modules
        self.stdlib_modules.insert("core".to_string(), include_str!("../../stdlib/core/core.kodeon").to_string());
        self.stdlib_modules.insert("math".to_string(), include_str!("../../stdlib/core/math.kodeon").to_string());

        // Collections
        self.stdlib_modules.insert("collections".to_string(), include_str!("../../stdlib/data/collections.kodeon").to_string());

        // Text processing
        self.stdlib_modules.insert("string".to_string(), include_str!("../../stdlib/text/string.kodeon").to_string());

        // Data formats
        self.stdlib_modules.insert("json".to_string(), include_str!("../../stdlib/data/json.kodeon").to_string());

        // System modules
        self.stdlib_modules.insert("system".to_string(), include_str!("../../stdlib/system/system.kodeon").to_string());
        self.stdlib_modules.insert("io".to_string(), include_str!("../../stdlib/system/io.kodeon").to_string());
        self.stdlib_modules.insert("time".to_string(), include_str!("../../stdlib/system/time.kodeon").to_string());
        self.stdlib_modules.insert("concurrent".to_string(), include_str!("../../stdlib/system/concurrent.kodeon").to_string());

        // Additional modules can be added here as they are implemented
    }

    /// Add a search path for user modules
    pub fn add_search_path(&mut self, path: PathBuf) {
        self.search_paths.push(path);
    }

    /// Set the project root directory
    pub fn set_project_root(&mut self, path: PathBuf) {
        self.project_root = Some(path);
    }

    /// Resolve a module import
    pub fn resolve_module(&self, module_name: &str) -> Result<String, String> {
        // First check standard library
        if let Some(content) = self.stdlib_modules.get(module_name) {
            return Ok(content.clone());
        }

        // Then check user modules
        if let Some(content) = self.user_modules.get(module_name) {
            return Ok(content.clone());
        }

        // Check for external packages in kodeon_modules directory
        if let Some(ref project_root) = self.project_root {
            let package_path = project_root.join("kodeon_modules").join(module_name).join("src").join("lib.kodeon");
            if package_path.exists() {
                match fs::read_to_string(&package_path) {
                    Ok(content) => {
                        return Ok(content);
                    }
                    Err(e) => {
                        return Err(format!("Failed to read package file {}: {}", package_path.display(), e));
                    }
                }
            }

            // Also check for a main file in the package root
            let main_path = project_root.join("kodeon_modules").join(module_name).join("main.kodeon");
            if main_path.exists() {
                match fs::read_to_string(&main_path) {
                    Ok(content) => {
                        return Ok(content);
                    }
                    Err(e) => {
                        return Err(format!("Failed to read package file {}: {}", main_path.display(), e));
                    }
                }
            }
        }

        // Finally, try to find the module in search paths
        for search_path in &self.search_paths {
            let module_path = search_path.join(format!("{}.kodeon", module_name));
            if module_path.exists() {
                match fs::read_to_string(&module_path) {
                    Ok(content) => {
                        return Ok(content);
                    }
                    Err(e) => {
                        return Err(format!("Failed to read module file {}: {}", module_path.display(), e));
                    }
                }
            }
        }

        Err(format!("Module '{}' not found", module_name))
    }

    /// Register a user module
    pub fn register_user_module(&mut self, module_name: String, content: String) {
        self.user_modules.insert(module_name, content);
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use std::path::PathBuf;
    use tempfile::TempDir;

    #[test]
    fn test_stdlib_resolution() {
        let resolver = ModuleResolver::new();

        // Test core module resolution
        assert!(resolver.resolve_module("core").is_ok());
        assert!(resolver.resolve_module("math").is_ok());
        assert!(resolver.resolve_module("collections").is_ok());
        assert!(resolver.resolve_module("string").is_ok());
        assert!(resolver.resolve_module("json").is_ok());
        assert!(resolver.resolve_module("system").is_ok());
        assert!(resolver.resolve_module("io").is_ok());
        assert!(resolver.resolve_module("time").is_ok());
        assert!(resolver.resolve_module("concurrent").is_ok());
    }

    #[test]
    fn test_module_not_found() {
        let resolver = ModuleResolver::new();
        assert!(resolver.resolve_module("nonexistent_module").is_err());
    }

    #[test]
    fn test_package_resolution() {
        // Create a temporary directory structure for testing
        let temp_dir = TempDir::new().unwrap();
        let project_root = temp_dir.path().to_path_buf();

        // Create kodeon_modules directory structure
        let package_dir = project_root.join("kodeon_modules").join("test_package").join("src");
        fs::create_dir_all(&package_dir).unwrap();

        // Create a test package file
        let package_file = package_dir.join("lib.kodeon");
        fs::write(&package_file, "fungsi halo() { kembalikan \"Halo dari paket!\" }").unwrap();

        // Create module resolver with project root
        let resolver = ModuleResolver::with_project_root(project_root);

        // Test package resolution
        let result = resolver.resolve_module("test_package");
        assert!(result.is_ok());
        assert!(result.unwrap().contains("fungsi halo"));
    }

    #[test]
    fn test_package_resolution_main_file() {
        // Create a temporary directory structure for testing
        let temp_dir = TempDir::new().unwrap();
        let project_root = temp_dir.path().to_path_buf();

        // Create kodeon_modules directory structure
        let package_dir = project_root.join("kodeon_modules").join("test_package");
        fs::create_dir_all(&package_dir).unwrap();

        // Create a test package main file
        let main_file = package_dir.join("main.kodeon");
        fs::write(&main_file, "fungsi halo() { kembalikan \"Halo dari paket utama!\" }").unwrap();

        // Create module resolver with project root
        let resolver = ModuleResolver::with_project_root(project_root);

        // Test package resolution
        let result = resolver.resolve_module("test_package");
        assert!(result.is_ok());
        assert!(result.unwrap().contains("fungsi halo"));
    }
}
