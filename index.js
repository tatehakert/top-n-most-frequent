const express = require('express');
const app = express();
const path = require('path')
const portNumber = 8080;

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname+"/uploadForm.html"))
})

app.listen(portNumber, function(req,res){
    console.log("\n------------------------------------------------------------------------------------------")
    console.log(`\tClick here to upload a file via a web browser --> http://localhost:${portNumber}`)
    console.log("------------------------------------------------------------------------------------------")
})