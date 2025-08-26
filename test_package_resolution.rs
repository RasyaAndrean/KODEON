//! Simple test to verify package resolution functionality

use std::path::PathBuf;
use kodeon_compiler::module_resolver::ModuleResolver;

fn main() {
    // Create module resolver with project root pointing to our example
    let project_root = PathBuf::from("d:\\KODEON\\examples\\packages");
    let resolver = ModuleResolver::with_project_root(project_root);

    // Try to resolve the math_utils package
    match resolver.resolve_module("math_utils") {
        Ok(content) => {
            println!("✅ Successfully resolved math_utils package!");
            println!("Package content length: {} characters", content.len());
            println!("Contains 'fungsi tambah': {}", content.contains("fungsi tambah"));
            println!("Contains 'fungsi kurang': {}", content.contains("fungsi kurang"));
        }
        Err(e) => {
            println!("❌ Failed to resolve math_utils package: {}", e);
        }
    }

    // Try to resolve a non-existent package
    match resolver.resolve_module("nonexistent_package") {
        Ok(_) => {
            println!("❌ Unexpectedly resolved nonexistent package");
        }
        Err(e) => {
            println!("✅ Correctly failed to resolve nonexistent package: {}", e);
        }
    }

    println!("Package resolution test completed!");
}
