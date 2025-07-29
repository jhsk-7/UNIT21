const { MongoClient } = require("mongodb");
require("dotenv").config();

let dbConnection;

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(
      `mongodb+srv://jhimpinfo:${process.env.DB_PASSWORD}@node.caagjse.mongodb.net`
    )
      .then((client) => {
        dbConnection = client.db(`${process.env.DB_NAME}`);
        return cb();
      })
      .catch((err) => {
        console.log(err);
        return cb(err);
      });
  },
  getDb: () => dbConnection,
};
