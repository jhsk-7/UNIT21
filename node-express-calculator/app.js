const express = require("express");
const app = express();

app.listen(3000, () => console.log(`Server starting on port 3000`));

app.get("/mean", function (req, res) {
  let sum = 0;
  let query = req.query.nums;

  if (!query) {
    return res.status(400).send({
      error:
        "You must pass a query key of nums with a comma-separated list of numbers.",
    });
  }

  const numbers = query.split(",").map(Number);
  numbers.forEach((num) => {
    sum += num;
  });
  let avg = sum / numbers.length;

  let response = { operation: "mean", value: avg };

  return res.send(response);
});

app.get("/mode", function (req, res) {
  let query = req.query.nums;

  if (!query) {
    return res.status(400).send({
      error:
        "You must pass a query key of nums with a comma-separated list of numbers.",
    });
  }

  const numbers = query.split(",").map(Number);

  const freq = {};
  for (let num of numbers) {
    freq[num] = (freq[num] || 0) + 1;
  }

  let maxFreq = 0;
  let modes = [];

  for (let num in freq) {
    if (freq[num] > maxFreq) {
      maxFreq = freq[num];
      modes = [Number(num)];
    } else if (freq[num] === maxFreq) {
      modes.push(Number(num));
    }
  }
  const result = modes.length === 1 ? modes[0] : modes;

  return res.json({
    operation: "mode",
    value: result,
  });
});

app.use((req, res) => {
  res.status(404).json({ code: 404, error: "Page not found" });
});
