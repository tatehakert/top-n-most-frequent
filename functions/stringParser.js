function replaceNewLines(string){
    return string.replace(/\n+/g, " ")
}

function makeAlphanumeric(string){
    return string.replace(/[^A-Za-z0-9]/g, "")
}

function formatWord(word){
    return makeAlphanumeric(word).toLowerCase()
}

function splitIntoWordArray(string){
    return string.trim().replace(/\s+/g, " ").split(" ")
}

module.exports = {replaceNewLines, splitIntoWordArray, formatWord}