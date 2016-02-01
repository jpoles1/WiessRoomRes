module.exports = function(app, Reservation){
  //Routing and logic for creating 
  app.post("/createRes", function(req, res){
    console.log(req.body)
    var newres = new Reservation({ reserver: req.body.name, email: req.body.email,  room: req.body.roomName});
    newres.save(function (err) {
      if (err) console.log(err)
      console.log('Adding a new entry right meow');
    });
    res.send("Form Sent.")
  });
  app.get("/", function(req, res){
    //res.send("Hello!")
    res.render("home.hbs", {layout: undefined})
  })
}
