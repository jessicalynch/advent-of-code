const fs = require("fs");

async function fileToLines(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data.split("\n"));
    });
  });
}

module.exports = {
  fileToLines,
};
