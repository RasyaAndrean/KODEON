//! Tests for the extended lexer functionality

use kodeon_compiler::lexer::Lexer;
use kodeon_compiler::Token;

#[test]
fn test_go_language_tokens() {
    let source = "pergi kanal pilih tunda goroutine channel select defer";
    let mut lexer = Lexer::new(source);

    assert_eq!(lexer.next_token().unwrap(), Token::Pergi);
    assert_eq!(lexer.next_token().unwrap(), Token::Kanal);
    assert_eq!(lexer.next_token().unwrap(), Token::Pilih);
    assert_eq!(lexer.next_token().unwrap(), Token::Tunda);
    assert_eq!(lexer.next_token().unwrap(), Token::Goroutine);
    assert_eq!(lexer.next_token().unwrap(), Token::Channel);
    assert_eq!(lexer.next_token().unwrap(), Token::Select);
    assert_eq!(lexer.next_token().unwrap(), Token::DeferEng);
    assert_eq!(lexer.next_token().unwrap(), Token::Eof);
}

#[test]
fn test_rust_language_tokens() {
    let source = "pemilik pinjam sifat keturunan tidakaman owner borrow trait derive unsafe";
    let mut lexer = Lexer::new(source);

    assert_eq!(lexer.next_token().unwrap(), Token::Pemilik);
    assert_eq!(lexer.next_token().unwrap(), Token::Pinjam);
    assert_eq!(lexer.next_token().unwrap(), Token::Sifat);
    assert_eq!(lexer.next_token().unwrap(), Token::Keturunan);
    assert_eq!(lexer.next_token().unwrap(), Token::TidakAman);
    assert_eq!(lexer.next_token().unwrap(), Token::Owner);
    assert_eq!(lexer.next_token().unwrap(), Token::Borrow);
    assert_eq!(lexer.next_token().unwrap(), Token::Trait);
    assert_eq!(lexer.next_token().unwrap(), Token::Derive);
    assert_eq!(lexer.next_token().unwrap(), Token::Unsafe);
    assert_eq!(lexer.next_token().unwrap(), Token::Eof);
}

#[test]
fn test_kotlin_language_tokens() {
    let source = "saat objek data lambat tundakt when object data lazy suspend";
    let mut lexer = Lexer::new(source);

    assert_eq!(lexer.next_token().unwrap(), Token::Saat);
    assert_eq!(lexer.next_token().unwrap(), Token::Objek);
    assert_eq!(lexer.next_token().unwrap(), Token::DataKt);
    assert_eq!(lexer.next_token().unwrap(), Token::Lambat);
    assert_eq!(lexer.next_token().unwrap(), Token::TundaKt);
    assert_eq!(lexer.next_token().unwrap(), Token::WhenKt);
    assert_eq!(lexer.next_token().unwrap(), Token::Object);
    assert_eq!(lexer.next_token().unwrap(), Token::DataKotlin);
    assert_eq!(lexer.next_token().unwrap(), Token::Lazy);
    assert_eq!(lexer.next_token().unwrap(), Token::Suspend);
    assert_eq!(lexer.next_token().unwrap(), Token::Eof);
}

#[test]
fn test_csharp_language_tokens() {
    let source = "gunakan terpaksa segel bacasaja delegasi dinamis varcs func using override sealed readonly delegate dynamic varcsharp func";
    let mut lexer = Lexer::new(source);

    assert_eq!(lexer.next_token().unwrap(), Token::GunakanCs);
    assert_eq!(lexer.next_token().unwrap(), Token::Terpaksa);
    assert_eq!(lexer.next_token().unwrap(), Token::Segel);
    assert_eq!(lexer.next_token().unwrap(), Token::BacaSaja);
    assert_eq!(lexer.next_token().unwrap(), Token::DelegasiCs);
    assert_eq!(lexer.next_token().unwrap(), Token::Dinamis);
    assert_eq!(lexer.next_token().unwrap(), Token::VarCs);
    assert_eq!(lexer.next_token().unwrap(), Token::FungsiCs);
    assert_eq!(lexer.next_token().unwrap(), Token::UsingCs);
    assert_eq!(lexer.next_token().unwrap(), Token::Override);
    assert_eq!(lexer.next_token().unwrap(), Token::Sealed);
    assert_eq!(lexer.next_token().unwrap(), Token::Readonly);
    assert_eq!(lexer.next_token().unwrap(), Token::Delegate);
    assert_eq!(lexer.next_token().unwrap(), Token::Dynamic);
    assert_eq!(lexer.next_token().unwrap(), Token::VarCSharp);
    assert_eq!(lexer.next_token().unwrap(), Token::Func);
    assert_eq!(lexer.next_token().unwrap(), Token::Eof);
}

#[test]
fn test_php_language_tokens() {
    let source = "phpecho phpdie phparray phpforeach sertakan butuhkan echo die array foreach include require";
    let mut lexer = Lexer::new(source);

    assert_eq!(lexer.next_token().unwrap(), Token::PHPEcho);
    assert_eq!(lexer.next_token().unwrap(), Token::PHPDie);
    assert_eq!(lexer.next_token().unwrap(), Token::PHPArray);
    assert_eq!(lexer.next_token().unwrap(), Token::PHPForeach);
    assert_eq!(lexer.next_token().unwrap(), Token::PHPInclude);
    assert_eq!(lexer.next_token().unwrap(), Token::PHPRequire);
    assert_eq!(lexer.next_token().unwrap(), Token::Echo);
    assert_eq!(lexer.next_token().unwrap(), Token::Die);
    assert_eq!(lexer.next_token().unwrap(), Token::ArrayPHP);
    assert_eq!(lexer.next_token().unwrap(), Token::Foreach);
    assert_eq!(lexer.next_token().unwrap(), Token::Include);
    assert_eq!(lexer.next_token().unwrap(), Token::Require);
    assert_eq!(lexer.next_token().unwrap(), Token::Eof);
}

