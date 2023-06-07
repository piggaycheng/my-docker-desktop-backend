const { getSubProcess, subProcessStore } = require("../helpers/process")

const getContainers = () => {
    subProcessStore["main"].stdin.write("docker container ls -a --format='{{json .}}'\n")
}

const removeContainer = (args) => {
    subProcessStore["main"].stdin.write(`docker container rm ${args.containerId}` + "\n")
}

const startContainer = (args) => {
    subProcessStore["main"].stdin.write(`docker container start ${args.containerId}` + "\n")
}

const stopContainer = (args) => {
    subProcessStore["main"].stdin.write(`docker container stop ${args.containerId}` + "\n")
}

const getContainerLogs = (args, webContents) => {
    subProcessStore["logs"] = getSubProcess(webContents)
    subProcessStore["logs"].stdin.write(`docker logs --follow ${args.containerId}` + "\n")
}

const killSubProcess = (args) => {
    subProcessStore[args.processKey].kill()
    delete subProcessStore[args.processKey]
}

module.exports = {
    getContainers,
    removeContainer,
    startContainer,
    stopContainer,
    getContainerLogs,
    killSubProcess
}