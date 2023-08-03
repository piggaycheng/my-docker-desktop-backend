const { spawn } = require("child_process")
const { global } = require("./global")
const pty = require('node-pty');

const getSubProcess = (webContents) => {
    let subProcess = null

    if (process.platform === 'win32') {
        const wslProcess = spawn("wsl", ["-u", "root"])
        wslProcess.stdin.write("service docker start\n")
        subProcess = wslProcess
    } else if (process.platform === 'darwin') {
        const bashProcess = spawn("bash")
        subProcess = bashProcess
    }

    if (subProcess !== null) {
        subProcess.stdout.on("data", (chunk) => {
            // console.log("out: " + chunk.toString());
            let content = `[${chunk.toString().split("\n").filter(x => x).join(",")}]`
            if (global.message && global.message.type === "container" && global.message.method === "getContainerLogs") {
                content = chunk.toString()
            }
            webContents.send("reply-message", {
                "origin-message": global.message,
                "content": content,
                "stdType": "out"
            })
        })
        subProcess.stderr.on("data", (chunk) => {
            // console.log("error: " + chunk.toString());
            webContents.send("reply-message", {
                "origin-message": global.message,
                "content": chunk.toString(),
                "stdType": "error"
            })
        })
    }

    return subProcess
}

const subProcessStore = {}

const getPtyProcess = (webContents) => {
    const shell = process.platform === 'win32' ? 'powershell.exe' : 'bash'
    const ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-color',
        cols: 80,
        rows: 30,
        cwd: process.env.HOME,
        env: process.env
    })

    ptyProcess.onData((data) => {
        webContents.send("fromMain", data)
    })

    return ptyProcess
}

module.exports = {
    getSubProcess,
    subProcessStore,
    getPtyProcess
}