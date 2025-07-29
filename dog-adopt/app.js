const express = require("express");
const authRoutes = require("./routes/authRoutes");
const adoptRoutes = require("./routes/adoptRoutes");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");
const { connectToDb, getDb } = require("./drivers/db.js");

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

connectToDb((err) => {
  if (!err) {
    const db = getDb();

    app.use((req, res, next) => {
      req.db = db;
      next();
    });

    app.use(checkUser);
    app.get("/", (req, res) => res.render("home"));
    app.get("/doggy", requireAuth, (req, res) => res.render("doggy"));
    app.use(authRoutes);
    app.use(adoptRoutes);

    app.listen(3000, () => console.log("App listening on port 3000"));
  } else {
    console.error("Failed to connect to database");
  }
});
