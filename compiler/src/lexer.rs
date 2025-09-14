//! Lexer for the KODEON programming language

use std::str::Chars;
use std::iter::Peekable;

/// Position in the source code with enhanced error tracking
#[derive(Debug, Clone, PartialEq)]
pub struct Position {
    pub line: usize,
    pub column: usize,
    pub offset: usize, // Character offset from start of file
}

impl Position {
    /// Create a new position
    pub fn new(line: usize, column: usize, offset: usize) -> Self {
        Position { line, column, offset }
    }

    /// Create a position at the start of the file
    pub fn start() -> Self {
        Position::new(1, 1, 0)
    }

    /// Advance position by one character
    pub fn advance(&mut self, ch: char) {
        self.offset += 1;
        if ch == '\n' {
            self.line += 1;
            self.column = 1;
        } else {
            self.column += 1;
        }
    }

    /// Advance position by multiple characters
    pub fn advance_str(&mut self, s: &str) {
        for ch in s.chars() {
            self.advance(ch);
        }
    }
}

/// Enhanced token with position information for better error reporting
#[derive(Debug, PartialEq, Clone)]
pub struct TokenWithPosition {
    pub token: Token,
    pub position: Position,
    pub length: usize, // Length of the token in characters
}

/// Token types for the KODEON language
#[derive(Debug, PartialEq, Clone)]
pub enum Token {
    // Keywords - Indonesian
    Buat,           // create
    Jika,           // if
    Maka,           // then
    Sebaliknya,     // otherwise
    Fungsi,         // function
    Kelas,          // class
    Kembalikan,     // return
    Ulangi,         // repeat
    Selama,         // while
    Untuk,          // for
    Di,             // in
    Dari,           // from
    Sampai,         // to
    Lakukan,        // do
    Variabel,       // variable
    Konstan,        // constant
    Struktur,       // struct
    Impor,          // import
    DariModul,      // from module
    Sebagai,        // as
    Coba,           // try
    Tangkap,        // catch
    Akhirnya,       // finally
    Lempar,         // throw
    Benar,          // true
    Salah,          // false
    Null,           // null
    Baru,           // new
    Ini,            // this
    Super,          // super
    Publik,         // public
    Pribadi,        // private
    Terlindungi,    // protected
    Statis,         // static
    Abstrak,        // abstract
    Akhir,          // final
    Sinkron,        // synchronized
    Asal,           // assert
    Pecah,          // break
    Lanjut,         // continue
    LakukanSementara, // do-while
    UntukSetiap,    // for-each
    PergiKe,        // goto
    Implementasi,   // implements
    Antarmuka,      // interface
    Asli,           // native
    Paket,          // package
    Ketika,         // when (pattern matching)
    Biarkan,        // let (immutable binding)
    Mut,            // mut (mutable binding)
    Ref,            // ref (reference)
    Ptr,            // ptr (pointer)
    UkuranDari,     // sizeof
    Tipe,           // type
    Alias,          // alias
    Ekstensi,       // extension
    Operator,       // operator
    Templat,        // template
    Menggunakan,    // using
    Teman,          // friend
    Virtual,        // virtual
    Konst,          // const
    Volatil,        // volatile
    Daftar,         // list
    Peta,           // map
    Himpunan,       // set
    Opsional,       // optional
    Hasil,          // result
    Tunggu,         // await
    Async,          // async
    Hasilkan,       // yield
    Rentang,        // range
    Saring,         // filter
    Petakan,        // map (functional)
    Kurangi,        // reduce
    Lipat,          // fold
    Ambil,          // take
    Lompati,        // skip
    Gabungkan,      // join
    Urutkan,        // sort
    Balik,          // reverse
    Panjang,        // length/len

    // Concurrency Keywords - Indonesian
    Jalan,          // go (goroutine)
    BuatChannel,    // make_channel
    Kirim,          // send (channel send)
    Terima,         // receive (channel receive)
    KunciMutex,     // lock_mutex
    BukaKunciMutex, // unlock_mutex
    BuatKondisi,    // create_condition
    TungguKondisi,  // wait_condition
    SinyalKondisi,  // signal_condition
    SiarkanKondisi, // broadcast_condition
    MuatAtomik,     // atomic_load
    SimpanAtomik,   // atomic_store
    BuatAlamat,     // create_address (atomic address)

    // Concurrency Keywords - English
    Go,             // go (goroutine)
    MakeChannel,    // make_channel
    Send,           // send (channel send)
    Receive,        // receive (channel receive)
    LockMutex,      // lock_mutex
    UnlockMutex,    // unlock_mutex
    CreateCondition,// create_condition
    WaitCondition,  // wait_condition
    SignalCondition,// signal_condition
    BroadcastCondition, // broadcast_condition
    AtomicLoad,     // atomic_load
    AtomicStore,    // atomic_store
    CreateAddress,  // create_address (atomic address)

