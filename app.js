const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
// Database connection

mongoose
  .connect(
    "mongodb+srv://Adham:dMlCHuNKiiuzt7Kq@cluster0.94gew.mongodb.net/ASSystem"
  )
  .then(() => console.log("Database : Stable"))
  .catch((err) => console.log(`Database : Not-Stable \n${err.message}`));

// Schemas and Models
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  type: { type: String, required: true }, // 'student' or 'teacher'
  createdAt: { type: Date, default: Date.now },
  coins: { type: Number, default: 0 },
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  duration: {
    type: Number, // Duration in hours or as specified
    required: true,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const User = mongoose.model("User", userSchema);
const Course = mongoose.model("Course", userSchema);
// Middleware setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "views")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session configuration
app.use(
  session({
    secret: "SECRET",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Routes
app.get("/", (req, res) => res.redirect("/gate"));

app.get("/gate", (req, res) => {
  res.render("gate", {
    user: req.session,
  });
});

app.get("/dashboard", async (req, res) => {
  try {
    let i = 1;
    const users = await User.find();
    const courses = await Course.find()
      .populate("teacher", "username") // Populate teacher's username
      .populate("students", "username"); // Populate students' usernames

    res.render("dashboard", { users, courses, i });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
});
// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid login" });
    }

    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.email = user.email;
    req.session.type = user.type;

    res.status(200).json({ message: "Login successful", redirect: "/profile" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
    console.log(error);
  }
});

app.post("/teacher-login", async (req, res) => {
  const { id, password } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({ id });
    console.log(user);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "INVALID Contact IT Department." });
    }

    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.email = user.email;
    req.session.type = user.type;

    res.status(200).json({ message: "Login successful", redirect: "/profile" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
    console.log(error);
  }
});

// Signup
app.post("/signup", async (req, res) => {
  const { full_name, email, password, type } = req.body;
  console.log(req.body);
  try {
    if (
      (await User.findOne({ email })) ||
      (await User.findOne({ full_name }))
    ) {
      return res
        .status(400)
        .json({ error: "Email or Username already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await new User({
      username: full_name,
      email,
      password: hashedPassword,
      type,
    }).save();
    res.status(201).json({ message: "Registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
    console.log(error);
  }
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Could not log out" });
    }
    res.redirect("/gate");
  });
});

// Profile
app.get("/profile", async (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/gate");
  }

  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.render("profile", {
      username: user.username,
      email: user.email,
      type: user.type,
      coins: user.coins,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
    console.error(error);
  }
});

app.get("/home", (req, res) => {
  res.render("home");
});

// 404 route
app.use((req, res) => {
  res.status(404).render("404");
});

app.listen(3030, () => {
  console.log("App : Stable");
});
