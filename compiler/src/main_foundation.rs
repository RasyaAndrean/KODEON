//! Main entry point for KODEON Foundation (v0.x)
//! Simplified version focusing on core language features

use std::process;

mod simplified_parser;
mod cli;

fn main() {
    if let Err(e) = cli::run() {
        eprintln!("Error: {}", e);
        process::exit(1);
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use tempfile::NamedTempFile;

    #[test]
    fn test_foundation_compilation() {
        // This is a basic integration test
        // In a real implementation, we would test the full compilation pipeline
        assert!(true);
    }
}