    // Domain-Specific Keywords for Universal Use
    // Web Development
    Html,           // html
    Css,            // css
    Script,         // script
    Endpoint,       // endpoint
    Route,          // route
    Middleware,     // middleware

    // Data Science & AI
    Model,          // model
    Train,          // train
    Predict,        // predict
    Dataset,        // dataset
    Visualize,      // visualize

    // Game Development
    Scene,          // scene
    Sprite,         // sprite
    Animate,        // animate
    Collide,        // collide

    // IoT & Embedded
    Sensor,         // sensor
    Actuator,       // actuator
    Pin,            // pin
    Read,           // read
    Write,          // write

    // Automation & Scripting
    Task,           // task
    Schedule,       // schedule
    Trigger,        // trigger
    Workflow,       // workflow

    // Creative Coding Keywords
    Canvas,         // canvas
    Draw,           // draw
    Color,          // color
    Shape,          // shape
    Animation,      // animation
    Frame,          // frame
    Sound,          // sound
    Music,          // music
    Art,            // art
    Design,         // design
    Creative,       // creative
    Express,        // express
    Imagine,        // imagine
    Dream,          // dream

    // Creative Coding Keywords - Indonesian
    Kanvas,         // canvas
    Gambar,         // draw
    Warna,          // color
    Bentuk,         // shape
    Animasi,        // animation
    Bingkai,        // frame
    Suara,          // sound
    Musik,          // music
    Seni,           // art
    Desain,         // design
    Kreatif,        // creative
    Ekspresi,       // express
    Bayangkan,      // imagine
    Mimpi,          // dream

    // Quantum Computing Keywords - Indonesian
    Kubit,          // qubit
    Gerbang,        // gate
    Sirkuit,        // circuit
    Ukur,           // measure
    Superposisi,    // superposition
    Keterkaitan,    // entanglement
    Simulasi,       // simulate

    // Quantum Computing Keywords - English
    Qubit,          // qubit
    Gate,           // gate
    Circuit,        // circuit
    Measure,        // measure
    Superposition,  // superposition
    Entanglement,   // entanglement
    Simulate,       // simulate

    // Neural Network Keywords - Indonesian
    Jaringan,       // network
    Lapisan,        // layer
    Tensor,         // tensor
    Model,          // model
    Latih,          // train
    Prediksi,       // predict
    Optimisasi,     // optimize
    FungsiHilang,   // loss_function
    Gradien,        // gradient

    // Neural Network Keywords - English
    Network,        // network
    Layer,          // layer
    TensorEng,      // tensor
    ModelEng,       // model
    Train,          // train
    Predict,        // predict
    Optimize,       // optimize
    LossFunction,   // loss_function
    Gradient,       // gradient

    // Keywords - English
    Create,         // create
    If,             // if
    Then,           // then
    Otherwise,      // otherwise
    Function,       // function
    Class,          // class
    Return,         // return
    Repeat,         // repeat
    While,          // while
    For,            // for
    In,             // in
    From,           // from
    To,             // to
    Do,             // do
    Variable,       // variable
    Constant,       // constant
    Struct,         // struct
    Import,         // import
    FromModule,     // from module
    As,             // as
    Try,            // try
    Catch,          // catch
    Finally,        // finally
    Throw,          // throw
    True,           // true
    False,          // false
    NullEng,        // null
    New,            // new
    This,           // this
    SuperEng,       // super
    Public,         // public
    Private,        // private
    Protected,      // protected
    Static,         // static
    Abstract,       // abstract
    Final,          // final
    Synchronized,   // synchronized
    Assert,         // assert
    Break,          // break
    Continue,       // continue
    DoWhile,        // do-while
    ForEach,        // for-each
    Goto,           // goto
    Implements,     // implements
    Interface,      // interface
    Native,         // native
    Package,        // package
    When,           // when (pattern matching)
    Let,            // let (immutable binding)
    MutEng,         // mut (mutable binding)
    RefEng,         // ref (reference)
    PtrEng,         // ptr (pointer)
    Sizeof,         // sizeof
    TypeEng,        // type
    AliasEng,       // alias
    Extension,      // extension
    OperatorEng,    // operator
    Template,       // template
    Using,          // using
    Friend,         // friend
    VirtualEng,     // virtual
    Const,          // const
    Volatile,       // volatile
    List,           // list
    Map,            // map
    Set,            // set
    Optional,       // optional
    Result,         // result
    Await,          // await
    AsyncEng,       // async
    Yield,          // yield
    Range,          // range
    Filter,         // filter
    MapFunc,        // map (functional)
    Reduce,         // reduce
    Fold,           // fold
    Take,           // take
    Skip,           // skip
    Join,           // join
    Sort,           // sort
    Reverse,        // reverse
    Length,         // length/len

