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

let callbackStore = {}

contextBridge.exposeInMainWorld("process", {
  send: (channel, data) => {
    ipcRenderer.send(channel, data)
  },
  listen: (channel, callback) => {
    callbackStore[channel] = (event, args) => {
      callback(args)
    }
    ipcRenderer.on(channel, callbackStore[channel])
  },
  listenOff: (channel) => {
    ipcRenderer.off(channel, callbackStore[channel])
  }
})