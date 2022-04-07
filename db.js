var mysql = require('mysql2');

var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database : "inventory"

});

conn.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
module.exports ={
    conn
}