    // Domain-Specific Keywords for Universal Use
    // Web Development
    HtmlEng,        // html
    CssEng,         // css
    ScriptEng,      // script
    EndpointEng,    // endpoint
    RouteEng,       // route
    MiddlewareEng,  // middleware

    // Data Science & AI
    ModelEng,       // model
    TrainEng,       // train
    PredictEng,     // predict
    DatasetEng,     // dataset
    VisualizeEng,   // visualize

    // Game Development
    SceneEng,       // scene
    SpriteEng,      // sprite
    AnimateEng,     // animate
    CollideEng,     // collide

    // IoT & Embedded
    SensorEng,      // sensor
    ActuatorEng,    // actuator
    PinEng,         // pin
    ReadEng,        // read
    WriteEng,       // write

    // Automation & Scripting
    TaskEng,        // task
    ScheduleEng,    // schedule
    TriggerEng,     // trigger
    WorkflowEng,    // workflow

    // Creative Coding Keywords
    CanvasEng,      // canvas
    DrawEng,        // draw
    ColorEng,       // color
    ShapeEng,       // shape
    AnimationEng,   // animation
    FrameEng,       // frame
    SoundEng,       // sound
    MusicEng,       // music
    ArtEng,         // art
    DesignEng,      // design
    CreativeEng,    // creative
    ExpressEng,     // express
    ImagineEng,     // imagine
    DreamEng,       // dream

    // Literals
    Identifier(String),
    Number(f64),
    String(String),
    Boolean(bool),

    // Operators
    Plus,           // +
    Minus,          // -
    Multiply,       // *
    Divide,         // /
    Modulo,         // %
    Power,          // **
    Assign,         // =
    Equal,          // ==
    NotEqual,       // !=
    Less,           // <
    Greater,        // >
    LessEqual,      // <=
    GreaterEqual,   // >=
    And,            // and / dan
    Or,             // or / atau
    Not,            // not / tidak
    Increment,      // ++
    Decrement,      // --
    BitAnd,         // &
    BitOr,          // |
    BitXor,         // ^
    BitNot,         // ~
    LeftShift,      // <<
    RightShift,     // >>
    Arrow,          // ->
    FatArrow,       // =>
    DotDot,         // ..
    DotDotDot,      // ...
    At,             // @
    Hash,           // #
    Dollar,         // $
    Question,       // ?
    Bang,           // !
    Tilde,          // ~
    Backtick,       // `

    // Delimiters
    LeftParen,      // (
    RightParen,     // )
    LeftBrace,      // {
    RightBrace,     // }
    LeftBracket,    // [
    RightBracket,   // ]
    Comma,          // ,
    Dot,            // .
    Colon,          // :
    Semicolon,      // ;
    Backslash,      // \
    Pipe,           // |
    Ampersand,      // &

    // Comments
    LineComment(String),
    BlockComment(String),

    // Special
    Newline,
    Indent,
    Dedent,
    Eof,
}

/// Lexer error with position information
#[derive(Debug)]
pub enum LexerError {
    InvalidCharacter(char, Position),
    UnterminatedString(Position),
    UnterminatedComment(Position),
}

impl std::fmt::Display for LexerError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match self {
            LexerError::InvalidCharacter(ch, pos) => {
                write!(f, "Invalid character '{}' at line {}, column {}", ch, pos.line, pos.column)
            }
            LexerError::UnterminatedString(pos) => {
                write!(f, "Unterminated string at line {}, column {}", pos.line, pos.column)
            }
            LexerError::UnterminatedComment(pos) => {
                write!(f, "Unterminated comment at line {}, column {}", pos.line, pos.column)
            }
        }
    }
}

impl std::error::Error for LexerError {}

/// Lexer for KODEON source code
pub struct Lexer<'a> {
    chars: Peekable<Chars<'a>>,
    current_indent: usize,
    indent_stack: Vec<usize>,
    line: usize,
    column: usize,
    input: &'a str,
}

impl<'a> Lexer<'a> {
    /// Create a new lexer for the given input
    pub fn new(input: &'a str) -> Self {
        Lexer {
            chars: input.chars().peekable(),
            current_indent: 0,
            indent_stack: Vec::new(),
            line: 1,
            column: 1,
            input,
        }
    }

    /// Get the current position
    fn current_position(&self) -> Position {
        Position {
            line: self.line,
            column: self.column,
        }
    }

    /// Advance the position counter
    fn advance_position(&mut self, ch: char) {
        if ch == '\n' {
            self.line += 1;
            self.column = 1;
        } else {
            self.column += 1;
        }
    }

