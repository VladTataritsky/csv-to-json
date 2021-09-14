import { createReadStream, createWriteStream } from "fs";
import { Transform } from "stream";

const sourceFile = process.argv[2];
const resultFile = process.argv[3];
let separator = process.argv[4];

const detectSeparator = (content) => {
  let separator = null;

  // find all punctuation marks of each 10 rows
  let arrsOfRows = content
    .slice(0, 10)
    .map((row) => row.match(/[^A-Za-z0-9]/g));

  // filter array of punctuation marks of each rows with marks of first row
  const repeatedMarks = arrsOfRows
    .shift()
    .filter((v) => arrsOfRows.every((a) => a.indexOf(v) !== -1));

  // find most repeated mark from array of repeated marks
  separator =
    [
      ...new Set(
        repeatedMarks.filter(
          (value, index, self) => self.indexOf(value) !== index
        )
      ),
    ][0] || "";

  return separator;
};

const createTransformStream = () =>
  new Transform({
    transform(chunk, encoding, callback) {
      let content = "";
      content += chunk;
      content = content.split("\n");

      if (!separator) {
        separator = detectSeparator(content);
      }

      let headers = content.shift().split(separator);

      const json = [];
      content.forEach((row) => {
        let convertedObject = {};
        let rowItems = row.split(separator);
        headers.forEach((header, i) => (convertedObject[header] = rowItems[i]));
        json.push(convertedObject);
      });
      callback(null, JSON.stringify(json));
    },
  });
const transformStream = createTransformStream();

let readableStream = createReadStream(sourceFile);
let writableStream = createWriteStream(resultFile);

readableStream.pipe(transformStream).pipe(writableStream);
