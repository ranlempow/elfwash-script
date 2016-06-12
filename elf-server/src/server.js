var assert = require('assert');

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'test'
});
connection.connect();
connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;
  assert.equal(2, rows[0].solution);
  console.log('Connected correctly to mysql server');
});
connection.end();


var MongoClient = require('mongodb').MongoClient;

// Connection URL
var url = 'mongodb://localhost:27017/admin';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to mongodb server");
  db.close();
});




if (process.platform === "win32") {
  var rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on("SIGINT", function () {
    process.emit("SIGINT");
  });
}

process.on("SIGINT", function () {
  //graceful shutdown
  process.exit();
});


var http = require('http');
var handleRequest = function(request, response){
    response.end("hello world!");
}
var server = http.createServer(handleRequest);
server.listen(8080,'127.0.0.1',function(){
    console.log('Running HTTP server on http://127.0.0.1:8080/ ');
});