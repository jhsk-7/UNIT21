const express = require("express");
const ExpressError = require("./expressError");
const items = require("./fakeDbs");

const app = express();

app.get("/items", (req, res, next) => {
  res.send(items);
});

app.post("/items", (req, res, next) => {
  const data = req.body;
  console.log(data);
  res.send(data);
});

app.get("/items/:name", (req, res, next) => {
  const data = req.params.name;
  const item = items.find(
    (item) => item.name.toLowerCase() === data.toLowerCase()
  );
  if (!item) {
    throw new ExpressError("Item not found");
  }
  return res.send(item);
});

app.patch("/items/:name", (req, res, next) => {
  const data = req.params.name.toLowerCase();
  const item = items.find((item) => item.name.toLowerCase() === data);
  if (!item) {
    throw new ExpressError("Item not found", 404);
  }
  const { name, price } = req.body;
  if (name !== undefined) item.name = name;
  if (price !== undefined) item.price = price;
  return res.json({ updated: item });
});

app.delete("/items/:name", (req, res, next) => {
  const data = req.params.name.toLowerCase();
  const itemIndex = items.findIndex((item) => item.name.toLowerCase() === data);
  if (itemIndex === -1) {
    throw new ExpressError("Item not found", 404);
  }
  items.splice(itemIndex, 1);
  return res.json({ message: "Deleted" });
});

app.use((req, res, next) => {
  const e = new ExpressError("Page Not Found", 404);
  next(e);
});

app.use(function (err, req, res, next) {
  let message = err.msg;
  let status = err.status || 500;

  return res.status(status).json({ error: { message } });
});

app.listen(3000, () => console.log("Server starting on port 3000"));
