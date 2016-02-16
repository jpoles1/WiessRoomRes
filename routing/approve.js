module.exports = function(app, Reservation){
  //Load GCal API Libs
  /*var google = require('googleapis');
  var googleAuth = require('google-auth-library');
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(process.env.CLIENTID, process.env.SECRETID, "https://www.googleapis.com/auth/calendar");
  */
  app.get("/approve", function(req, res){
    Reservation.find({}, function(err, reslist){
      conflicted = [];
      conflict_list = []
      reslist.forEach(function(res, res_index){
        conflict_group = []
        if(conflicted.indexOf(res_index)==-1){
          reslist.slice(res_index+1).forEach(function(elem, check_index){
            if((res["start"]-elem["end"]<0) | (elem["start"]-res["end"]<0)){
              if(conflict_group.length==0){
                conflicted.push(res_index)
                conflict_group.push(res)
              }
              conflicted.push(check_index)
              conflict_group.push(elem)
            }
          })
          if(conflict_group.length>0){
            conflict_list.push(conflict_group);
          }
        }
      });
      console.log(conflict_list)
    })
    res.render("approve.hbs", {layout: undefined})
  })
}