    /// Get the next token from the input
    pub fn next_token(&mut self) -> Result<Token, LexerError> {
        // Skip whitespace (but track indentation)
        self.skip_whitespace()?;

        // Check for EOF
        match self.chars.peek() {
            None => return Ok(Token::Eof),
            _ => {}
        }

        // Check for comments
        if let Some(&'/') = self.chars.peek() {
            let mut peekable = self.chars.clone();
            peekable.next(); // consume first '/'
            if let Some(&'/') = peekable.peek() {
                return self.read_line_comment();
            } else if let Some(&'*') = peekable.peek() {
                return self.read_block_comment();
            }
        }

        let position = self.current_position();

        // Check for single character tokens
        match self.chars.peek() {
            Some(&'+') => {
                self.chars.next();
                self.advance_position('+');
                if let Some(&'+') = self.chars.peek() {
                    self.chars.next();
                    self.advance_position('+');
                    return Ok(Token::Increment);
                }
                return Ok(Token::Plus);
            }
            Some(&'-') => {
                self.chars.next();
                self.advance_position('-');
                if let Some(&'-') = self.chars.peek() {
                    self.chars.next();
                    self.advance_position('-');
                    return Ok(Token::Decrement);
                }
                return Ok(Token::Minus);
            }
            Some(&'*') => {
                self.chars.next();
                self.advance_position('*');
                if let Some(&'*') = self.chars.peek() {
                    self.chars.next();
                    self.advance_position('*');
                    return Ok(Token::Power);
                }
                return Ok(Token::Multiply);
            }
            Some(&'/') => {
                self.chars.next();
                self.advance_position('/');
                return Ok(Token::Divide);
            }
            Some(&'%') => {
                self.chars.next();
                self.advance_position('%');
                return Ok(Token::Modulo);
            }
            Some(&'=') => {
                self.chars.next();
                self.advance_position('=');
                if let Some(&'=') = self.chars.peek() {
                    self.chars.next();
                    self.advance_position('=');
                    return Ok(Token::Equal);
                }
                return Ok(Token::Assign);
            }
            Some(&'!') => {
                self.chars.next();
                self.advance_position('!');
                if let Some(&'=') = self.chars.peek() {
                    self.chars.next();
                    self.advance_position('=');
                    return Ok(Token::NotEqual);
                }
                // Standalone '!' for negation
                return Ok(Token::Not);
            }
            Some(&'<') => {
                self.chars.next();
                self.advance_position('<');
                if let Some(&'=') = self.chars.peek() {
                    self.chars.next();
                    self.advance_position('=');
                    return Ok(Token::LessEqual);
                }
                return Ok(Token::Less);
            }
            Some(&'>') => {
                self.chars.next();
                self.advance_position('>');
                if let Some(&'=') = self.chars.peek() {
                    self.chars.next();
                    self.advance_position('=');
                    return Ok(Token::GreaterEqual);
                }
                return Ok(Token::Greater);
            }
            Some(&'(') => {
                self.chars.next();
                self.advance_position('(');
                return Ok(Token::LeftParen);
            }
            Some(&')') => {
                self.chars.next();
                self.advance_position(')');
                return Ok(Token::RightParen);
            }
            Some(&'{') => {
                self.chars.next();
                self.advance_position('{');
                return Ok(Token::LeftBrace);
            }
            Some(&'}') => {
                self.chars.next();
                self.advance_position('}');
                return Ok(Token::RightBrace);
            }
            Some(&'[') => {
                self.chars.next();
                self.advance_position('[');
                return Ok(Token::LeftBracket);
            }
            Some(&']') => {
                self.chars.next();
                self.advance_position(']');
                return Ok(Token::RightBracket);
            }
            Some(&',') => {
                self.chars.next();
                self.advance_position(',');
                return Ok(Token::Comma);
            }
            Some(&'.') => {
                self.chars.next();
                self.advance_position('.');
                return Ok(Token::Dot);
            }
            Some(&':') => {
                self.chars.next();
                self.advance_position(':');
                return Ok(Token::Colon);
            }
            Some(&';') => {
                self.chars.next();
                self.advance_position(';');
                return Ok(Token::Semicolon);
            }
            Some(&'\\') => {
                self.chars.next();
                self.advance_position('\\');
                return Ok(Token::Backslash);
            }
            Some(&'"') => {
                return self.read_string();
            }
            Some(&'0'..=&'9') => {
                return self.read_number();
            }
            Some(&'a'..=&'z') | Some(&'A'..=&'Z') | Some(&'_') => {
                return self.read_identifier();
            }
            Some(&'\n') => {
                self.chars.next();
                self.advance_position('\n');
                return Ok(Token::Newline);
            }
            Some(c) => {
                let pos = self.current_position();
                self.chars.next();
                self.advance_position(*c);
                return Err(LexerError::InvalidCharacter(*c, pos));
            }
            None => {
                return Ok(Token::Eof);
            }
        }

        Ok(Token::Eof)
    }

