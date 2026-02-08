const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, maxlength: 40 },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
  type: String,
  enum: ["user", "admin"],
  default: "user"
}

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
