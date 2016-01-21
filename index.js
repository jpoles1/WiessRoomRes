//Setup Express
var express = require("express")
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser')
var app = express()
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/res', express.static('res'));
app.set('view engine', 'handlebars');
//Load .env file config
require('dotenv').config();
//Load GCal API Libs
/*var google = require('googleapis');
var googleAuth = require('google-auth-library');
var auth = new googleAuth();
var oauth2Client = new auth.OAuth2(process.env.CLIENTID, process.env.SECRETID, "https://www.googleapis.com/auth/calendar");
*/

app.get("/", function(req, res){
  //res.send("Hello!")
  res.render("home.hbs")
})
app.post("/createRes", function(req, res){
  console.log(req.body)
  res.send("Form Sent.")
});
port = process.env.PORT || 8000;
app.listen(port, function(){
  console.log("Web server started on port:",port)
  console.log("http://127.0.0.1:"+port)
});
