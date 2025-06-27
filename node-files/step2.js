const fs = require("fs");
const axios = require("axios");

const input = process.argv[2];

function cat(path) {
  fs.readFile(path, (err, data) => {
    if (err) {
      console.error(`Error reading ${path}`, err);
      return;
    }
    console.log(data.toString());
  });
}

function webCat(url) {
  axios
    .get(url)
    .then((response) => {
      console.log("Status:", response.status);
      console.log("Data:", response.data);
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
}

if (!input) {
  console.error("Provide a file or url");
  process.exit(1);
}

if (input.startsWith("http://") || input.startsWith("https://")) {
  webCat(input);
} else {
  cat(input);
}
