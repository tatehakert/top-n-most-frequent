# top-n-most-frequent

Node API that accepts a text file and an integer N and returns the top N most frequent words and their frequencies.

---
## Requirements

For development, you will only need Node.js and npm installed in your environement.
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
        If there is --> prepend the possibleOverflowBuffer to the current buffer
        If not      --> continue normal buffer processing

    After checking for a possibleOverflow on the previous chunk, we then need to check if 
    the current chunk has possibleOverflow, and update the possibleOverflowBuffer if so
*/