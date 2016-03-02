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
//Load email client
var nodemailer = require('nodemailer');
var sendEmail = function (recipient, subject, message, cb){
  var login = 'smtps://'+process.env.GMAIL_UNAME+'%40gmail.com:'+process.env.GMAIL_PASS+'@smtp.gmail.com'
  var transporter = nodemailer.createTransport(login);
  var mailOptions = {
    "from": '"Wiess Room Reservations" <'+process.env.GMAIL_UNAME+'@gmail.com>', // sender address
    "to": res_obj["email"], // list of receivers
    "subject": subject, // Subject line
    "html":  message// html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      cb(err)
      return console.log(error);
    }
    else{
      console.log('Message sent: ' + info.response);
      cb(undefined);
    }
  });
}
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
require("./routing/reserve_logic")(app, Reservation, sendEmail)
require("./routing/approve_logic")(app, Reservation, sendEmail)
//Set the port for the server
port = process.env.PORT || 8000;
//Tell server to start listening on above port
app.listen(port, function(){
  console.log("Web server started on port:",port)
  console.log("http://127.0.0.1:"+port)
});
