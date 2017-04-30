var mysql = require ('mysql');
var express = require ('express');
var exphbs = require ('express-handlebars');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var Q = require('q');
var app = express();
var config = require('./config.js').get(process.env.NODE_ENV);
var connection;
var party_id_name="";



function handleDisconnect() {
  connection = mysql.createConnection(config.db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();



app.set('port', (process.env.PORT || 5000));
//NEED ENV variable




app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.json()); // for parsing application/json
app.use(favicon(__dirname + '/public/favicon.ico'));
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

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
app.get('/whoiscoming', function (req, res){
  var rsvpYes;
  var rsvpNo;
  var rsvpNa;
  connection.query(mysql.format('SELECT COUNT(rsvp) AS rsvp_num FROM guest WHERE rsvp = 1'), function(err,result){
    rsvpYes=result[0].rsvp_num;
    connection.query(mysql.format('SELECT COUNT(rsvp) AS rsvp_no FROM guest WHERE rsvp = 0'), function(err,result){
      rsvpNo=result[0].rsvp_no;
      connection.query(mysql.format('SELECT COUNT(rsvp) AS rsvp_na FROM guest WHERE rsvp = 2'), function(err,result){
        rsvpNa=result[0].rsvp_na;
        res.render('whoiscoming', {yes_num:rsvpYes, no_num:rsvpNo,na_num:rsvpNa}, function (err, whoiscoming) {
          res.send(whoiscoming);
        });
      });
    });
  });
});

app.get('/addRsvp', function (req, res){
  res.render('rsvp_enter', {layout: false}, function (err, rsvp_enter) {
    res.send(rsvp_enter);
  });
});
app.get('/addFinish', function (req, res){
  res.render('rsvp_finish', {layout: false}, function (err, rsvp_finish) {
    res.send(rsvp_finish);
  });
});
app.post('/saversvp',function (req, res) {
    party_id_name=req.body[0].first;
    for (var i = 0; i < req.body.length; i++) {
      var query = 'UPDATE guest SET rsvp="'+req.body[i].rsvp+'" WHERE last = "' +req.body[i].last + '"AND first = "' + req.body[i].first + '"';
      connection.query(mysql.format(query), function(err,result){
        res.send();
      });
  }


});

app.post('/finalize',function (req, res) {
  var details = req.body;


  var query = 'UPDATE guest SET comment="'+details.message+'", '+'song="'+details.song+'", '+'food="'+details.food+'" WHERE last = "' +details.name + '" AND first = "' + party_id_name + '" ';
  connection.query(mysql.format(query), function(err,result){

  });

  res.send();
});
app.post('/search', function(req, res, next){
  connection.query(mysql.format('SELECT * FROM guest WHERE last = ' + connection.escape(req.body.lastsearch) + ' AND first = ' + connection.escape(req.body.firstsearch)), function(err,result){
    if (result.length>0) {
      connection.query(mysql.format('SELECT * FROM guest WHERE last = ' + connection.escape(req.body.lastsearch) + ' AND party_id = ' + connection.escape(result[0].party_id)), function(err,result){
          party_id_var = result[0].party_id;
          res.send(result);
      });
    } else {
      res.send('Sorry, we can\'t find that name, try again!');
    }
  });
});


//details
app.get('/det', function (req, res){
  res.render('details', {layout: false}, function (err, details) {
    res.send(details);
  });
});
