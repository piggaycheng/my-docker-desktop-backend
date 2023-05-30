const { spawn } = require("child_process")

const wslProcess = spawn("wsl", ["-u", "root"])
wslProcess.stdin.write("service docker start\n")

module.exports = {
    wslProcess
}