const { wslProcess } = require("./utils")

const getImages = () => {
    wslProcess.stdin.write("docker image ls --format='{{json .}}'\n")
}

module.exports = {
    getImages
}