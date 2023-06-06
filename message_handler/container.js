const { subProcess } = require("../helpers/process")
const { spawnSync } = require("child_process")

const getContainers = () => {
    subProcess.stdin.write("docker container ls -a --format='{{json .}}'\n")
}

const removeContainer = (args) => {
    subProcess.stdin.write(`docker container rm ${args.containerId}` + "\n")
}

const startContainer = (args) => {
    subProcess.stdin.write(`docker container start ${args.containerId}` + "\n")
}

const stopContainer = (args) => {
    subProcess.stdin.write(`docker container stop ${args.containerId}` + "\n")
}

const getContainerLogs = (args) => { 
    subProcess.stdin.write(`docker logs ${args.containerId}` + "\n")
}

module.exports = {
    getContainers,
    removeContainer,
    startContainer,
    stopContainer,
    getContainerLogs
}