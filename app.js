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
    res.type('text/plain');
    res.send(JSON.stringify(rows));
  });
}

app.get('/load_rank_table', function(req, res){
  var date = new Date();
  var weekAgoDate = new Date();
  weekAgoDate.setDate(date.getDate() - 6);
  var dateStr = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
  var weekAgoDateStr = weekAgoDate.getFullYear() + '-' + (weekAgoDate.getMonth()+1) + '-' + weekAgoDate.getDate();
  load_rank_table(req, res, weekAgoDateStr, dateStr);
});

app.get('/load_rank_table/:end_date', function(req, res){
  var dateStr = req.params.end_date;
  var weekAgoDate = new Date(dateStr);
  weekAgoDate.setDate(weekAgoDate.getDate() - 6);
  var weekAgoDateStr = weekAgoDate.getFullYear() + '-' + (weekAgoDate.getMonth()+1) + '-' + weekAgoDate.getDate();
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
