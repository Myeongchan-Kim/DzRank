var express = require('express');
var router = express.Router();
var util = require('util');

var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host : '127.0.0.1',
  database : 'fever',
  user : 'guest',
  password : '1234'
});

router.route('/').post(function (req, res){
  console.log(req.body);
  var query = "INSERT INTO test_temp (Aid, fever) values ('" + req.body.aid+"', " + req.body.fever+");";
  console.log(query);
  pool.query(query, function(err, rows, fields) {
    if (err){
      console.log(err);
      res.send("Error");
      return;
    }
    res.type('text/plain');
    res.send(JSON.stringify(rows));
  });
});

module.exports = router;
