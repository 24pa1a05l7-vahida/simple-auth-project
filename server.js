const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const db = require("./db");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
        if (result.length > 0) {
            res.send("Email already exists");
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            db.query(
                "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
                [username, email, hashedPassword],
                () => {
                    res.send("Signup successful");
                }
            );
        }
    });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
        if (result.length > 0) {
            const match = await bcrypt.compare(password, result[0].password);
            if (match) {
                res.redirect("/dashboard.html");
            } else {
                res.send("Invalid password");
            }
        } else {
            res.send("User not found");
        }
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});