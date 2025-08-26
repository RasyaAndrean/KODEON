// Renderer process for KODEON IDE
const path = require('path');

// Initialize Monaco Editor
require('monaco-editor');

// Create editor instance
const editor = monaco.editor.create(
  document.getElementById('editor-container'),
  {
    value:
      '// Welcome to KODEON IDE\n// Write your code here\n\n/* Comprehensive example */\n\n// Variable declarations\nbuat pesan = "Halo, Dunia!"\ntampilkan pesan\n\ncreate message = "Hello, World!"\nshow message\n\n// Function definition\nfungsi sapa(nama):\n    kembalikan "Halo, " + nama + "!"\n\nhasil = sapa("KODEON")\ntampilkan hasil\n\n// Class definition\nkelas Mobil:\n    buat merek, model, tahun\n    \n    fungsi mulai():\n        tampilkan "{merek} {model} dinyalakan"\n    \n    fungsi berhenti():\n        tampilkan "Mobil berhenti"\n\nmobil_saya = Mobil("Toyota", "Camry", 2023)\nmobil_saya.mulai()',
    language: 'kodeon',
    theme: 'vs-dark',
    automaticLayout: true,
    minimap: {
      enabled: true,
    },
  }
);

// Register KODEON language
monaco.languages.register({ id: 'kodeon' });

// Define KODEON language configuration
monaco.languages.setMonarchTokensProvider('kodeon', {
  tokenizer: {
    root: [
      // Comments
      [/\/\*[^\*]*\*+([^\*\/][^\*]*\*+)*\//, 'comment'],
      [/\/\/.*$/, 'comment'],

      // Indonesian keywords
      [
        /buat|jika|maka|sebaliknya|fungsi|kelas|kembalikan|ulangi|selama|untuk|di|dari|sampai|lakukan|variabel|konstan|struktur|impor|sebagai|coba|tangkap|akhirnya|lempar|benar|salah|null|baru|ini|super|dan|atau|tidak/,
        'keyword',
      ],

      // English keywords
      [
        /create|if|then|otherwise|function|class|return|repeat|while|for|in|from|to|do|variable|constant|struct|import|as|try|catch|finally|throw|true|false|null|new|this|super|and|or|not/,
        'keyword',
      ],

      // Operators
      [/[+\-*/%=<>!]+/, 'operator'],
      [/\+\+|--/, 'operator'],

      // Numbers
      [/\d+\.?\d*/, 'number'],

      // Strings
      [/"([^"\\]|\\.)*"/, 'string'],
      [/'([^'\\]|\\.)*'/, 'string'],

      // Delimiters
      [/[{}()\[\];,.:]/, 'delimiter'],

      // Identifiers
      [/[a-zA-Z_][a-zA-Z0-9_]*/, 'identifier'],
    ],
  },
});

// Define KODEON language completion items
monaco.languages.registerCompletionItemProvider('kodeon', {
  provideCompletionItems: function (model, position) {
    var suggestions = [
      // Indonesian keywords
      {
        label: 'buat',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'buat ',
        detail: 'Variable declaration (Indonesian)',
      },
      {
        label: 'jika',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'jika ',
        detail: 'If statement (Indonesian)',
      },
      {
        label: 'fungsi',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'fungsi ',
        detail: 'Function definition (Indonesian)',
      },
      {
        label: 'kelas',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'kelas ',
        detail: 'Class definition (Indonesian)',
      },
      {
        label: 'selama',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'selama ',
        detail: 'While loop (Indonesian)',
      },
      {
        label: 'untuk',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'untuk ',
        detail: 'For loop (Indonesian)',
      },

      // English keywords
      {
        label: 'create',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'create ',
        detail: 'Variable declaration (English)',
      },
      {
        label: 'if',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'if ',
        detail: 'If statement (English)',
      },
      {
        label: 'function',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'function ',
        detail: 'Function definition (English)',
      },
      {
        label: 'class',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'class ',
        detail: 'Class definition (English)',
      },
      {
        label: 'while',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'while ',
        detail: 'While loop (English)',
      },
      {
        label: 'for',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'for ',
        detail: 'For loop (English)',
      },

      // Common functions
      {
        label: 'tampilkan',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'tampilkan ',
        detail: 'Display output (Indonesian)',
      },
      {
        label: 'show',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'show ',
        detail: 'Display output (English)',
      },
    ];
    return {
      suggestions: suggestions,
    };
  },
});

// Update status bar with cursor position
editor.onDidChangeCursorPosition(function (e) {
  const position = editor.getPosition();
  document.getElementById('status-position').textContent =
    'Line ' + position.lineNumber + ', Column ' + position.column;
});

// Toolbar button event handlers
document.getElementById('compile-btn').addEventListener('click', async () => {
  const code = editor.getValue();
  updateOutput('Compilation started...\n');

  try {
    // This would call the compiler
    const result = await window.electronAPI.compileFile('temp.kodeon');
    updateOutput(`Compilation result: ${result.message}\n`);
  } catch (error) {
    updateOutput(`Compilation error: ${error.message}\n`);
    updateProblems(`Error: ${error.message}`);
  }
});

document.getElementById('run-btn').addEventListener('click', async () => {
  updateOutput('Running program...\n');

  try {
    const result = await window.electronAPI.runProgram('temp.kodeon');
    updateOutput(`Program output:\n${result.output}\n`);
  } catch (error) {
    updateOutput(`Execution error: ${error.message}\n`);
    updateProblems(`Error: ${error.message}`);
  }
});

// New file button
document.getElementById('new-file').addEventListener('click', () => {
  editor.setValue('');
  updateOutput('New file created\n');
  updateProblems('No problems detected');
});

// Save file button
document.getElementById('save-file').addEventListener('click', () => {
  const code = editor.getValue();
  // In a real implementation, this would open a save dialog
  updateOutput('File saved\n');
});

// Open file button
document.getElementById('open-file').addEventListener('click', () => {
  // In a real implementation, this would open a file dialog
  updateOutput('File opened\n');
});

// Undo button
document.getElementById('undo-btn').addEventListener('click', () => {
  editor.trigger('toolbar', 'undo', null);
});

// Redo button
document.getElementById('redo-btn').addEventListener('click', () => {
  editor.trigger('toolbar', 'redo', null);
});

// Helper function to update output panel
function updateOutput(text) {
  const outputElement = document.getElementById('output-content');
  outputElement.textContent += text;
  // Scroll to bottom
  outputElement.scrollTop = outputElement.scrollHeight;
}

// Helper function to update problems panel
function updateProblems(text) {
  const problemsElement = document.getElementById('problems-content');
  problemsElement.textContent = text;
}

// Update output with initial message
updateOutput(
  "KODEON IDE initialized\nWelcome to KODEON - The World's Easiest Programming Language!\n"
);
