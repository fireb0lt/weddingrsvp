var mysql = require ('mysql');
var express = require ('express');
var ejs = require ('ejs');
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
//
// var guests = {
//   last_name: 'joii',
//   first_name: 'poo',
//   rsvp: 1
// };
//
var helloe ="jo";
// var last_search = mysql.format("SELECT * FROM guest WHERE last=?", helloe);
// connection.query(last_search, function(err,result){
//   if (err){
//     console.log(err);
//     return;
//   } else {
//     console.log(result);
//   }
//
// })

app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.json()); // for parsing application/json


app.get('/', function (req,res) {
  connection.query("SELECT * FROM guest", function(error, rows, fields){
    if(!!error){
      console.log('Query Err');
    } else {
      console.log("Query Success");
      res.send(rows);
    }
  });
})
//Search backend
//

app.get('/rsvp', function (req, res){
    res.render('rsvp.html');
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




//
//     // function (){
//     //   console.log('Lol' + req.body.lastsearch);
//     //   value=5;
//     //   console.log(value);
//     // }
//
//     connection.query(mysql.format('SELECT * FROM guest WHERE last = ' + connection.escape(req.body.lastsearch) + ' AND first = ' + connection.escape(req.body.lastsearch)), function(err,result){
//       if (err) {
//       } else {
// console.log(result);
// res.send("complt");
//
//       }
// });

        // //Now query on last name, party_id
        // connection.query(mysql.format('SELECT * FROM guest WHERE last = ' + connection.escape(req.body.lastsearch) + ' AND party_id = ' + connection.escape(result[0]['party_id'])), function(err,result){
        //   if (err) {
        //
        //   } else {
        //     //Return the party
        //     var testVar=[];
        //     testVar=result;
        //     console.log(testVar);
        //     //Then send response
        //     res.send(testVar);
        //   }
        // });


  // }

app.listen(4000, function () {
  console.log('Example app listening on port 4000!');
});
