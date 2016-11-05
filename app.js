var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host : 'localhost',
  database : 'fever',
  user : 'guest',
  password : "1234"
});

var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({ defaultLayout:'main'}); //템플릿
var bodyparser = require('body-parser').urlencoded({extended:true}); //form 평문전달
var util = require('util');
var collectionList =[];


app.use(bodyparser);
app.use('/static', express.static(__dirname + '/static'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

app.get('/', function (req, res){
  res.send("Hello");
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

      res.type('text/plain');
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

app.get('/load_rank_table', function(req, res){
  var date = new Date();
  var dateStr = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
  var weekAgoDateStr = date_add(dateStr, -13);
  load_rank_table(req, res, weekAgoDateStr, dateStr);
});

app.get('/load_rank_table/:end_date', function(req, res){
  var dateStr = req.params.end_date;
  var weekAgoDateStr = date_add(dateStr, -13);
  load_rank_table(req, res, weekAgoDateStr, dateStr);
});

app.get('/load_rank_table/:start_date/:end_date', function(req, res){
  load_rank_table(req, res, req.params.start_date, req.params.end_date);
});

app.use(function (req, res){
  res.type('text/plain');
  res.status('404');
  res.send('404 - Page not found');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('text/plain');
  res.status('500');
  res.send('500 - Server Error');
});

app.listen(app.get('port'), function (){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
