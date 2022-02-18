class BufferManager{
/*
For large file streams, data is split into chunks and each chunk is processed by busboy's file.on('data', (data) => {}) function
    
    It is likely that a chunk of data will end in the middle of a word in the text file.
    Only if the last character in the chunk is a " " (space) can we verify that there is no overflow  
    If we cannot verify the overflow status, the last "word" in the chunk can only be indexed 
    by pre-pending the "possibleOverflow" word to the following chunk 
        --> Ex: {"hello worl"}, {"d!"} ==> {"hello"}, {"world!"}
    
    If the last character is a " " (space):
        --> there is no overflow (verified)

    If the last character is NOT a " " (space):
        --> find the last index of a space character in the buffer
        --> update possibleOverflowBuffer to equal buffer data from the index of the last " " to the end of the buffer
        --> slice buffer to buffer[0, spaceIndex]
    
    When beginning to process a new chunk of buffer data, we first need to check if there is 
    a possibleOverflow from the previous chunk.
        If there is --> prepend the possibleOverflow buffer to the current buffer
        If not      --> continue normal buffer processing

    After checking for a possibleOverflow on the previous chunk, we then need to check if 
    the current chuck has possibleOverflow, and update the possibleOverflowBuffer if so
*/

    constructor(){
        this.possibleOverflowBuffer = []
        this.currentBuffer = []
    }

    getStringFromBufferData(buff){
        //check for possibleOverflow from the previous chunk, --> add it to the beginning of the new chunk
        if(this.possibleOverflowBuffer.length > 0){
            let totalLength = this.possibleOverflowBuffer.length + buff.length
            buff = Buffer.concat([this.possibleOverflowBuffer, buff], totalLength)
            this.possibleOverflowBuffer = []
        }

        //check for a possible overflow at the end of the new chunk buffer        
        let dIndex = this.findLastDelimiterIndex(buff)

        if(dIndex != buff.length-1){ 
            //last byte is not a space (hex: 20) or newline (hex: 0a) --> we have a possible overflow
            //  - update possibleOverflowBuffer to buff.slice(dIndex)
            //  - update current data buffer to buff.slice(0, dIndex)
            this.possibleOverflowBuffer = buff.slice(dIndex)
            buff = buff.slice(0,dIndex)
        }

        return buff.toString()
    }

    findLastDelimiterIndex(buff){   //find the last occurrence space char (hex: 20) or newline (hex: 0a)
        let dIndex = buff.length-1
        while(dIndex > 0 && !["20", "a"].includes(buff[dIndex].toString(16))){
            dIndex--
        }
        return dIndex
    }

    getOverflowString(){
        return this.possibleOverflowBuffer.toString()
    }
}

module.exports = BufferManager;