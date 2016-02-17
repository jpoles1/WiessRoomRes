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
      no_conflict = [];
      conflict_list = []
      reslist.forEach(function(res, res_index){
        conflict_group = [res]
        if(conflicted.indexOf(res_index)==-1){
          reslist.slice(res_index+1).forEach(function(elem, check_index){
            check_index+=1;
            function isConflict(element, index, array) {
              return (element["start"]-elem["end"]<=0) && (elem["start"]-element["end"]<=0)
            }
            if(conflict_group.some(isConflict) && conflicted.indexOf(check_index)==-1){
              conflicted.push(check_index)
              conflict_group.push(elem)
              if(conflict_group.length==2){
                conflicted.push(res_index)
              }
            }
          })
          console.log(conflicted)
          if(conflict_group.length>1){
            conflict_list.push(conflict_group);
          }
          else{
            no_conflict.push(res);
          }
        }
      });
      res.render("approve.hbs", {layout: undefined, "no_conflict": no_conflict, "conflict_list": conflict_list})
    })
  })
}
