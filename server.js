const fs = require("fs");
const { Transform } = require("stream");

let sourceFile = process.argv[2];
let resultFile = process.argv[3];
let separator = process.argv[4];

const createTransformStream = () =>
  new Transform({
    transform(chunk, encoding, callback) {
      let content = "";
      content += chunk;
      content = content.split("\n");

      let headers = content.shift().split(separator);

      const json = [];
      content.forEach((row) => {
        convertedObject = {};
        rowItems = row.split(separator);
        headers.forEach((header, i) => (convertedObject[header] = rowItems[i]));
        json.push(convertedObject);
      });
      callback(null, JSON.stringify(json));
    },
  });
transformStream = createTransformStream();

let readableStream = fs.createReadStream(sourceFile);
let writableStream = fs.createWriteStream(resultFile);

readableStream.pipe(transformStream).pipe(writableStream);
