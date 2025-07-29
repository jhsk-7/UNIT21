const bcrypt = require("bcrypt");

// helper to validate and create new users
const createUser = async (db, username, password) => {
  if (!username || !password) {
    throw new Error("Username and password required");
  }

  if (typeof username !== "string" || username.length < 3) {
    throw new Error("Invalid username");
  }

  if (password.length < 6) {
    throw new Error("Minimum password length is 6 characters");
  }

  const existingUser = await db.collection("users").findOne({ username });
  if (existingUser) {
    throw new Error("Username already registered");
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  const result = await db.collection("users").insertOne({
    username,
    password: hashedPassword,
  });

  return result.ops[0]; // return the created user
};

// helper to log in users
const loginUser = async (db, username, password) => {
  const user = await db.collection("users").findOne({ username });

  if (!user) {
    throw new Error("incorrect username");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("incorrect password");
  }

  return user;
};

module.exports = {
  createUser,
  loginUser,
};
