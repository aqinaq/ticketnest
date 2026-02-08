require("dotenv").config();
const mongoose = require("mongoose");
const Event = require("../models/Event");
const User = require("../models/User");

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

async function run() {
  await mongoose.connect(uri);

  const user = await User.findOne();
  if (!user) {
    console.log("No users found. Create an account first.");
    process.exit(1);
  }

  const result = await Event.updateMany(
    { owner: { $exists: false } },
    { $set: { owner: user._id } }
  );

  console.log("Assigned owner to events:", result.modifiedCount);
  process.exit();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
