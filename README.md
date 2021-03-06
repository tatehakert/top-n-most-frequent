# top-n-most-frequent

Node API that accepts a text file and an integer N and returns the top N most frequent words and their frequencies.


---
## Requirements

For development, you will need Node.js and npm installed in your environement.
This project has been tested with Node v15.0.1

## Install

    $ git clone https://github.com/tatehakert/top-n-most-frequent
    $ cd top-n-most-frequent
    $ npm install

## Configure app

The app comes pre-configured, but the following paramaters can be updated for further testing:

    portNumber (top of index.js file) --> changes the default port number
    maxMB (top of index.js file) --> limits the maximum allowed file size
    
## Running the app
From within the project folder, run:
    
    $ node index.js

### Using the app

#### From the browser
Navigate to http://localhost:8080 to view the html upload form.

    Choose a file, enter an "N" value, and click submit. The results will display in the browser in JSON format.

#### Make a POST request
You can also interact with the server by submitting a POST request to http://localhost:8080/submitForm

    The "/submitForm" route accepts the following form fields:
    {
        "filetoupload": {file attachment},
        "nVal": {number [1-k]}
    }

## Procedure

This app uses busboy to process the incoming file stream data without having to save it first. For large file streams, data is split into chunks and each chunk is processed by busboy's file.on('data', (data) => {}) handler.

The BufferManager class accepts the data buffer for each incoming chunk and returns an array of unformatted "words". The WordIndex class accepts the array of words, formats them, and increments the word's frequency in the WordIndex class instance. 

## Classes

### BufferManager Class
    - Manages incoming chunks of data to make sure that sequential chunks are connected before extracting "words"
    
    When beginning to process a new chunk of buffer data, we first need to check if there is 
    a possibleOverflow from the previous chunk.
        If there is --> prepend the possibleOverflowBuffer to the current buffer
        If not      --> continue normal buffer processing

    After checking for a possibleOverflow on the previous chunk, we then need to check if 
    the current chunk has possibleOverflow, and update the possibleOverflowBuffer if so (to be checked on next iteration)

### WordIndex Class
    - Manages frequency count of each unique word in the data stream

    This class contains a dictionary containing each unique word that is encountered. 
    If a new word is encountered, it is added to the dictionary with a frequency of 1
    If an old word is encountered, its frequency is incremented in the dictionary

    When the entire stream has finished processing:

        WordIndex.getMostFrequentN() returns the top-N most frequent words and their frequencies in JSON format

## Assumptions
### "Word" Format
For this project, the definition of a word needs to be clearly defined to get the expected results.
The following process ignores the possibility of an incomplete string (due bytes of a word overflowing between chunks), 
 - Split the string into an array using a regex pattern for spaces/newLines/carrigeReturns as the delimiter.
    - the result is an array of unformatted words (and empty strings) that need to be filtered and processed
 - For each word:
    - remove any non-alphanumeric characters
    - make it lowercase
    - IF the result is not an empty string --> add it to the index


### Results Format
Words are sorted by their frequency in decreasing order (sorted alphabetically for words with the same frequency).
Only the top N results are returned.

Results are returned in the following JSON format:

    {
        "frequencies": [
            {"word": "example1", "count": 5},
            {"word": "example2", "count": 2},
        ]
    }


## Example
### testCase.txt
    Figet ex inuado resonantia. Certaveroque suaderesque metas exspectabas et nefastosque bellumque, usurparer ducamque liburnorumque et coniungisque loquaris sisque a ab meminisseque aut tetragonum ob putavistique.
### Response
    {"frequencies":[{"word":"et","count":2},{"word":"a","count":1},{"word":"ab","count":1}]}


## Unit test:
This project has unit test using jest.

To install jest as a dev dependency, run:
    
    $ npm install --save-dev jest

Then run the test with:
    
    $ npm test

## Improvements/Potential Issues

- If the text in the stream chunk does not have any spaces, BufferManager will assume possible overflow and will search the buffer for the a delimiter to split on. Since there are no spaces (delimiters), BufferManager will instead push the entire buffer into the overflow buffer (to be processed on the next iteration). If the subsequent chunks also lack delimiters, the process will repeat and it will continue to push each chunk onto the overflow buffer. This will result in the entire string being processed AFTER all the data has been recieved. This is an issue because it blocks the app from being able to procees incoming data without saving it first. One solution would be to setup a max buffer size so that an error is returned before a single request starts using too much memory.

- Need to do more test to determine if the BufferManager class can detect/handle overflow of multi-byte characters 

