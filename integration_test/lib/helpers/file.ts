import fs = require('fs');
const Papa = require('papaparse');

export function getCSVResults(filePath: string) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return reject(err); // Reject the promise on error
      }
      const parsed = Papa.parse(data, { header: true });
      resolve(parsed.data); // Resolve the promise with parsed data
    });
  });
}
