//! Test for package management functionality

use kodeon_compiler::{Lexer, Parser, SemanticAnalyzer, IRGenerator};
use kodeon_compiler::module_resolver::ModuleResolver;
use std::fs;
use std::path::PathBuf;
use tempfile::TempDir;

#[test]
fn test_package_import_and_resolution() {
    // Create a temporary directory structure for testing
    let temp_dir = TempDir::new().unwrap();
    let project_root = temp_dir.path().to_path_buf();

    // Create kodeon_modules directory structure
    let package_dir = project_root.join("kodeon_modules").join("math_utils").join("src");
    fs::create_dir_all(&package_dir).unwrap();

    // Create a test package file
    let package_file = package_dir.join("lib.kodeon");
    let package_content = r#"
// Math utilities package
fungsi tambah(a, b):
    kembalikan a + b

fungsi kurang(a, b):
    kembalikan a - b
"#;
    fs::write(&package_file, package_content).unwrap();

    // Create a test main file that imports the package
    let main_file = project_root.join("main.kodeon");
    let main_content = r#"
// Main program importing package
impor "math_utils" sebagai matematika

fungsi utama():
    buat hasil = matematika.tambah(5, 3)
    tampilkan(hasil)
    kembalikan 0
"#;
    fs::write(&main_file, main_content).unwrap();

    // Test the compilation process
    let contents = fs::read_to_string(&main_file).unwrap();

    // Tokenize
    let mut lexer = Lexer::new(&contents);
    let mut tokens = Vec::new();
    loop {
        let token = lexer.next_token().unwrap();
        if token == kodeon_compiler::Token::Eof {
            break;
        }
        tokens.push(token);
    }

    // Parse
    let mut parser = Parser::new(&contents).unwrap();
    let ast = parser.parse_program().unwrap();

    // Semantic analysis
    let mut semantic_analyzer = SemanticAnalyzer::new();
    assert!(semantic_analyzer.analyze(&ast).is_ok());

    // Create module resolver with project root
    let module_resolver = ModuleResolver::with_project_root(project_root);

    // Generate IR
    let mut ir_generator = IRGenerator::with_module_resolver(module_resolver);
    let result = ir_generator.generate_ir(&ast);

    // The IR generation should succeed
    assert!(result.is_ok());

    let ir_module = result.unwrap();

    // Check that the main function was created
    assert!(!ir_module.functions.is_empty());
    assert_eq!(ir_module.functions[0].name, "main");

    println!("Package management test passed successfully!");
}

#[test]
fn test_package_resolution_with_alias() {
    // Create a temporary directory structure for testing
    let temp_dir = TempDir::new().unwrap();
    let project_root = temp_dir.path().to_path_buf();

    // Create kodeon_modules directory structure
    let package_dir = project_root.join("kodeon_modules").join("string_utils");
    fs::create_dir_all(&package_dir).unwrap();

    // Create a test package file in the root (alternative structure)
    let package_file = package_dir.join("main.kodeon");
    let package_content = r#"
// String utilities package
fungsi gabung(a, b):
    kembalikan a + b

fungsi panjang(s):
    kembalikan len(s)
"#;
    fs::write(&package_file, package_content).unwrap();

    // Create module resolver with project root
    let module_resolver = ModuleResolver::with_project_root(project_root);

    // Test direct package resolution
    let result = module_resolver.resolve_module("string_utils");
    assert!(result.is_ok());
    let content = result.unwrap();
    assert!(content.contains("fungsi gabung"));
    assert!(content.contains("fungsi panjang"));

    println!("Package resolution with alias test passed successfully!");
}
