const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/User");

function setSession(req, user) {
  req.session.userId = String(user._id);
  req.session.username = user.username;
  req.session.role = user.role;
}

// POST /signup
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).send("Missing fields");
    }
    if (String(password).length < 6) {
      return res.status(400).send("Password must be at least 6 characters");
    }

    const existing = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (existing) return res.status(409).send("Email already exists");

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: String(username).trim(),
      email: String(email).toLowerCase().trim(),
      passwordHash,
    });

    setSession(req, user);
    return res.redirect("/profile");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Signup failed");
  }
});

// POST /login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send("Missing fields");

    const user = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (!user) return res.status(401).send("Invalid email or password");

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).send("Invalid email or password");

    setSession(req, user);
    return res.redirect("/profile");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Login failed");
  }
});

// GET /auth/logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("sid");
    res.redirect("/");
  });
});
router.get("/me", (req, res) => {
  if (!req.session?.userId) return res.status(200).json({ loggedIn: false });
  res.json({
    loggedIn: true,
    userId: req.session.userId,
    username: req.session.username,
    role: req.session.role,
  });
});


module.exports = router;
