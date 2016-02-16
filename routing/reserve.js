module.exports = function(app, Reservation){
  //Routing and logic for creating
  app.post("/createRes", function(req, res){
    console.log(req.body)
    var newres = new Reservation({ reserver: req.body.reserver, email: req.body.email, org: req.body.org, room: req.body.roomName, eventName: req.body.eventName, start: req.body.startTime, end: req.body.endTime, });
    newres.save(function (err) {
      if (err) console.log(err)
      console.log('Adding a new entry right meow');
    });
    res.send("Reservation submitted. Please check your email inbox for the confirmation link to finalize your reservation.")
  });
  app.get("/", function(req, res){
    //res.send("Hello!")
    res.render("home.hbs", {layout: undefined})
  })
}
