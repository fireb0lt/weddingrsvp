var mysql = require ('mysql');
var express = require ('express');
var exphbs = require ('express-handlebars');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var Q = require('q');
var app = express();
var db_config = mysql.createConnection({
  //properties
  host : 'us-cdbr-iron-east-03.cleardb.net',
  user : 'bc5d91c9f9e722',
  password : '30ea785d',
  database : 'heroku_8ca4fc2f56bc78e',
});
var connection;




function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
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
  console.log(req.body);
  for (var i = 0; i < req.body.length; i++) {
    console.log(req.body[i].first);
    var query = 'UPDATE guest SET rsvp="'+req.body[i].rsvp+'" WHERE last = "' +req.body[i].last + '"AND first = "' + req.body[i].first + '"';
    connection.query(mysql.format(query), function(err,result){

    });
    res.send();
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