    /// Skip whitespace characters, tracking indentation
    fn skip_whitespace(&mut self) -> Result<(), LexerError> {
        while let Some(&ch) = self.chars.peek() {
            match ch {
                ' ' | '\t' => {
                    self.chars.next();
                    self.advance_position(ch);
                }
                _ => break,
            }
        }
        Ok(())
    }

    /// Read a string literal
    fn read_string(&mut self) -> Result<Token, LexerError> {
        let start_pos = self.current_position();

        // Skip opening quote
        self.chars.next();
        self.advance_position('"');

        let mut result = String::new();

        while let Some(&ch) = self.chars.peek() {
            match ch {
                '"' => {
                    // Skip closing quote
                    self.chars.next();
                    self.advance_position('"');
                    return Ok(Token::String(result));
                }
                '\n' => {
                    return Err(LexerError::UnterminatedString(start_pos));
                }
                '\\' => {
                    // Handle escape sequences
                    self.chars.next(); // consume backslash
                    self.advance_position('\\');
                    if let Some(&escaped) = self.chars.peek() {
                        self.chars.next(); // consume escaped character
                        self.advance_position(escaped);
                        match escaped {
                            'n' => result.push('\n'),
                            't' => result.push('\t'),
                            'r' => result.push('\r'),
                            '"' => result.push('"'),
                            '\\' => result.push('\\'),
                            _ => result.push(escaped),
                        }
                    }
                }
                _ => {
                    self.chars.next();
                    self.advance_position(ch);
                    result.push(ch);
                }
            }
        }

        Err(LexerError::UnterminatedString(start_pos))
    }

    /// Read a line comment
    fn read_line_comment(&mut self) -> Result<Token, LexerError> {
        // Skip "//"
        self.chars.next();
        self.advance_position('/');
        self.chars.next();
        self.advance_position('/');

        let mut result = String::new();

        while let Some(&ch) = self.chars.peek() {
            if ch == '\n' {
                break;
            }
            self.chars.next();
            self.advance_position(ch);
            result.push(ch);
        }

        Ok(Token::LineComment(result))
    }

    /// Read a block comment
    fn read_block_comment(&mut self) -> Result<Token, LexerError> {
        let start_pos = self.current_position();

        // Skip "/*"
        self.chars.next();
        self.advance_position('/');
        self.chars.next();
        self.advance_position('*');

        let mut result = String::new();
        let mut prev_char = '\0';

        while let Some(&ch) = self.chars.peek() {
            if prev_char == '*' && ch == '/' {
                // Skip "*/"
                self.chars.next();
                self.advance_position('*');
                self.chars.next();
                self.advance_position('/');
                // Remove the '*' from the result
                if !result.is_empty() {
                    result.pop();
                }
                break;
            }
            self.chars.next();
            self.advance_position(ch);
            result.push(ch);
            prev_char = ch;
        }

        if !(prev_char == '*' && self.chars.peek() == Some(&'/')) && !result.is_empty() {
            return Err(LexerError::UnterminatedComment(start_pos));
        }

        Ok(Token::BlockComment(result))
    }

    /// Read a number literal
    fn read_number(&mut self) -> Result<Token, LexerError> {
        let mut result = String::new();

        while let Some(&ch) = self.chars.peek() {
            match ch {
                '0'..='9' | '.' => {
                    self.chars.next();
                    self.advance_position(ch);
                    result.push(ch);
                }
                _ => break,
            }
        }

        match result.parse::<f64>() {
            Ok(num) => Ok(Token::Number(num)),
            Err(_) => {
                let pos = self.current_position();
                Err(LexerError::InvalidCharacter(result.chars().next().unwrap_or('0'), pos))
            }
        }
    }

