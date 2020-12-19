const generateMsg = (userName,text) => {
    return {
        userName,
        text,
        createdAt : new Date().getTime()
    }
}

module.exports = {
    generateMsg
}