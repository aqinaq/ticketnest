require("dotenv").config();
const mongoose = require("mongoose");
const Event = require("../models/Event");

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

const events = [
  { title: "Coldplay Live", location: "London", date: "2026-03-10" },
  { title: "Imagine Dragons Concert", location: "Berlin", date: "2026-03-15" },
  { title: "Champions League Final", location: "Paris", date: "2026-05-28" },
  { title: "NBA Finals Game 1", location: "Los Angeles", date: "2026-06-02" },
  { title: "Taylor Swift Tour", location: "New York", date: "2026-04-12" },
  { title: "World Tech Conference", location: "San Francisco", date: "2026-09-20" },
  { title: "Startup Pitch Night", location: "Amsterdam", date: "2026-02-22" },
  { title: "Film Festival Opening", location: "Cannes", date: "2026-05-05" },
  { title: "Jazz Night", location: "New Orleans", date: "2026-03-18" },
  { title: "Opera Gala", location: "Vienna", date: "2026-04-01" },

  { title: "Rock Legends Reunion", location: "Tokyo", date: "2026-06-14" },
  { title: "Esports Championship", location: "Seoul", date: "2026-07-08" },
  { title: "Art & Design Expo", location: "Milan", date: "2026-04-25" },
  { title: "Stand-up Comedy Night", location: "Toronto", date: "2026-03-30" },
  { title: "Food & Wine Festival", location: "Barcelona", date: "2026-05-12" },
  { title: "Marathon 2026", location: "Boston", date: "2026-04-20" },
  { title: "Theatre Premiere", location: "Broadway", date: "2026-02-27" },
  { title: "Tech Job Fair", location: "Austin", date: "2026-08-05" },
  { title: "Photography Workshop", location: "Reykjavik", date: "2026-03-06" },
  { title: "Blockchain Summit", location: "Dubai", date: "2026-09-02" },
  { title: "AI & Robotics Expo", location: "Singapore", date: "2026-10-15" }
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  await Event.deleteMany(); // clean old data
  await Event.insertMany(events);
  console.log("21 events seeded");
  process.exit();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
