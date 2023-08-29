const { subProcessStore } = require("../helpers/process")
const { spawnSync } = require("child_process")

const getImages = () => {
    subProcessStore["mainPty"].write("docker image ls --format='{{json .}}'\n")
}

const runImage = (args, webContents) => {
    subProcessStore["mainPty"].write(`docker run ${args.imageId}` + "\n")
}

module.exports = {
    getImages,
    runImage
}