# KODEON Syntax Specification

## Language Concepts

KODEON is designed with a natural language approach that allows developers to write code that closely resembles human language. The language supports both Indonesian and English syntax to make it accessible to a wider audience.

## Lexical Analysis

### Keywords
```
Indonesian: buat, jika, maka, sebaliknya, fungsi, kelas, kembalikan, ulangi, selama, untuk, di, dari, sampai
English: create, if, then, otherwise, function, class, return, repeat, while, for, in, from, to
```

### Operators
```
Arithmetic: +, -, *, /, %, **
Comparison: ==, !=, <, >, <=, >=
Logical: dan, atau, tidak (and, or, not)
Assignment: =
```

### Literals
- Numbers: Integer and floating-point values
- Strings: Text enclosed in double quotes "..."
- Booleans: benar/salah or true/false

### Identifiers
- Variable and function names
- Must start with a letter or underscore
- Can contain letters, numbers, and underscores

## Grammar Rules (EBNF)

```
program ::= statement*

statement ::= declaration 
            | assignment 
            | conditional 
            | loop 
            | expression 
            | function_definition
            | class_definition

declaration ::= "buat" identifier "=" expression
              | "create" identifier "=" expression

assignment ::= identifier "=" expression

expression ::= term {("+" | "-") term}
term ::= factor {("*" | "/") factor}
factor ::= number | string | identifier | "(" expression ")" | function_call

conditional ::= "jika" expression "maka:" block ("sebaliknya:" block)?
              | "if" expression "then:" block ("otherwise:" block)?

loop ::= "ulangi" block "selama" expression
       | "repeat" block "while" expression
       | "untuk" identifier "dari" expression "sampai" expression "lakukan:" block
       | "for" identifier "from" expression "to" expression "do:" block

block ::= indent statement+ dedent

function_definition ::= "fungsi" identifier "(" parameter_list? ")" ":" block
                      | "function" identifier "(" parameter_list? ")" ":" block

parameter_list ::= identifier {"," identifier}

function_call ::= identifier "(" argument_list? ")"
argument_list ::= expression {"," expression}

class_definition ::= "kelas" identifier ":" block
                   | "class" identifier ":" block

return_statement ::= "kembalikan" expression
                  | "return" expression
```

## Type System

KODEON uses a dynamic typing system with optional static type hints:

1. **Dynamic Typing**: Variables can hold values of any type
2. **Type Inference**: Automatic detection of variable types
3. **Runtime Type Checking**: Type validation during execution
4. **Safe Implicit Conversions**: Automatic type conversion when safe

## Standard Data Types

- **Number**: Integer and floating-point numbers
- **String**: Text values
- **Boolean**: True/False values
- **Array**: Ordered collections of values
- **Object**: Key-value collections
- **Function**: Callable units of code
- **Null**: Empty/undefined value

## Examples

### Variable Declaration
```kodeon
// Indonesian
buat nama = "KODEON"
buat versi = 1.0
buat aktif = benar

// English
create name = "KODEON"
create version = 1.0
create active = true
```

### Conditional Statements
```kodeon
// Indonesian
jika umur >= 18 maka:
    tampilkan "Dewasa"
sebaliknya:
    tampilkan "Anak-anak"

// English
if age >= 18 then:
    show "Adult"
otherwise:
    show "Child"
```

### Functions
```kodeon
// Indonesian
fungsi hitung_luas(panjang, lebar):
    kembalikan panjang * lebar

hasil = hitung_luas(10, 5)

// English
function calculate_area(length, width):
    return length * width

result = calculate_area(10, 5)
```

### Classes
```kodeon
// Indonesian
kelas Mobil:
    buat merek, model, tahun
    
    fungsi mulai():
        tampilkan "{merek} {model} dinyalakan"
    
    fungsi berhenti():
        tampilkan "Mobil berhenti"

mobil_saya = Mobil("Toyota", "Camry", 2023)
mobil_saya.mulai()

// English
class Car:
    create brand, model, year
    
    function start():
        show "{brand} {model} started"
    
    function stop():
        show "Car stopped"

my_car = Car("Toyota", "Camry", 2023)
my_car.start()
```