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
    Reservation.find({"rejected": { $ne: email }/*, "added": { $ne: email }*/}, function(err, reslist){
      conflicted = [];
      no_conflict = [];
      conflict_list = []
      eventlist = {};
      reslist.forEach(function(res, res_index, res_array){
        not_added = res["added"].indexOf(email)==-1;
        conflict_group = [{editable: not_added, res: res}];
        if(conflicted.indexOf(res["_id"])==-1){
          reslist.slice(res_index+1).forEach(function(elem, check_index){
            check_index+=1;
            function isConflict(element, index, array) {
              return (element["res"]["start"]-elem["end"]<=0) && (elem["start"]-element["res"]["end"]<=0) && (elem["room"] == element["res"]["room"])
            }
            if(conflict_group.some(isConflict) && conflicted.indexOf(check_index)==-1){
              if(elem["added"].indexOf(email)==-1){
                conflicted.push(elem["_id"])
              }
              conflict_group.push({"editable": elem["added"].indexOf(email)==-1, "res": elem})
              if(conflict_group.length==2){
                if(not_added){conflicted.push(res["_id"])}
              }
            }
          })
          if(conflict_group.length>1){
            conflict_list.push(conflict_group);
          }
          else if(not_added){
            no_conflict.push(res);
          }
        }
        if(not_added){eventlist[res["_id"]] = res;}
      });
      console.log(conflict_list)
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
