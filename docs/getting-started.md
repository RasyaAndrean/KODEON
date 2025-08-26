# Getting Started with KODEON

Welcome to KODEON, the revolutionary programming language designed to be the easiest to learn while being capable of all application development needs.

## Installation

### Prerequisites

- Windows, macOS, or Linux operating system
- At least 4GB RAM
- 500MB free disk space

### Installing KODEON

1. Download the latest release from [GitHub releases](https://github.com/kodeon/kodeon/releases)
2. Run the installer for your operating system
3. Follow the installation wizard
4. Verify installation by opening a terminal and running:

```bash
kodeon --version
```

### Installing the IDE

The KODEON IDE is included with the standard installation. You can launch it by:

- Running `kodeon-ide` from the command line
- Finding "KODEON IDE" in your applications menu
- Using the desktop shortcut (if created during installation)

## Your First KODEON Program

Let's create a simple "Hello, World!" program to verify your installation.

1. Open the KODEON IDE
2. Create a new file
3. Enter the following code:

```kodeon
// Hello World in KODEON - Indonesian version
buat pesan = "Halo, Dunia!"
tampilkan pesan

// Hello World in KODEON - English version
create message = "Hello, World!"
show message
```

4. Save the file with a `.kodeon` extension (e.g., `hello.kodeon`)
5. Click the "Compile" button in the toolbar
6. Click the "Run" button to execute your program

You should see the output in the IDE's output panel:

```
Halo, Dunia!
Hello, World!
```

## Language Basics

### Variables

In KODEON, you can declare variables using either Indonesian (`buat`) or English (`create`) keywords:

```kodeon
// Indonesian
buat nama = "Andi"
buat umur = 25
buat aktif = benar

// English
create name = "Andi"
create age = 25
create active = true
```

### Functions

Functions can also be defined in both languages:

```kodeon
// Indonesian
fungsi sapa(nama):
    kembalikan "Halo, " + nama + "!"

// English
function greet(name):
    return "Hello, " + name + "!"
```

### Control Structures

KODEON supports familiar control structures:

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

## Next Steps

Now that you've written your first KODEON program, try these next steps:

1. Explore the [Language Guide](language-guide.md) to learn more about KODEON syntax
2. Check out the [Examples](../examples/) directory for more sample code
3. Try the [Tutorials](tutorials/) to build more complex applications
4. Join the [Community](community.md) to connect with other KODEON developers

## Troubleshooting

If you encounter issues:

1. Ensure you have the latest version installed
2. Check the [FAQ](faq.md) for common issues
3. Visit the [Community](community.md) for help
4. Report bugs on [GitHub Issues](https://github.com/kodeon/kodeon/issues)
