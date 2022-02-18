
const stringHelper = require('../functions/stringParser');

class WordIndex{
    constructor(){
        this.dict = {}
        this.nVal = 1
        this.uniqueWordCount = 0
        this.mostFrequent = []
    }

    setN(n){
        this.nVal = n
    }

    addWordToIndex(word){
        if(word !== ""){               //ignore empty strings 
            if(word in this.dict){ 
                this.dict[word]++      //if word is in the index --> increment it's count
            }else{
                this.uniqueWordCount++
                this.dict[word] = 1    //new word --> add to index with count == 1
            }
        }
    }

    processWords(words){
        words.forEach((word) => {
            this.addWordToIndex(stringHelper.formatWord(word))
        })
    }

    // processString3(string){
    //     string = stringHelper.replaceNewLines(string)

    //     stringHelper.splitIntoWordArray(string).forEach((word) => {
    //         this.addWordToIndex(stringHelper.formatWord(word))
    //     })
    // }

    getMostFrequentN(){
        let result = { "frequencies": [] }
        let list = []

        Object.keys(this.dict).map((word) => {
            list.push( [word, this.dict[word]] )
        })

        list = list.sort((a,b) => {
            if(a[1] == b[1]){ return a[0] > b[0] ? 1 : -1 }   //if counts are equal, sort alphabetically 
            return b[1] - a[1]                                //otherwise, sort by count decending
        })

        for(let i =0; i<this.nVal;i++){
            result["frequencies"].push({"word": list[i][0], "count": list[i][1]})
        }

        return result;
    }

}

module.exports = WordIndex;