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

const getContainerLogs = (args) => {
    subProcessStore["logsPty"].write(`docker logs --follow ${args.containerId}` + "\n")
}

const killSubProcess = (args) => {
    subProcessStore[args.processKey].kill()
    delete subProcessStore[args.processKey]
}

const execContainer = (args) => {
    subProcessStore["execPty"].write(`docker exec -it ${args.containerId} sh` + "\n")
}

const inputPty = (args) => {
    subProcessStore["execPty"].write(args.data)
}

const exitExec = () => {
    subProcessStore["execPty"].write("exit" + "\n")
}

const exitLogs = () => {
    subProcessStore["logsPty"].write("\x03" + "\n")
}

module.exports = {
    getContainers,
    removeContainer,
    startContainer,
    stopContainer,
    getContainerLogs,
    killSubProcess,
    execContainer,
    inputPty,
    exitExec,
    exitLogs
}