const mysql = require('mysql2');
require('dotenv').config();

const conn = mysql.createConnection({
  // host: process.env.HOST,
  // user: process.env.USER,
  // password: process.env.PASSWORD,
  // database : process.env.DATABASE
  host: "localhost",
  user: "user",
  database: "iari",
  password:"password"

});

conn.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
module.exports ={
    conn
}