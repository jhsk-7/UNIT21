const fs = require("fs");
const axios = require("axios");

function handleOutput(data, filename) {
  if (filename) {
    fs.writeFile(filename, data, "utf8", (err) => {
      if (err) {
        console.log(err);
        return;
      }
    });
  } else {
    console.log(data);
  }
}

function cat(path, filename) {
  fs.readFile(path, (err, data) => {
    if (err) {
      console.error(`Error reading ${path}. Check path.`, err);
      return;
    }
    handleOutput(data, filename);
  });
}

function webCat(url, filename) {
  axios
    .get(url)
    .then((response) => {
      handleOutput(response.data, filename);
    })
    .catch((error) => {
      console.error(`Error reading ${url}. Check url.`, error.message);
      return;
    });
}

let filename = null;
let inputData = null;

if (process.argv[2] === "--out") {
  filename = process.argv[3];
  inputData = process.argv[4];
} else {
  inputData = process.argv[2];
}

if (!inputData) {
  console.error("Provide a file or url");
  process.exit(1);
}

if (inputData.startsWith("http://") || inputData.startsWith("https://")) {
  webCat(inputData, filename);
} else {
  cat(inputData, filename);
}
