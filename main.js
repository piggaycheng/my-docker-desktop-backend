// Modules to control application life and create native browser window
const { app, BrowserWindow, session, ipcMain } = require('electron')
const path = require('path')
const message_handler = require('./message_handler')
const { getSubProcess, subProcessStore, getPtyProcess } = require('./helpers/process')
const { global } = require("./helpers/global")

let mainWindow = null

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'))

  // Load vue devtools
  session.defaultSession.loadExtension(
    path.resolve(__dirname, 'extensions/vue-devtools'),
    { allowFileAccess: true }
  )

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  subProcessStore["main"] = getSubProcess(mainWindow.webContents)
  subProcessStore["mainPty"] = getPtyProcess(mainWindow.webContents, "replyMainPty")
  subProcessStore["logsPty"] = getPtyProcess(mainWindow.webContents, "replyLogsPty")
  subProcessStore["execPty"] = getPtyProcess(mainWindow.webContents, "replyExecPty")
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on("message", (e, args) => {
  global.message = args;
  message_handler[args.type][args.method](args, mainWindow.webContents);
})

ipcMain.on("mainPty", (e, args) => {
  global.message = args;
  message_handler[args.type][args.method](args, mainWindow.webContents);
})