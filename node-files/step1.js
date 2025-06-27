const fs = require("fs");

const fileName = process.argv[2];

function cat(path) {
  fs.readFile(path, (err, data) => {
    if (err) {
      console.error(`Error reading ${path}`, err);
      return;
    }
    console.log(data.toString());
  });
}

cat(fileName);