#[test]
fn test_ruby_language_tokens() {
    let source = "rubydef rubyclass rubymodule rubyif rubyunless rubybegin rubyrequire def class module if unless begin require";
    let mut lexer = Lexer::new(source);

    assert_eq!(lexer.next_token().unwrap(), Token::RubyDef);
    assert_eq!(lexer.next_token().unwrap(), Token::RubyClass);
    assert_eq!(lexer.next_token().unwrap(), Token::RubyModule);
    assert_eq!(lexer.next_token().unwrap(), Token::RubyIf);
    assert_eq!(lexer.next_token().unwrap(), Token::RubyUnless);
    assert_eq!(lexer.next_token().unwrap(), Token::RubyBegin);
    assert_eq!(lexer.next_token().unwrap(), Token::RubyRequire);
    assert_eq!(lexer.next_token().unwrap(), Token::Def);
    assert_eq!(lexer.next_token().unwrap(), Token::ClassRuby);
    assert_eq!(lexer.next_token().unwrap(), Token::ModuleRuby);
    assert_eq!(lexer.next_token().unwrap(), Token::IfRuby);
    assert_eq!(lexer.next_token().unwrap(), Token::Unless);
    assert_eq!(lexer.next_token().unwrap(), Token::Begin);
    assert_eq!(lexer.next_token().unwrap(), Token::RequireRuby);
    assert_eq!(lexer.next_token().unwrap(), Token::Eof);
}

#[test]
fn test_sql_language_tokens() {
    let source = "pilih dari dimana gabung masukkan perbarui hapus sqlselect sqlfrom sqlwhere sqljoin sqlinsertinto sqlupdate sqldelete";
    let mut lexer = Lexer::new(source);

    assert_eq!(lexer.next_token().unwrap(), Token::Pilih);
    assert_eq!(lexer.next_token().unwrap(), Token::Dari);
    assert_eq!(lexer.next_token().unwrap(), Token::Dimana);
    assert_eq!(lexer.next_token().unwrap(), Token::Gabung);
    assert_eq!(lexer.next_token().unwrap(), Token::Masukkan);
    assert_eq!(lexer.next_token().unwrap(), Token::Perbarui);
    assert_eq!(lexer.next_token().unwrap(), Token::Hapus);
    assert_eq!(lexer.next_token().unwrap(), Token::SelectSQL);
    assert_eq!(lexer.next_token().unwrap(), Token::From);
    assert_eq!(lexer.next_token().unwrap(), Token::WhereSQL);
    assert_eq!(lexer.next_token().unwrap(), Token::JoinSQL);
    assert_eq!(lexer.next_token().unwrap(), Token::InsertInto);
    assert_eq!(lexer.next_token().unwrap(), Token::UpdateSQL);
    assert_eq!(lexer.next_token().unwrap(), Token::DeleteSQL);
    assert_eq!(lexer.next_token().unwrap(), Token::Eof);
}

#[test]
fn test_r_language_tokens() {
    let source = "fungsi jika untuk selama pustaka data vektor bingkai_data function if for while library data vector dataframe";
    let mut lexer = Lexer::new(source);

    assert_eq!(lexer.next_token().unwrap(), Token::Fungsi);
    assert_eq!(lexer.next_token().unwrap(), Token::Jika);
    assert_eq!(lexer.next_token().unwrap(), Token::Untuk);
    assert_eq!(lexer.next_token().unwrap(), Token::Selama);
    assert_eq!(lexer.next_token().unwrap(), Token::Pustaka);
    assert_eq!(lexer.next_token().unwrap(), Token::Data);
    assert_eq!(lexer.next_token().unwrap(), Token::Vektor);
    assert_eq!(lexer.next_token().unwrap(), Token::BingkaiData);
    assert_eq!(lexer.next_token().unwrap(), Token::FunctionR);
    assert_eq!(lexer.next_token().unwrap(), Token::IfR);
    assert_eq!(lexer.next_token().unwrap(), Token::ForR);
    assert_eq!(lexer.next_token().unwrap(), Token::WhileR);
    assert_eq!(lexer.next_token().unwrap(), Token::Library);
    assert_eq!(lexer.next_token().unwrap(), Token::DataR);
    assert_eq!(lexer.next_token().unwrap(), Token::Vector);
    assert_eq!(lexer.next_token().unwrap(), Token::DataFrame);
    assert_eq!(lexer.next_token().unwrap(), Token::Eof);
}

#[test]
fn test_combined_extended_tokens() {
    let source = "
        pergi fungsi penghitung(kanal hasil) {
            tunda cetak('selesai')
        }

        sifat Tampil {
            fungsi tampilkan(diri)
        }

        data kelas Pengguna {
            buat nama?
        }

        gunakan pustaka statistik

        pilih * dari pengguna dimana umur > 18
    ";

    let mut lexer = Lexer::new(source);
    let mut tokens = Vec::new();

    loop {
        let token = lexer.next_token().unwrap();
        if token == Token::Eof {
            break;
        }
        tokens.push(token);
    }

    // Verify that we can tokenize the extended syntax
    assert!(tokens.len() > 10);
    // The test passes if no lexer errors occur
}
