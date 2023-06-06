const { spawn } = require("child_process")

const getSubProcess = () => {
    if (process.platform === 'win32') {
        const wslProcess = spawn("wsl", ["-u", "root"])
        wslProcess.stdin.write("service docker start\n")
        return wslProcess
    } else if (process.platform === 'darwin') {
        const bashProcess = spawn("bash")
        return bashProcess
    }

    return null
}

const subProcess = getSubProcess()

module.exports = {
    subProcess
}