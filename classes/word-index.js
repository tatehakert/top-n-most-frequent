
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

    processString(string){
        let newLinesReplaced = string.replace(/\n+/g, " ");   //replace newlines with " "
        let wordArray = newLinesReplaced.split(" ")           //split the string into an array of words on " "
        
        wordArray.forEach((word) => {
            let formattedWord = word.replace(/[^A-Za-z0-9]/g, "").toLowerCase();
            if(formattedWord !== ""){               //ignore empty strings 
                if(formattedWord in this.dict){ 
                    this.dict[formattedWord]++      //if word is in the index --> increment it's count
                }else{
                    this.uniqueWordCount++
                    this.dict[formattedWord] = 1    //new word --> add to index with count == 1
                }
            }
        })
    }

    getMostFrequentN(){
        let result = {}
        let frequencies = []

        Object.keys(this.dict).map((key) => {
            frequencies.push({"word": key, "count": this.dict[key]})
        })

        result["frequencies"] = frequencies.sort((a,b) => {
            if(a["count"] == b["count"]){ return a["word"] > b["word"] ? 1 : -1 }   //if counts are equal, sort alphabetically 
            return b["count"] - a["count"]                                          //otherwise, sort by count decending
        })

        result["frequencies"] = result["frequencies"].slice(0,this.nVal)
        return result
    }

}

module.exports = WordIndex;