const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;
if (!uri) throw new Error("Missing MONGO_URI in environment variables");

const client = new MongoClient(uri);
let db;

async function connectDB() {
  if (db) return db;

  await client.connect();
  db = client.db("ticketnest");
  console.log("Connected to MongoDB");

  const eventsCount = await db.collection("events").countDocuments();
  if (eventsCount === 0) {
    await db.collection("events").insertMany([
      { title: "Live Concert", location: "Seoul Arena", date: new Date("2026-03-10") },
      { title: "Music Festival", location: "Busan Beach", date: new Date("2026-04-15") },
      { title: "World Cup 2026", location: "Doha Stadium", date: new Date("2026-06-12") },
      { title: "Theatre Night", location: "Daegu Theater", date: new Date("2026-02-20") },
      { title: "Indie Film Festival", location: "Seoul Cinema", date: new Date("2026-05-05") },
      { title: "Jazz Evening", location: "Incheon Hall", date: new Date("2026-07-01") },
    ]);
    console.log("Initial events seeded.");
  }

  return db;
}

function getDB() {
  if (!db) throw new Error("DB not connected (call connectDB first)");
  return db;
}

module.exports = { connectDB, getDB };
