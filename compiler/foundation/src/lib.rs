//! KODEON Foundation Library (v0.x)
//! Core library for the foundation version of KODEON

pub mod simplified_parser;
pub mod cli;

pub use simplified_parser::*;
pub use cli::*;

/// Version information for the KODEON Foundation
pub const VERSION: &str = "0.1.0";
pub const NAME: &str = "KODEON Foundation";

/// Foundation feature set
pub mod features {
    /// Core language features available in foundation version
    pub const CORE_FEATURES: &[&str] = &[
        "Variables and assignment",
        "Functions and function calls",
        "Conditional statements (if/else)",
        "Loops (while, for)",
        "Input/output operations",
        "Basic expressions and operators",
        "Python transpilation",
        "JavaScript transpilation",
    ];

    /// Supported targets
    pub const SUPPORTED_TARGETS: &[&str] = &[
        "python",
        "javascript",
        "execute",
    ];
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_version_info() {
        assert!(!VERSION.is_empty());
        assert!(!NAME.is_empty());
    }

    #[test]
    fn test_features_list() {
        assert!(!features::CORE_FEATURES.is_empty());
        assert!(!features::SUPPORTED_TARGETS.is_empty());
    }
}
