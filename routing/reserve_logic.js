module.exports = function(app, Reservation, sendEmail){
  function checkReservation(res_obj){
    validRes = 1;
    max_time = 4; //hours
    two_words_patt = new RegExp(/^([a-zA-Z]){1,64} ([a-zA-Z]){1,64}$/);
    why_patt = new RegExp(/\w{3,100}[ !.?,]?/);
    email_patt = new RegExp(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@rice\.edu$/);
    empty_event = ""
    var end = new Date(res_obj["end"])
    var start = new Date(res_obj["start"])
    if(!two_words_patt.test(res_obj["reserver"])){
      validRes = "Please enter a valid full name \"First Last\"."
    }
    else if(!email_patt.test(res_obj["email"])){
      validRes = "Please enter a valid Rice email address (@rice.edu) where we can send a confirmation email."
    }
    else if(!why_patt.test(res_obj["why"])){
      validRes = "Please enter a reason why you want to reserve this room."
    }
    else if(res_obj["eventName"] == empty_event || res_obj["start"] == empty_event || res_obj["end"] == empty_event){
      validRes = "Event name/time must be set using the calendar"
    }
    else if(end - start > max_time*60*60*1000){
      validRes = "Event must not be longer than "+max_time+" hours."
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
        var email_msg = '<b>Please click the below link to confirm your reservation request in the Wiess Room Reservation system.</b><br><br>';
        var confirmation_link = 'http://127.0.0.1:8000/confirmres?code='+result._id;
        email_msg += '<a href="'+confirmation_link+'">'+confirmation_link+'</a>';
        x = function(res){
          return function(){
            res.render("notice.hbs", {
              msg: "Reservation submitted. <span>Please check your email for the confirmation link</span> to finalize your reservation.</div><script>setTimeout(function(){location.replace('/');}, 3*1000)</script>"
            });
          }
        }(res)
        sendEmail(res_obj["email"], 'Confirming Your Room Reservation at Wiess', email_msg, x)
      });

    }
  });
  app.get("/confirmres", function(req, res){
    try{
      var confirm_code = req.query.code;
      Reservation.update({"_id": confirm_code}, {"confirmed": true}, function(err){
        if(err){
          console.log(err)
          res.render("notice.hbs", {
            msg: "<span>Failed</span> to confirm reservation. Please try again"
          })
        }
        else{
          res.render("notice.hbs", {
            msg: "Thank you, your reservation is <span>confirmed and ready for approval.</span><br><br>Please wait while our secretary processes your reservation, <span>you should receive an email</span> when once your reservation has been approved/denied."
          })
        }
      });
    }
    catch(e){
      res.render("notice.hbs", {
        msg: "<span>Failed</span> to confirm reservation. Please try again"
      })
    }
  })
  app.get("/", function(req, res){
    res.render("reserve.hbs", {layout: undefined})
  })
}
