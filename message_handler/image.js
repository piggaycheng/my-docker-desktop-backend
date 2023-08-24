const { subProcessStore } = require("../helpers/process")
const { spawnSync } = require("child_process")

const getImages = () => {
    subProcessStore["mainPty"].write("docker image ls --format='{{json .}}'\n")
}

const runImage = (args, webContents) => {
    spawnSync("wsl", ["-u", "root", "docker", "run", args.imageId])
    webContents.send("reply-message", {
        "origin-message": args,
        "content": null
    })
}

module.exports = {
    getImages,
    runImage
}