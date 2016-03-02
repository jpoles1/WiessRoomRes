var nodemailer = require('nodemailer');
module.exports = function(app, Reservation){
  var login = 'smtps://'+process.env.GMAIL_UNAME+'%40gmail.com:'+process.env.GMAIL_PASS+'@smtp.gmail.com'
  var transporter = nodemailer.createTransport(login);
  function checkReservation(res_obj){
    validRes = 1;
    two_words_patt = new RegExp(/^([a-zA-Z]){1,64} ([a-zA-Z]){1,64}$/);
    why_patt = new RegExp(/\w{3,100}[ !.?,]?/);
    email_patt = new RegExp(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@rice\.edu$/);
    empty_event = ""
    if(!two_words_patt.test(res_obj["reserver"])){
      validRes = "Please enter a valid full name \"First Last\"."
    }
    else if(!email_patt.test(res_obj["email"])){
      validRes = "Please enter a valid Rice email address (@rice.edu)"
    }
    else if(!why_patt.test(res_obj["why"])){
      validRes = "Please enter a reason why you want to reserve this room."
    }
    else if(res_obj["eventName"] == empty_event || res_obj["start"] == empty_event || res_obj["end"] == empty_event){
      validRes = "Event name/time must be set using the calendar"
    }
    return validRes;
  }
  //Routing and logic for creating
  app.post("/createRes", function(req, res){
    console.log(req.body)
    res_obj = {
      "reserver": req.body.reserver,
      "email": req.body.email,
      "why": req.body.why,
      "room": req.body.roomName,
      "eventName": req.body.eventName,
      "start": req.body.startTime,
      "end": req.body.endTime,
      "confirmed": false,
      "rejected": [],
      "added": []
    }
    check = checkReservation(res_obj);
    if(check != 1){
      res.render("notice.hbs", {
        "msg": "<script>var back = function(){window.history.back()}; setTimeout(function(){back()}, 3*1000);</script><span>Error:</span> "+check+"<br><br>Returning you to the <span onclick='back()'>last page</span>.</div>"
      });
    }
    else{
      var newres = new Reservation(res_obj);
      newres.save(function (err, result) {
        if (err) console.log(err)
        console.log('Adding a new entry right meow');
        var email_msg = '<b>Please click the below link to confirm your reservation request in the Wiess Room Reservation system.</b><br>';
        var confirmation_link = 'http://127.0.0.1:8000/confirmres?code='+result._id;
        email_msg += '<a href="'+confirmation_link+'">'+confirmation_link+'</a>';
        var mailOptions = {
          from: '"Wiess Room Reservations" <'+process.env.GMAIL_UNAME+'@gmail.com>', // sender address
          to: res_obj["email"], // list of receivers
          subject: 'Confirming Your Room Reservation at Wiess', // Subject line
          html:  email_msg// html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info){
          if(error){
            return console.log(error);
          }
          console.log('Message sent: ' + info.response);
        });

      });
      res.render("notice.hbs", {
        msg: "Reservation submitted. Please check your email inbox for the confirmation link to finalize your reservation.</div><script>setTimeout(function(){location.replace('/');}, 3*1000)</script>"
      });
    }
  });
  app.get("/confirmres", function(req, res){
    try{
      var confirm_code = req.body.code;
      Reservation.update({"_id": confirm_code}, {"confirmed": true}, function(err){
        if(err){
          console.log(err)
          res.render("notice.hbs", {
            msg: "Failed to confirm reservation. Please try again"
          })
        }
        else{
          res.render("notice.hbs", {
            msg: "Your reservation is confirmed and ready for approval, thank you.<br><br>Please wait while our secretary processes your reservation, you should receive and email when once your reservation has been approved/denied."
          })
        }
      });
    }
    catch(e){
      res.render("notice.hbs", {
        msg: "Failed to confirm reservation. Please try again"
      })
    }
  })
  app.get("/", function(req, res){
    res.render("reserve.hbs", {layout: undefined})
  })
}
