require("dotenv").config();

const express = require("express");
const path = require("path");
const { connectDB } = require("./database/mongo");
const eventsRoutes = require("./routes/events");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "views", "index.html")));
app.get("/about", (req, res) => res.sendFile(path.join(__dirname, "views", "about.html")));
app.get("/contact", (req, res) => res.sendFile(path.join(__dirname, "views", "contact.html")));
app.get("/search.html", (req, res) => res.sendFile(path.join(__dirname, "views", "search.html")));
app.get("/item.html", (req, res) => res.sendFile(path.join(__dirname, "views", "item.html")));

app.use("/api/events", eventsRoutes);

app.get("/api/info", (req, res) => {
  res.status(200).json({
    project: "TicketNest",
    description: "Online ticket booking system",
    version: "1.0.0",
  });
});

app.use((req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(404).json({ error: "API route not found" });
  }
  return res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });
