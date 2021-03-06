const express = require('express');
const app = express();
const busboy = require('busboy');
const path = require('path');
const WordIndex = require('./classes/word-index');
const BufferManager = require('./classes/buffer-manager');

const portNumber = 8080;
const maxMB = 1024;   

/*-------- GET: "/" ---------   
--> returns a html file with a form to upload the file */
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname+"/uploadForm.html"))
})


/*-------- POST: "/submitForm" ---------   
--> accepts a form containing a text file (filetoupload) and a number (nVal)
--> returns the top N most freqent words from the file in JSON format */
app.post("/submitForm", function(req,res) {
    console.log("POST: /submitForm")

    //WordIndex instance maintains a dictionary containing each unique word and its frequency
    let wordIndex = new WordIndex();

    //BufferManager instance accepts the incoming buffer data (chunk) and returns a text string 
    //  - BufferManager also keeps track of words that overflow between chunks to prevent indexing partial words
    let bufferManager = new BufferManager();

    let maxFileBytes = maxMB*1024*1024;

    const bb = busboy({
        headers: req.headers, 
        limits:{ fileSize: maxFileBytes, files: 1, fields: 1 }
    });
    
    bb.on('file', (name, file, info) => {

        //send an error if the incorrect form file name was used
        if(name != "filetoupload"){
            res.writeHead(400, { Connection: 'close', Location: '/' });
            res.end(`Error processing request: Form file should be named \"filetoupload\"`)
        }
        //send an error if the file size is greater than 1GB 
        if(req.headers["content-length"] > maxFileBytes){
            res.writeHead(400, { Connection: 'close', Location: '/' });
            res.end(`Error processing request: File size cannot be larger than ${maxMB}MB `)
        }

        const {filename, encoding, mimeType} = info;
        console.log(`File [${name}]: filename: %j, encoding: %j, mimeType: %j`, filename, encoding, mimeType);

        
        file.on('data', (data) => { //runs for each chunk of file data that is received from the request
            wordIndex.processWords(bufferManager.getWordsFromBufferData(data))
        }).on('close', () => {      //if there was 'possible' overflow from final data chunk, we now need to process it
            wordIndex.processWords(bufferManager.getWordsFromOverflowBuffer())
            console.log(`File ${name} finished stream`)
        })

    });


    bb.on('field', (name, val, info) => {
        if(name == "nVal"){
            wordIndex.setN(parseInt(val))
        }
    })

    bb.on('close', () => {
        if(isNaN(wordIndex.nVal)){                            //check that N is defined
            res.writeHead(400, "N value is NaN")
            res.end("Error processing request: N value is NaN")

        }else if(wordIndex.nVal <= 0){                        //check that N > 0
            res.writeHead(400, "N value must be greater than 0")
            res.end("Error processing request: N value must be greater than 0")

        }else if(wordIndex.nVal > wordIndex.uniqueWordCount){ //check that N <= k (where k is # of unique words)
            res.writeHead(400, "N value must be less than or equal to the # of unique words")
            res.end(`Error processing request: N value must be less than or equal to the # of unique words 
                    --> N==${wordIndex.nVal}, uniqueWordCount==${wordIndex.uniqueWordCount}`)

        }else{                                                //return result
            console.log(`Finished parsing form --> nVal: ${wordIndex.nVal}\tuniqueWords: ${wordIndex.uniqueWordCount}\n`)
            res.writeHead(200, { Connection: 'close', "Content-Type": "application/json" });
            res.end(JSON.stringify(wordIndex.getMostFrequentN()))
        }
    });

    //Pipe the POST request to busboy
    req.pipe(bb);
})

app.listen(portNumber, function(req,res){
    console.log("\n------------------------------------------------------------------------------------------")
    console.log(`\tClick here to upload a file via a web browser --> http://localhost:${portNumber}`)
    console.log("------------------------------------------------------------------------------------------")
    console.log(`OR make a POST request to http://localhost:${portNumber}/submitForm with the following form data:`)
    console.log(`\tnVal: number,\n\tfiletoupload: text/plain\n\n`)
})