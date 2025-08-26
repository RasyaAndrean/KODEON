// Preload script for KODEON IDE
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  compileFile: filePath => ipcRenderer.invoke('compile-file', filePath),
  runProgram: filePath => ipcRenderer.invoke('run-program', filePath),
});
