// server.js
const path = require("path");
const fs = require("fs");
const fsp = require("fs/promises");
const express = require("express");
const session = require("express-session");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const { connectDB } = require("./database/mongo");
const eventsRoutes = require("./routes/events");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Parsing ----------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- Logger ----------
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ---------- Sessions ----------
app.set("trust proxy", 1);
app.use(
  session({
    name: "sid",
    secret: process.env.SESSION_SECRET || "dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
    },
  })
);

// ---------- Static assets ----------
app.use(express.static(path.join(__dirname, "public")));

// ---------- Helpers ----------
const sendView = (res, file) =>
  res.sendFile(path.join(__dirname, "views", file));

async function ensureJsonArrayFile(filePath) {
  if (!fs.existsSync(filePath)) {
    await fsp.mkdir(path.dirname(filePath), { recursive: true });
    await fsp.writeFile(filePath, "[]", "utf8");
  }
}

// ---------- Pages ----------
app.get("/", (req, res) => sendView(res, "index.html"));

app.get("/info", (req, res) => sendView(res, "info.html"));
app.get("/info.html", (req, res) => sendView(res, "info.html"));

app.get("/item", (req, res) => sendView(res, "item.html"));
app.get("/item.html", (req, res) => sendView(res, "item.html"));

app.get("/login", (req, res) => sendView(res, "login.html"));
app.get("/login.html", (req, res) => sendView(res, "login.html"));

app.get("/signup", (req, res) => sendView(res, "signup.html"));
app.get("/signup.html", (req, res) => sendView(res, "signup.html"));

app.get("/profile", (req, res) => sendView(res, "profile.html"));
app.get("/profile.html", (req, res) => sendView(res, "profile.html"));

// Optional redirects
app.get("/about", (req, res) => res.redirect("/info"));
app.get("/contact", (req, res) => res.redirect("/info"));

// ---------- Contact form ----------
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).send("Missing fields");
    }

    const filePath = path.join(__dirname, "data", "messages.json");
    await ensureJsonArrayFile(filePath);

    const messages = JSON.parse(await fsp.readFile(filePath, "utf8"));
    messages.push({
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    });

    await fsp.writeFile(filePath, JSON.stringify(messages, null, 2));
    res.redirect("/info");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to save message");
  }
});

// ---------- Auth ----------
app.use("/auth", authRoutes);

app.get("/auth/me", (req, res) => {
  if (!req.session?.userId) {
    return res.status(401).json({ loggedIn: false });
  }
  res.json({
    loggedIn: true,
    userId: req.session.userId,
    username: req.session.username,
  });
});

// If forms still POST to /login or /signup
app.post("/login", (req, res) => res.redirect(307, "/auth/login"));
app.post("/signup", (req, res) => res.redirect(307, "/auth/signup"));

// ---------- API ----------
app.use("/api/events", eventsRoutes);

app.get("/api/info", (req, res) => {
  res.json({
    project: "TicketNest",
    version: "1.0.0",
  });
});

// ---------- 404 ----------
app.use((req, res) => {
  if (req.originalUrl.startsWith("/api") || req.originalUrl.startsWith("/auth")) {
    return res.status(404).json({ error: "Route not found" });
  }
  return sendView(res, "404.html");
});

// ---------- Start ----------
connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`✅ Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed", err);
    process.exit(1);
  });
