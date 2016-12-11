var mysql = require ('mysql');
var express = require ('express');
var exphbs = require ('express-handlebars');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var Q = require('q');
var app = express();

var connection = mysql.createConnection({
  //properties
  host:'localhost',
  user:'root',
  password: 'root',
  database: 'wedding',
  port: '3307'
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
app.use(favicon(__dirname + '/public/favicon.ico'));


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
app.get('/addRsvp', function (req, res){
  res.render('rsvp_enter', {layout: false}, function (err, rsvp_enter) {
    res.send(rsvp_enter);
  });
});
app.post('/saversvp',function (req, res) {
  console.log(req.body);
  for (var i = 0; i < req.body.length; i++) {
    console.log(req.body[i].first);
    var query = 'UPDATE guest SET rsvp="'+req.body[i].rsvp+'" WHERE last = "' +req.body[i].last + '"AND first = "' + req.body[i].first + '"';
    connection.query(mysql.format(query), function(err,result){

    });
  }

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
