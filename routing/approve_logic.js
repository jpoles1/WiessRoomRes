module.exports = function(app, Reservation, sendEmail){
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
      Reservation.findByIdAndUpdate(event_id, { $push: { rejected: email}}, function (err, doc){
        if(err){
          res.send(err)
        }
        else{
          res_obj = doc._doc;
          x = function(res){
            return function(err){
              res.send("success")
            }
          }(res)
          var subject = "REJECTED: "+res_obj["room"]+' Reservation'
          var email_msg = "Hello "+res_obj["reserver"]
          var start = new Date(res_obj["start"])
          email_msg += ",<br>I regret to inform you that the following Wiess Room Reservation Request has been rejected:"
          email_msg += "<ul><li>Room: "+res_obj["room"]+"</li><li>Event Name: "+res_obj["eventName"]+"</li><li>Why?: "+res_obj["why"]+"</li><li>Date: "+start.toDateString()+"</ul>"
          email_msg += "You can send an email to <a href='mailto:wiessrooms@gmail.com'>wiessrooms@gmail.com</a> if you wish to discuss your rejection.<br>--<br>Thanks,<br>Wiess Room Res Team"
          sendEmail(res_obj["email"], subject, email_msg, x)
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
      Reservation.findByIdAndUpdate(event_id, { $push: { added: email} }, function (err, doc){
        if(err){
          res.send(err)
        }
        else{
          res_obj = doc._doc;
          x = function(res){
            return function(err){
              res.send("success")
            }
          }(res)
          var subject = "Approved: "+res_obj["room"]+' Reservation'
          var email_msg = "Hello "+res_obj["reserver"]
          var start = new Date(res_obj["start"])
          email_msg += ",<br>I'm glad to inform you that the following Wiess Room Reservation Request has been approved:"
          email_msg += "<ul><li>Room: "+res_obj["room"]+"</li><li>Event Name: "+res_obj["eventName"]+"</li><li>Why?: "+res_obj["why"]+"</li><li>Date: "+start.toDateString()+"</ul>"
          email_msg += "You can send an email to <a href='mailto:wiessrooms@gmail.com'>wiessrooms@gmail.com</a> if you need any further assistance.<br>--<br>Thanks,<br>Wiess Room Res Team"
          sendEmail(res_obj["email"], subject, email_msg, x)
        }
      });
    }
    else{
      res.send("FAILURE")
    }
  });
  app.post("/getEvents", function(req, res){
    var email = req.body.email;
    Reservation.find({"confirmed": true, "rejected": { $ne: email }/*, "added": { $ne: email }*/}, function(err, reslist){
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
