const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    location: { type: String, required: true, trim: true, maxlength: 120 },
    date: { type: Date, required: true },

    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" } 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);