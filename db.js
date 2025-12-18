const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "authdb"
});

db.connect(() => {
    console.log("Database connected");
});

module.exports = db;