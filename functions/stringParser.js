function makeAlphanumeric(string){
    return string.replace(/[^A-Za-z0-9]/g, "")
}

function formatWord(word){
    return makeAlphanumeric(word).toLowerCase()
}

module.exports = {formatWord}