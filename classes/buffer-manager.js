/*  
    BufferManager class:
    - Manages incoming chunks of data to make sure that sequential chunks are connected before extracting "words"
    
        When beginning to process a new chunk of buffer data, we first need to check if there is 
        a possibleOverflow from the previous chunk.
            If there is --> prepend the possibleOverflowBuffer to the current buffer
            If not      --> continue normal buffer processing

        After checking for a possibleOverflow on the previous chunk, we then need to check if 
        the current chunk has possibleOverflow, and update the possibleOverflowBuffer if so (to be checked on next iteration)
 */
class BufferManager{

    constructor(){
        this.possibleOverflowBuffer = []
        this.currentBuffer = []
    }

    getWordsFromBufferData(buff){
        //check for possibleOverflow from the previous chunk, --> add it to the beginning of the new chunk
        if(this.possibleOverflowBuffer.length > 0){
            let totalLength = this.possibleOverflowBuffer.length + buff.length
            buff = Buffer.concat([this.possibleOverflowBuffer, buff], totalLength)
            this.possibleOverflowBuffer = []
        }

        //check for a possible overflow at the end of the new chunk buffer        
        let dIndex = this.findLastDelimiterIndex(buff)

        //if the last byte is not a space (hex: 20) or newline (hex: 0a) --> we have a possible overflow
        if(dIndex != buff.length-1){ 
            this.possibleOverflowBuffer = buff.slice(dIndex)            //  - update possibleOverflowBuffer to buff.slice(dIndex)
            return buff.slice(0,dIndex).toString().split(/[\n\r\s]/g)   //  - update current data buffer to buff.slice(0, dIndex)
        }else{
            return buff.toString().split(/[\n\r\s]/g)                   //  - return the string split into a "word" array
        }
    }

    getWordsFromOverflowBuffer(){
        return this.possibleOverflowBuffer.toString().split(/[\n\r\s]/g)
    }

    findLastDelimiterIndex(buff){   //find the last occurrence space char (hex: 20) or newline (hex: 0a)
        let dIndex = buff.length-1
        while(dIndex > 0 && buff[dIndex] != 32 && buff[dIndex] != 10){
            dIndex--
        }
        return dIndex
    }
}

module.exports = BufferManager;