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

var date_add = function( dateStr , addDay){
  var originDate = new Date(dateStr);
  var resultDate = new Date(dateStr);
  resultDate.setDate(originDate.getDate() + Number(addDay));
  return "" + resultDate.getFullYear() + '-' + (resultDate.getMonth()+1) + '-' + resultDate.getDate();
}

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

      cur_table = calc_trend(cur_table, old_table);
      res.type('text/json');
      res.send(JSON.stringify(cur_table));
    } )
  });
}

var calc_trend = function(cur_table, old_table){
  for( i in cur_table){
    var cur_dz = cur_table[i];
    cur_dz.trend = -1; //  default = -1 if new disease come up.
    for(j in old_table){
      var old_dz = old_table[j];
      if(cur_dz.dzNum == old_dz.dzNum){
        cur_dz.trend = old_dz.ratio / cur_dz.ratio;
        break;
      }
    }
  }
  return cur_table;
};

var regional_rank = function(req, res, region_num, start_date, end_date){
  var query = "CALL regional_rank_table('" + start_date + "', '" + end_date + "', "+ region_num +")";
  pool.query(query, function(err, rows, fields){
    if(err) throw err;
    var old_query = "CALL regional_rank_table('" + date_add(start_date, -7) + "', '" + date_add(end_date, -7) + "', "+ region_num +")";
    console.log(old_query);
    pool.query(old_query, function( err, old_rows, fields){
      if(err) throw err;
      var cur_table = rows[0];
      var old_table = old_rows[0];
      cur_table = calc_trend(cur_table, old_table);
      res.type('text/json');
      res.send(JSON.stringify(cur_table));
    } )
  });
}

router.route('/').get(function (req, res){
  res.type('text/plain');
  res.send("show")
});

router.route('/total').get( function(req, res){
  var date = new Date();
  var dateStr = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
  var weekAgoDateStr = date_add(dateStr, -13);
  load_rank_table(req, res, weekAgoDateStr, dateStr);
});

router.route('/total/:end_date').get(function(req, res){
  var dateStr = req.params.end_date;
  var weekAgoDateStr = date_add(dateStr, -13);
  load_rank_table(req, res, weekAgoDateStr, dateStr);
});

router.route('/total/:start_date/:end_date').get( function(req, res){
  load_rank_table(req, res, req.params.start_date, req.params.end_date);
});

router.route('/regional/:region_num').get(function(req, res){
  var date = new Date();
  var dateStr = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
  var weekAgoDateStr = date_add(dateStr, -13);
  regional_rank(req, res, req.params.region_num, weekAgoDateStr, dateStr);
});

router.route('/regional/:region_num/:end_date').get(function(req, res){
  var dateStr = req.params.end_date;
  var weekAgoDateStr = date_add(dateStr, -13);
  regional_rank(req, res, req.params.region_num, weekAgoDateStr, dateStr);
});

router.route('/regional/:region_num/:start_date/:end_date').get( function(req, res){
  regional_rank(req, res, req.params.region_num, req.params.start_date, req.params.end_date);
});


module.exports = router;
