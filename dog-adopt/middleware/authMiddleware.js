const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "doggy adopt", (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

const checkUser = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "doggy adopt", async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null;
        next();
      } else {
        try {
          const user = await req.db
            .collection("users")
            .findOne({ _id: new ObjectId(decodedToken.id) });

          res.locals.user = user;
          next();
        } catch (err) {
          console.log("checkUser DB error:", err.message);
          res.locals.user = null;
          next();
        }
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser };
