module.exports.register_get = (req, res) => {
  res.render("register");
};

module.exports.register_post = async (req, res) => {
  const { name, description } = req.body;
  const user = res.locals.user;
  console.log(user);
  try {
    if (!name || !description) {
      return res.status(400).json({
        errors: {
          name: !name ? "Name is required" : "",
          description: !description ? "Description is required" : "",
        },
      });
    }
    const dog = await req.db.collection("dogs").insertOne({
      name,
      description,
      postedBy: user.username,
      userId: user._id,
    });
    res.status(201).json({ dogId: dog.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports.adopt_get = async (req, res) => {
  const user = res.locals.user;
  console.log(user.username);
  try {
    const dogs = await req.db
      .collection("dogs")
      .find({ adopted: { $ne: true } })
      .toArray();
    res.render("adopt", { dogs });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to load dogs");
  }
};

module.exports.adopt_post = async (req, res) => {
  const dogId = req.params.id;
  const { ObjectId } = require("mongodb");
  const user = res.locals.user.username;

  try {
    const result = await req.db
      .collection("dogs")
      .updateOne(
        { _id: new ObjectId(dogId) },
        { $set: { adopted: true, adoptedBy: user } }
      );

    if (result.modifiedCount === 1) {
      res.status(200).json({ message: "Dog adopted!" });
    } else {
      res.status(400).json({ error: "Dog not found or already adopted" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not mark dog as adopted" });
  }
};

module.exports.yourdogs_get = async (req, res) => {
  const user = res.locals.user.username;
  console.log(user);
  try {
    const dogs = await req.db
      .collection("dogs")
      .find({ adoptedBy: user })
      .toArray();
    res.render("yourdogs", { dogs });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to load dogs");
  }
};
