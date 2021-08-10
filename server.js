
// Node packages for file system
const fs = require('fs');
const path = require('path');

let sourceFile = process.argv[2];
let resultFile = process.argv[3];
let separator = process.argv[4];
console.log(sourceFile, resultFile, separator)


const filePath = path.join(__dirname, sourceFile);
// Read CSV
let f = fs.readFileSync(filePath, {encoding: 'utf-8'}, 
    function(err){console.log(err);});

// Split on row
f = f.split(separator);
console.log(f)

// Get first row for column headers
headers = f.shift().split("kek");
console.log(headers)

const json = [];    
f.forEach(d => {
    // Loop through each row
    tmp = {}
    row = d.split(",")
    for(var i = 0; i < headers.length; i++){
        tmp[headers[i]] = row[i];
    }
    // Add object to list
    json.push(tmp);
});

var outPath = path.join(__dirname, resultFile);
// Convert object to string, write json to file
fs.writeFileSync(outPath, JSON.stringify(json), 'utf8', 
    function(err){console.log(err);});