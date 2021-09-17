const fs = require("fs");
const { Transform } = require("stream");

const convert = () => {
  const sourceFile = process.argv[2];
  const resultFile = process.argv[3];
  let separator = process.argv[4];
  let isFirstChunk = true;

  const errorHandler = err => console.log(err)
  let readableStream = fs.createReadStream(sourceFile);

  const detectSeparator = content => {
    let detectedSeparator = '';
    isFirstChunk = false;
    let row = content[0];

    const test = row.match(/(\s*"[^"]+"\s*|\s*[^,]+|,)(?=,|$)/g);

    test.forEach(item => {
      row = row.replace(item, "");
    });

    const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
    const arrsOfMarks = row.split('');
    arrsOfMarks.forEach(mark => {
      if(countOccurrences(arrsOfMarks, mark) >= test.length - 1){
        detectedSeparator = mark;
      }
    })

    if(detectedSeparator !== separator){
      errorHandler(`Warning: auto detect delimiter is "${detectedSeparator}" but input "${separator}"`)
    }

    return detectedSeparator;
  };

  readableStream.on('data', (chunk) => {
    if (isFirstChunk) {
      let content = "";
      content += chunk;
      separator = detectSeparator(content.split("\n"));
    }
  }).on('error', (error) => errorHandler(error.message));

  const createTransformStream = () =>
    new Transform({
      transform(chunk, encoding, callback) {
        let content = "";
        content += chunk;
        content = content.split("\n");

        let headers = content.shift().split(separator);

        const json = [];
        content.forEach(row => {
          let convertedObject = {};
          let rowItems = row.split(separator);
          headers.forEach(
            (header, i) => (convertedObject[header] = rowItems[i])
          );
          json.push(convertedObject);
        });
        callback(null, JSON.stringify(json));
      }
    });
  const transformStream = createTransformStream();

  const writableStream = fs.createWriteStream(resultFile);
  readableStream.pipe(transformStream).pipe(writableStream);
};

module.exports = convert;