    /// Read an identifier or keyword
    fn read_identifier(&mut self) -> Result<Token, LexerError> {
        let mut result = String::new();

        while let Some(&ch) = self.chars.peek() {
            match ch {
                'a'..='z' | 'A'..='Z' | '0'..='9' | '_' => {
                    self.chars.next();
                    self.advance_position(ch);
                    result.push(ch);
                }
                _ => break,
            }
        }

        // Check if it's a keyword
        match result.as_str() {
            // Indonesian keywords
            "buat" => Ok(Token::Buat),
            "jika" => Ok(Token::Jika),
            "maka" => Ok(Token::Maka),
            "sebaliknya" => Ok(Token::Sebaliknya),
            "fungsi" => Ok(Token::Fungsi),
            "kelas" => Ok(Token::Kelas),
            "kembalikan" => Ok(Token::Kembalikan),
            "ulangi" => Ok(Token::Ulangi),
            "selama" => Ok(Token::Selama),
            "untuk" => Ok(Token::Untuk),
            "di" => Ok(Token::Di),
            "dari" => Ok(Token::Dari),
            "sampai" => Ok(Token::Sampai),
            "lakukan" => Ok(Token::Lakukan),
            "variabel" => Ok(Token::Variabel),
            "konstan" => Ok(Token::Konstan),
            "struktur" => Ok(Token::Struktur),
            "impor" => Ok(Token::Impor),
            "sebagai" => Ok(Token::Sebagai),
            "coba" => Ok(Token::Coba),
            "tangkap" => Ok(Token::Tangkap),
            "akhirnya" => Ok(Token::Akhirnya),
            "lempar" => Ok(Token::Lempar),
            "benar" => Ok(Token::Boolean(true)),
            "salah" => Ok(Token::Boolean(false)),
            "null" => Ok(Token::Null),
            "baru" => Ok(Token::Baru),
            "ini" => Ok(Token::Ini),
            "super" => Ok(Token::Super),
            "dan" => Ok(Token::And),
            "atau" => Ok(Token::Or),
            "tidak" => Ok(Token::Not),
            "publik" => Ok(Token::Publik),
            "pribadi" => Ok(Token::Pribadi),
            "terlindungi" => Ok(Token::Terlindungi),
            "statis" => Ok(Token::Statis),
            "abstrak" => Ok(Token::Abstrak),
            "akhir" => Ok(Token::Akhir),
            "sinkron" => Ok(Token::Sinkron),
            "asal" => Ok(Token::Asal),
            "pecah" => Ok(Token::Pecah),
            "lanjut" => Ok(Token::Lanjut),
            "lakukans" => Ok(Token::LakukanSementara),
            "untuksetiap" => Ok(Token::UntukSetiap),
            "pergike" => Ok(Token::PergiKe),
            "implementasi" => Ok(Token::Implementasi),
            "antarmuka" => Ok(Token::Antarmuka),
            "asli" => Ok(Token::Asli),
            "paket" => Ok(Token::Paket),
            "ketika" => Ok(Token::Ketika),
            "biarkan" => Ok(Token::Biarkan),
            "mut" => Ok(Token::Mut),
            "ref" => Ok(Token::Ref),
            "ptr" => Ok(Token::Ptr),
            "ukurandari" => Ok(Token::UkuranDari),
            "tipe" => Ok(Token::Tipe),
            "alias" => Ok(Token::Alias),
            "ekstensi" => Ok(Token::Ekstensi),
            "operator" => Ok(Token::Operator),
            "templat" => Ok(Token::Templat),
            "menggunakan" => Ok(Token::Menggunakan),
            "teman" => Ok(Token::Teman),
            "virtual" => Ok(Token::Virtual),
            "konst" => Ok(Token::Konst),
            "volatil" => Ok(Token::Volatile),
            "daftar" => Ok(Token::Daftar),
            "peta" => Ok(Token::Peta),
            "himpunan" => Ok(Token::Himpunan),
            "opsional" => Ok(Token::Opsional),
            "hasil" => Ok(Token::Hasil),
            "tunggu" => Ok(Token::Tunggu),
            "async" => Ok(Token::Async),
            "hasilkan" => Ok(Token::Hasilkan),
            "rentang" => Ok(Token::Rentang),
            "saring" => Ok(Token::Saring),
            "petakan" => Ok(Token::Petakan),
            "kurangi" => Ok(Token::Kurangi),
            "lipat" => Ok(Token::Lipat),
            "ambil" => Ok(Token::Ambil),
            "lompati" => Ok(Token::Lompati),
            "gabungkan" => Ok(Token::Gabungkan),
            "urutkan" => Ok(Token::Urutkan),
            "balik" => Ok(Token::Balik),
            "panjang" => Ok(Token::Panjang),

            // Quantum Computing Keywords - Indonesian
            "kubit" => Ok(Token::Kubit),
            "gerbang" => Ok(Token::Gerbang),
            "sirkuit" => Ok(Token::Sirkuit),
            "ukur" => Ok(Token::Ukur),
            "superposisi" => Ok(Token::Superposisi),
            "keterkaitan" => Ok(Token::Keterkaitan),
            "simulasi" => Ok(Token::Simulasi),

            // Neural Network Keywords - Indonesian
            "jaringan" => Ok(Token::Jaringan),
            "lapisan" => Ok(Token::Lapisan),
            "tensor" => Ok(Token::Tensor),
            "model" => Ok(Token::Model),
            "latih" => Ok(Token::Latih),
            "prediksi" => Ok(Token::Prediksi),
            "optimisasi" => Ok(Token::Optimisasi),
            "fungsi_hilang" => Ok(Token::FungsiHilang),
            "gradien" => Ok(Token::Gradien),

            // Neural Network Keywords - English
            "network" => Ok(Token::Network),
            "layer" => Ok(Token::Layer),
            "tensor" => Ok(Token::TensorEng),
            "model" => Ok(Token::ModelEng),
            "train" => Ok(Token::Train),
            "predict" => Ok(Token::Predict),
            "optimize" => Ok(Token::Optimize),
            "loss_function" => Ok(Token::LossFunction),
            "gradient" => Ok(Token::Gradient),

            // Concurrency keywords - English
            "go" => Ok(Token::Go),
            "make_channel" => Ok(Token::MakeChannel),
            "send" => Ok(Token::Send),
            "receive" => Ok(Token::Receive),
            "lock_mutex" => Ok(Token::LockMutex),
            "unlock_mutex" => Ok(Token::UnlockMutex),
            "create_condition" => Ok(Token::CreateCondition),
            "wait_condition" => Ok(Token::WaitCondition),
            "signal_condition" => Ok(Token::SignalCondition),
            "broadcast_condition" => Ok(Token::BroadcastCondition),
            "atomic_load" => Ok(Token::AtomicLoad),
            "atomic_store" => Ok(Token::AtomicStore),
            "create_address" => Ok(Token::CreateAddress),

            // English keywords
            "create" => Ok(Token::Create),
            "if" => Ok(Token::If),
            "then" => Ok(Token::Then),
            "otherwise" => Ok(Token::Otherwise),
            "function" => Ok(Token::Function),
            "class" => Ok(Token::Class),
            "return" => Ok(Token::Return),
            "repeat" => Ok(Token::Repeat),
            "while" => Ok(Token::While),
            "for" => Ok(Token::For),
            "in" => Ok(Token::In),
            "from" => Ok(Token::From),
            "to" => Ok(Token::To),
            "do" => Ok(Token::Do),
            "variable" => Ok(Token::Variable),
            "constant" => Ok(Token::Constant),
            "struct" => Ok(Token::Struct),
            "import" => Ok(Token::Import),
            "as" => Ok(Token::As),
            "try" => Ok(Token::Try),
            "catch" => Ok(Token::Catch),
            "finally" => Ok(Token::Finally),
            "throw" => Ok(Token::Throw),
            "true" => Ok(Token::Boolean(true)),
            "false" => Ok(Token::Boolean(false)),
            "null" => Ok(Token::NullEng),
            "new" => Ok(Token::New),
            "this" => Ok(Token::This),
            "super" => Ok(Token::SuperEng),
            "public" => Ok(Token::Public),
            "private" => Ok(Token::Private),
            "protected" => Ok(Token::Protected),
            "static" => Ok(Token::Static),
            "abstract" => Ok(Token::Abstract),
            "final" => Ok(Token::Final),
            "synchronized" => Ok(Token::Synchronized),
            "assert" => Ok(Token::Assert),
            "break" => Ok(Token::Break),
            "continue" => Ok(Token::Continue),
            "do-while" => Ok(Token::DoWhile),
            "for-each" => Ok(Token::ForEach),
            "goto" => Ok(Token::Goto),
            "implements" => Ok(Token::Implements),
            "interface" => Ok(Token::Interface),
            "native" => Ok(Token::Native),
            "package" => Ok(Token::Package),
            "when" => Ok(Token::When),
            "let" => Ok(Token::Let),
            "mut" => Ok(Token::MutEng),
            "ref" => Ok(Token::RefEng),
            "ptr" => Ok(Token::PtrEng),
            "sizeof" => Ok(Token::Sizeof),
            "type" => Ok(Token::TypeEng),
            "alias" => Ok(Token::AliasEng),
            "extension" => Ok(Token::Extension),
            "operator" => Ok(Token::OperatorEng),
            "template" => Ok(Token::Template),
            "using" => Ok(Token::Using),
            "friend" => Ok(Token::Friend),
            "virtual" => Ok(Token::VirtualEng),
            "const" => Ok(Token::Const),
            "volatile" => Ok(Token::Volatile),
            "list" => Ok(Token::List),
            "map" => Ok(Token::Map),
            "set" => Ok(Token::Set),
            "optional" => Ok(Token::Optional),
            "result" => Ok(Token::Result),
            "await" => Ok(Token::Await),
            "async" => Ok(Token::AsyncEng),
            "yield" => Ok(Token::Yield),
            "range" => Ok(Token::Range),
            "filter" => Ok(Token::Filter),
            "map" => Ok(Token::MapFunc),
            "reduce" => Ok(Token::Reduce),
            "fold" => Ok(Token::Fold),
            "take" => Ok(Token::Take),
            "skip" => Ok(Token::Skip),
            "join" => Ok(Token::Join),
            "sort" => Ok(Token::Sort),
            "reverse" => Ok(Token::Reverse),
            "length" => Ok(Token::Length),

            // Quantum Computing Keywords - English
            "qubit" => Ok(Token::Qubit),
            "gate" => Ok(Token::Gate),
            "circuit" => Ok(Token::Circuit),
            "measure" => Ok(Token::Measure),
            "superposition" => Ok(Token::Superposition),
            "entanglement" => Ok(Token::Entanglement),
            "simulate" => Ok(Token::Simulate),

            // Concurrency keywords - English
            "go" => Ok(Token::Go),
            "make_channel" => Ok(Token::MakeChannel),
            "send" => Ok(Token::Send),
            "receive" => Ok(Token::Receive),
            "lock_mutex" => Ok(Token::LockMutex),
            "unlock_mutex" => Ok(Token::UnlockMutex),
            "create_condition" => Ok(Token::CreateCondition),
            "wait_condition" => Ok(Token::WaitCondition),
            "signal_condition" => Ok(Token::SignalCondition),
            "broadcast_condition" => Ok(Token::BroadcastCondition),
            "atomic_load" => Ok(Token::AtomicLoad),
            "atomic_store" => Ok(Token::AtomicStore),
            "create_address" => Ok(Token::CreateAddress),

            // Not a keyword, it's an identifier
            _ => Ok(Token::Identifier(result)),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_simple_tokens() {
        let input = "+ - * / = == != < > <= >=";
        let mut lexer = Lexer::new(input);

        assert_eq!(lexer.next_token().unwrap(), Token::Plus);
        assert_eq!(lexer.next_token().unwrap(), Token::Minus);
        assert_eq!(lexer.next_token().unwrap(), Token::Multiply);
        assert_eq!(lexer.next_token().unwrap(), Token::Divide);
        assert_eq!(lexer.next_token().unwrap(), Token::Assign);
        assert_eq!(lexer.next_token().unwrap(), Token::Equal);
        assert_eq!(lexer.next_token().unwrap(), Token::NotEqual);
        assert_eq!(lexer.next_token().unwrap(), Token::Less);
        assert_eq!(lexer.next_token().unwrap(), Token::Greater);
        assert_eq!(lexer.next_token().unwrap(), Token::LessEqual);
        assert_eq!(lexer.next_token().unwrap(), Token::GreaterEqual);
        assert_eq!(lexer.next_token().unwrap(), Token::Eof);
    }

    #[test]
    fn test_keywords() {
        let input = "buat jika fungsi kelas";
        let mut lexer = Lexer::new(input);

        assert_eq!(lexer.next_token().unwrap(), Token::Buat);
        assert_eq!(lexer.next_token().unwrap(), Token::Jika);
        assert_eq!(lexer.next_token().unwrap(), Token::Fungsi);
        assert_eq!(lexer.next_token().unwrap(), Token::Kelas);
        assert_eq!(lexer.next_token().unwrap(), Token::Eof);
    }

    #[test]
    fn test_identifiers() {
        let input = "variableName _privateVar";
        let mut lexer = Lexer::new(input);

        assert_eq!(lexer.next_token().unwrap(), Token::Identifier("variableName".to_string()));
        assert_eq!(lexer.next_token().unwrap(), Token::Identifier("_privateVar".to_string()));
        assert_eq!(lexer.next_token().unwrap(), Token::Eof);
    }

    #[test]
    fn test_string_literal() {
        let input = "\"Hello, World!\"";
        let mut lexer = Lexer::new(input);

        assert_eq!(lexer.next_token().unwrap(), Token::String("Hello, World!".to_string()));
        assert_eq!(lexer.next_token().unwrap(), Token::Eof);
    }

    #[test]
    fn test_comments() {
        let input = "// This is a comment\n/* This is a block comment */";
        let mut lexer = Lexer::new(input);

        assert_eq!(lexer.next_token().unwrap(), Token::LineComment(" This is a comment".to_string()));
        assert_eq!(lexer.next_token().unwrap(), Token::Newline);
        assert_eq!(lexer.next_token().unwrap(), Token::BlockComment(" This is a block comment ".to_string()));
        assert_eq!(lexer.next_token().unwrap(), Token::Eof);
    }

    #[test]
    fn test_position_tracking() {
        let input = "buat\nx = 5";
        let mut lexer = Lexer::new(input);

        // "buat" at line 1, column 1
        assert_eq!(lexer.next_token().unwrap(), Token::Buat);

        // "\n" at line 1, column 5
        assert_eq!(lexer.next_token().unwrap(), Token::Newline);

        // "x" at line 2, column 1
        match lexer.next_token().unwrap() {
            Token::Identifier(name) => assert_eq!(name, "x"),
            _ => panic!("Expected identifier"),
        }

        // "=" at line 2, column 3
        assert_eq!(lexer.next_token().unwrap(), Token::Assign);

        // "5" at line 2, column 5
        match lexer.next_token().unwrap() {
            Token::Number(value) => assert_eq!(value, 5.0),
            _ => panic!("Expected number"),
        }
    }
}
