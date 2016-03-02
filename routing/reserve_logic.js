module.exports = function(app, Reservation){
  function checkReservation(res_obj){
    validRes = 1;
    two_words_patt = new RegExp(/^([a-zA-Z]){1,64} ([a-zA-Z]){1,64}$/);
    why_patt = new RegExp(/\w{3,100}[ !.?,]?/);
    email_patt = new RegExp(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@rice\.edu$/);
    empty_event = "Add event using calendar"
    if(!two_words_patt.test(res_obj["reserver"])){
      validRes = "Please enter a valid full name. \"First Last\" or \"Last First\"."
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
      "rejected": [],
      "added": []
    }
    check = checkReservation(res_obj);
    if(check != 1){
      res.send("<div style='margin-top: 140px; font-size: 42pt; text-align: center;'>"+check+"<br><br>Returning you to the last page.</div><script>setTimeout(function(){window.history.back();}, 2*1000)</script>");
    }
    else{
      var newres = new Reservation(res_obj);
      newres.save(function (err) {
        if (err) console.log(err)
        console.log('Adding a new entry right meow');
      });
      res.send("<div style='margin-top: 140px; font-size: 42pt; text-align: center;'>Reservation submitted. Please check your email inbox for the confirmation link to finalize your reservation.</div><script>setTimeout(function(){location.replace('/');}, 2*1000)</script>")
    }
  });
  app.get("/", function(req, res){
    //res.send("Hello!")
    res.render("reserve.hbs", {layout: undefined})
  })
}
