# csv-to-json-by-tataritsky

## Installation and Usage

1. You can install `csv-to-json-by-tataritsky` using npm:

```
npm install csv-to-json-by-tataritsky --save
```

2. Add to your `package.json scripts section` script like this:

```
"csvToJson ": "csv-to-json-by-tataritsky"
```

3. Now you can use this package from command line:

```
npm run csvToJson --sourceFile test.csv --resultFile result.json --separator "," 
```
Where:
* "sourceFile" - path to the csv file that need to be converted.
* "resultFile" - path to the result json file.
* "separator" - separator that is used while converting.
