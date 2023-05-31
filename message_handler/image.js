const { wslProcess } = require("./utils")
const { spawnSync } = require("child_process")

const getImages = () => {
    wslProcess.stdin.write("docker image ls --format='{{json .}}'\n")
}

const runImage = (args, webContents, originMessage) => {
    spawnSync("wsl", ["-u", "root", "docker", "run", args.imageId])
    webContents.send("reply-message", {
        "origin-message": originMessage,
        "content": null
    })
}

module.exports = {
    getImages,
    runImage
}