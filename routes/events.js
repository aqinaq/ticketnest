// routes/events.js
const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

function requireAuth(req, res, next) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}
async function requireOwnerOrAdmin(req, res, next) {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Not found" });

    const isOwner = String(event.owner) === String(req.session.userId);
    const isAdmin = req.session.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}



async function requireOwner(req, res, next) {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Not found" });

    if (String(event.owner) !== String(req.session.userId)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

// GET /api/events or /api/events?q=term  (PUBLIC)
router.get("/", async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();

    const filter = q
      ? {
          $or: [
            { title: { $regex: q, $options: "i" } },
            { location: { $regex: q, $options: "i" } },
          ],
        }
      : {};

    const events = await Event.find(filter).sort({ date: 1, createdAt: -1 });
    res.json(events);
  } catch (err) {
    console.error("GET /api/events error:", err);
    res.status(500).json({ error: "Failed to load events" });
  }
});

// POST /api/events  (LOGIN REQUIRED)
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, location, date } = req.body;

    if (!title || !location || !date) {
      return res.status(400).json({ error: "title, location, date are required" });
    }

    const dt = new Date(date);
    if (Number.isNaN(dt.getTime())) {
      return res.status(400).json({ error: "Invalid date" });
    }

    const created = await Event.create({
      title: String(title).trim(),
      location: String(location).trim(),
      date: dt,
      owner: req.session.userId,
    });

    res.status(201).json(created);
  } catch (err) {
    console.error("POST /api/events error:", err);
    res.status(500).json({ error: "Failed to create event" });
  }
  const created = await Event.create({
  title: String(title).trim(),
  location: String(location).trim(),
  date: dt,
  owner: req.session.userId
});
});

// PUT /api/events/:id  (LOGIN REQUIRED)
router.put("/:id", requireAuth, requireOwnerOrAdmin, async (req, res) => {
  try {
    const { title, location, date } = req.body;

    if (!title || !location || !date) {
      return res.status(400).json({ error: "title, location, date are required" });
    }

    const dt = new Date(date);
    if (Number.isNaN(dt.getTime())) {
      return res.status(400).json({ error: "Invalid date" });
    }

    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      {
        title: String(title).trim(),
        location: String(location).trim(),
        date: dt,
      },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: "Event not found" });
    res.json(updated);
  } catch (err) {
    console.error("PUT /api/events/:id error:", err);
    res.status(500).json({ error: "Failed to update event" });
  }
});

// DELETE /api/events/:id  (LOGIN REQUIRED)
router.delete("/:id", requireAuth, requireOwnerOrAdmin, async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Event not found" });
    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/events/:id error:", err);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

module.exports = router;
