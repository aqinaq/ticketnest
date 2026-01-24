const express = require("express");
const { ObjectId } = require("mongodb");
const { getDB } = require("../database/mongo");

const router = express.Router();

function isValidId(id) {
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
}

// GET /api/events?location=&q=&sortBy=&order=&fields=
router.get("/", async (req, res) => {
  try {
    const db = getDB();

    const filter = {};
    if (req.query.location) {
      filter.location = { $regex: req.query.location, $options: "i" };
    }
    if (req.query.q) {
      filter.title = { $regex: req.query.q, $options: "i" };
    }

    const sort = {};
    if (req.query.sortBy) {
      sort[req.query.sortBy] = req.query.order === "desc" ? -1 : 1;
    }

    const projection = req.query.fields
      ? Object.fromEntries(req.query.fields.split(",").map((f) => [f.trim(), 1]))
      : undefined;

    const events = await db
      .collection("events")
      .find(filter, projection ? { projection } : undefined)
      .sort(Object.keys(sort).length ? sort : { date: 1 })
      .toArray();

    return res.status(200).json(events);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database error" });
  }
});

// GET /api/events/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) return res.status(400).json({ error: "Invalid id" });

  try {
    const db = getDB();
    const event = await db.collection("events").findOne({ _id: new ObjectId(id) });
    if (!event) return res.status(404).json({ error: "Event not found" });
    return res.status(200).json(event);
  } catch {
    return res.status(500).json({ error: "Database error" });
  }
});

// POST /api/events
router.post("/", async (req, res) => {
  const { title, location, date } = req.body;
  if (!title || !location || !date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return res.status(400).json({ error: "Invalid date" });
  }

  try {
    const db = getDB();
    const doc = { title, location, date: parsed };
    const result = await db.collection("events").insertOne(doc);
    return res.status(201).json({ _id: result.insertedId, ...doc });
  } catch {
    return res.status(500).json({ error: "Database error" });
  }
});

// PUT /api/events/:id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, location, date } = req.body;

  if (!isValidId(id)) return res.status(400).json({ error: "Invalid id" });
  if (!title || !location || !date) return res.status(400).json({ error: "Missing required fields" });

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return res.status(400).json({ error: "Invalid date" });

  try {
    const db = getDB();
    const result = await db.collection("events").updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, location, date: parsed } }
    );

    if (result.matchedCount === 0) return res.status(404).json({ error: "Event not found" });
    return res.status(200).json({ message: "Event updated successfully" });
  } catch {
    return res.status(500).json({ error: "Database error" });
  }
});

// DELETE /api/events/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) return res.status(400).json({ error: "Invalid id" });

  try {
    const db = getDB();
    const result = await db.collection("events").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: "Event not found" });
    return res.status(200).json({ message: "Event deleted successfully" });
  } catch {
    return res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
