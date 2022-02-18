
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

    processString3(string){
        string = stringHelper.replaceNewLines(string)

        stringHelper.splitIntoWordArray(string).forEach((word) => {
            this.addWordToIndex(stringHelper.formatWord(word))
        })
    }

    // processString2(string){
    //     string = stringHelper.replaceNewLines(string)
    //     stringHelper.splitIntoWordArray(string).forEach((word) => {
    //         word = stringHelper.formatWord(word)
    //         if(word !== ""){               //ignore empty strings 
    //             if(word in this.dict){ 
    //                 this.dict[word]++      //if word is in the index --> increment it's count
    //             }else{
    //                 this.uniqueWordCount++
    //                 this.dict[word] = 1    //new word --> add to index with count == 1
    //             }
    //         }
    //     })
    // }

    // processString(string){
    //     let newLinesReplaced = string.replace(/\n+/g, " ");   //replace newlines with " "
    //     let wordArray = newLinesReplaced.split(" ")           //split the string into an array of words on " "
        
    //     wordArray.forEach((word) => {
    //         //format the word by removing all non-alphanumeric characters --> toLowerCase()
    //         let formattedWord = word.replace(/[^A-Za-z0-9]/g, "").toLowerCase();

    //         if(formattedWord !== ""){               //ignore empty strings 
    //             if(formattedWord in this.dict){ 
    //                 this.dict[formattedWord]++      //if word is in the index --> increment it's count
    //             }else{
    //                 this.uniqueWordCount++
    //                 this.dict[formattedWord] = 1    //new word --> add to index with count == 1
    //             }
    //         }
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