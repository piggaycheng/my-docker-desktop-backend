const { wslProcess } = require("./utils")
const { spawnSync } = require("child_process")

const getContainers = () => {
    wslProcess.stdin.write("docker container ls -a --format='{{json .}}'\n")
}

const removeContainer = (args) => {
    wslProcess.stdin.write(`docker container rm ${args.containerId}` + "\n")
}

module.exports = {
    getContainers,
    removeContainer
}