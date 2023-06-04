const { spawn } = require("child_process")

let subProcess = null
if (process.platform === 'win32') {
    const wslProcess = spawn("wsl", ["-u", "root"])
    wslProcess.stdin.write("service docker start\n")
    subProcess = wslProcess
} else if (process.platform === 'darwin') {
    const bashProcess = spawn("bash")
    subProcess = bashProcess
}

module.exports = {
    subProcess
}