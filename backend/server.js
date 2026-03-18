import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// PostgreSQL Setup
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "add_your_db_name_here",
  password: "add_your_password_here", 
  port: 5432,
});
db.connect();

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, '../images')));
app.use('/images/blogs', express.static(path.join(__dirname, '../images/blogs')));
app.use('/images/homepage', express.static(path.join(__dirname, '../images/homepage')));
app.use('/api/auth', express.static(path.join(__dirname, '../frontend')));
app.use(express.static(path.join(__dirname, "../frontend")));


// HTML Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

app.get("/signUp.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/signUp.html"));
});

app.get('/api/frontend/roadmaps/:page', (req, res) => {
  const page = req.params.page;
  res.sendFile(path.join(__dirname, '../frontend/roadmaps', page));
});


app.get("/test.html", (req, res) => {
  res.sendFile(path.join(__dirname, "/test.html"));
});

app.get("/dashboard.html", (req, res) => {
  res.sendFile(path.join(__dirname, "/dashboard.html"));
});

app.get("/blogs.html", (req, res) => {
  res.sendFile(path.join(__dirname, "/blogs.html"));
});

// REGISTER Route
app.post("/api/auth/register", async (req, res) => {
  const { name, email, username, password } = req.body;
  try {
    const check = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (check.rows.length > 0) {
      return res.status(400).json({ msg: "Email already exists. Try logging in." });
    }

    await db.query(
      "INSERT INTO users (name, email, username, password) VALUES ($1, $2, $3, $4)",
      [name, email, username, password]
    );

    res.sendFile(path.join(__dirname, "../frontend/test.html"));
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ msg: "Server error during registration" });
  }
});

// LOGIN Route
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    const user = result.rows[0];
    if (user.password !== password) {
      return res.status(401).json({ msg: "Incorrect password" });
    }
    res.sendFile(path.join(__dirname, "../frontend/dashboard.html"));

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error during login" });
  }
});

app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});
