const { spawn } = require("child_process")
const { global } = require("./global")

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
            console.log("out: " + chunk.toString());
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
            console.log("error: " + chunk.toString());
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

module.exports = {
    getSubProcess,
    subProcessStore
}