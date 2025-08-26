#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use std::path::PathBuf;
    use tempfile::TempDir;

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
        let mut resolver = ModuleResolver::with_project_root(project_root);

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
        let mut resolver = ModuleResolver::with_project_root(project_root);

        // Test package resolution
        let result = resolver.resolve_module("test_package");
        assert!(result.is_ok());
        assert!(result.unwrap().contains("fungsi halo"));
    }
}
