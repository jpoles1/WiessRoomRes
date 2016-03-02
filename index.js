//Setup Express (our web server) and other express reqs
var express = require("express");
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser')
//Create express server
var app = express()
//Sets the template engine to be handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main.hbs'}));
app.set('view engine', 'handlebars');
//Sets up the parser which can parse information out of HTTP POST requests
app.use(bodyParser.urlencoded({ extended: true }));
//Serves all files in the res folder as static resources
app.use('/res', express.static('res'));
//Load .env file config (contains DB info)
require('dotenv').config();
//Load Mongoose (mongodb driver)
var mongoose = require('mongoose');
//Connect to server using URI from .env file
mongoose.connect(process.env.MONGOLAB_URI);
//Setup structure for Reservation
var Reservation = mongoose.model("Reservation", {
  reserver: String,
  email: String,
  why: String,
  room: String,
  eventName: String,
  start: Date,
  end: Date,
  confirmed: Boolean,
  rejected: [String],
  added: [String]
})
//Import routing from other files (under the routing foluder)
require("./routing/reserve_logic")(app, Reservation)
require("./routing/approve_logic")(app, Reservation)
//Set the port for the server
port = process.env.PORT || 8000;
//Tell server to start listening on above port
app.listen(port, function(){
  console.log("Web server started on port:",port)
  console.log("http://127.0.0.1:"+port)
});
