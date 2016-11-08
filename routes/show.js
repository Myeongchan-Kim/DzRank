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
  //password : 'aOVG1L2xDC'
});

var load_rank_table = function(req, res, start_date, end_date){
  var query = "CALL show_dz_rank('" + start_date + "', '" + end_date + "')";
  console.log(query);
  pool.query(query, function(err, rows, fields){
    if(err) throw err;
    var old_query = "CALL show_dz_rank('" + date_add(start_date, -7) + "', '" + date_add(end_date, -7) + "')";
    console.log(old_query);
    pool.query(old_query, function( err, old_rows, fields){
      if(err) throw err;
      var cur_table = rows[0];
      var old_table = old_rows[0];

      for( i in cur_table){
        var cur_dz = cur_table[i];
        cur_dz.trend = -1; //  default = -1 if new disease come up.
        for(j in old_table){
          var old_dz = old_table[j];
          if(cur_dz.dzNum == old_dz.dzNum){
            cur_dz.trend = old_dz.ratio / cur_dz.ratio;
            console.log(cur_dz.trend);
            break;
          }
        }
      }

      res.type('text/json');
      res.send(JSON.stringify(cur_table));
    } )
  });
}

var date_add = function( dateStr , addDay){
  var originDate = new Date(dateStr);
  var resultDate = new Date(dateStr);
  resultDate.setDate(originDate.getDate() + Number(addDay));
  return "" + resultDate.getFullYear() + '-' + (resultDate.getMonth()+1) + '-' + resultDate.getDate();
}


router.route('/').get(function (req, res){
  res.type('text/plain');
  res.send("show")
});


router.route('/rank_table').get( function(req, res){
  var date = new Date();
  var dateStr = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
  var weekAgoDateStr = date_add(dateStr, -13);
  load_rank_table(req, res, weekAgoDateStr, dateStr);
});

router.route('/rank_table/:end_date').get(function(req, res){
  var dateStr = req.params.end_date;
  var weekAgoDateStr = date_add(dateStr, -13);
  load_rank_table(req, res, weekAgoDateStr, dateStr);
});

router.route('/rank_table/:start_date/:end_date').get( function(req, res){
  load_rank_table(req, res, req.params.start_date, req.params.end_date);
});

module.exports = router;
