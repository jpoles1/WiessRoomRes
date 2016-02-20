module.exports = function(app, Reservation){
  //Load GCal API Libs
  /*var google = require('googleapis');
  var googleAuth = require('google-auth-library');
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(process.env.CLIENTID, process.env.SECRETID, "https://www.googleapis.com/auth/calendar");
  */
  app.get("/gcal", function(req, res){
    res.render("gcal.hbs");
  });
  app.post("/rejectEvent", function(req, res){
    var event_id = req.body.eventid;
    var email = req.body.email;
    if(event_id && email){
      Reservation.update({"_id": event_id}, { $push: { rejected: email} }, function (err){
        if(err){
          res.send(err)
        }
        else{
          res.send("success")
        }
      });
    }
    else{
      res.send("FAILURE")
    }
  });
  app.post("/addedEvent", function(req, res){
    var event_id = req.body.eventid;
    var email = req.body.email;
    if(event_id && email){
      Reservation.update({"_id": event_id}, { $push: { added: email} }, function (err){
        if(err){
          res.send(err)
        }
        else{
          res.send("success")
        }
      });
    }
    else{
      res.send("FAILURE")
    }
  });
  app.post("/getEvents", function(req, res){
    var email = req.body.email;
    Reservation.find({"rejected": { $ne: email }, "added": { $ne: email } }, function(err, reslist){
      conflicted = [];
      no_conflict = [];
      conflict_list = []
      eventlist = {};
      reslist.forEach(function(res, res_index){
        conflict_group = [res];
        if(conflicted.indexOf(res["_id"])==-1){
          reslist.slice(res_index+1).forEach(function(elem, check_index){
            check_index+=1;
            function isConflict(element, index, array) {
              return (element["start"]-elem["end"]<=0) && (elem["start"]-element["end"]<=0)
            }
            if(conflict_group.some(isConflict) && conflicted.indexOf(check_index)==-1){
              conflicted.push(elem["_id"])
              conflict_group.push(elem)
              if(conflict_group.length==2){
                conflicted.push(res["_id"])
              }
            }
          })
          if(conflict_group.length>1){
            conflict_list.push(conflict_group);
          }
          else{
            no_conflict.push(res);
          }
        }
        eventlist[res["_id"]] = res;
      });
      res.json(JSON.stringify({
        "eventjson": eventlist,
        "no_conflict": no_conflict,
        "conflict_list": conflict_list,
        "conflicted": conflicted
      }))
    })
  })
  app.get("/approve", function(req, res){
    res.render("approve.hbs", {layout: undefined, "OAuthAPIKEY": "1079920800108-smb06uetbjh9vosevmflrva9crohot6g.apps.googleusercontent.com"})
  })
}
