var mysql = require ('mysql');
var express = require ('express');
var exphbs = require ('express-handlebars');
var bodyParser = require('body-parser');
var Q = require('q');
var app = express();

var connection = mysql.createConnection({
  //properties
  host:'localhost',
  user:'root',
  password: 'root',
  database: 'hello',
  port: '3306'
});


connection.connect(function (error) {
    if (!!error){
      console.log('Error');
    } else {
      console.log('Connected');
    }
});



app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.json()); // for parsing application/json


app.get('/', function (req,res) {
  res.render('home');
});
//Search backend
//
//
// app.get('/rsvp', function (req, res){
//     res.render('rsvp');
// });
app.get('/launch', function (req, res){
  res.render('rsvp', {layout: false}, function (err, rsvp) {
    res.send(rsvp);
  });
});

app.post('/search', function(req, res, next){
  connection.query(mysql.format('SELECT * FROM guest WHERE last = ' + connection.escape(req.body.lastsearch) + ' AND first = ' + connection.escape(req.body.firstsearch)), function(err,result){
    if (result.length>0) {
      connection.query(mysql.format('SELECT * FROM guest WHERE last = ' + connection.escape(req.body.lastsearch) + ' AND party_id = ' + connection.escape(result[0].party_id)), function(err,result){
          res.send(result);
      });
    } else {
      res.send('Sorry, we can\'t find that name, try again!');
    }
  });
});


app.listen(4000, function () {
  console.log('Example app listening on port 4000!');
});
