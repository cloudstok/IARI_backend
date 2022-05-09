const mysql = require('mysql2');
require('dotenv').config();

const conn = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DBUSER,
  database : process.env.DATABASE,
  password: process.env.PASSWORD
  // host: "localhost",
  // user: "root",
  // database: "farmers",
  // password:"1234"

});

conn.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
module.exports ={
    conn
}