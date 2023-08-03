/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */
const { ipcRenderer, contextBridge } = require('electron');

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

let fromMain = null

contextBridge.exposeInMainWorld("process", {
  send: (channel, data) => {
    // whitelist channels
    const validChannels = ["toMain", "inputPty"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  receive: (channel, callback) => {
    const validChannels = ["fromMain"];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender` 
      fromMain = (event, args) => {
        callback(args)
      }
      ipcRenderer.on(channel, fromMain)
    }
  },
  receiveOff: (channel) => {
    const validChannels = ["fromMain"];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender` 
      ipcRenderer.off(channel, fromMain)
    }
  }
})