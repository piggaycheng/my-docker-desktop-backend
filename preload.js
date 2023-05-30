/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */
const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  window.addEventListener("message", (e) => {
    if (e.data.type && e.data.method) {
      ipcRenderer.send("message", e.data)
    }
  })
})


ipcRenderer.on("reply-message", (e, message) => {
  window.postMessage(message)
})