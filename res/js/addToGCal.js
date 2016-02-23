//Function used to verify that the user's Google Calendar contains a calendar with the right name "calname"
var calname = "WiessRoomRes"
function calVerify(cb){
  gapi.client.load('calendar', 'v3', function(){
    var calid = "";
    var request = gapi.client.calendar.calendarList.list({});
    request.execute(function(resp){
      cal_list = resp["items"]
      cal_present = cal_list.some(function(context){
        if(context["summary"] == calname){
          calid = context["id"]
          return true;
        }
      })
      if(!cal_present){
        var request = gapi.client.calendar.calendars.insert({"summary": calname});
        request.execute(function(resp){
          alert("Added Calendar \"WiessRoomRes\" to your account.")
          console.log(resp)
          calid = resp["id"]
        });
      }
      //"rice.edu_mu7sh9vl9lrhja81i7mm3ifgkk@group.calendar.google.com"
      cb(calid);
    });
  });
}
function addToGCal(calid, start, end, eventName, email){
  console.log(calid)
  start = moment(start).add(6, "hours").format()
  end = moment(end).add(6, "hours").format()
  console.log(start,end)
  gapi.client.load('calendar', 'v3', function(){
    var request = gapi.client.calendar.events.insert({
      'calendarId': calid,
      "summary": eventName,
      'start': {
        'dateTime': start,
        'timeZone': 'America/Chicago',
      },
      'end': {
        'dateTime': end,
        'timeZone': 'America/Chicago',
      },
    });
    request.execute(function(resp) {
      console.log("Email:", email)
      if(resp["status"]=="confirmed"){
        $.post("/addedEvent", {"eventid": event_id, "email": email}, function(resp){
          console.log(resp);
          if(resp=="success"){
            window.location.reload();
            //getEvents(email);
            //initFullCall();
          }
        });
      }
      else{
        alert("Failed to add event to GCal")
      }
    });
  });
}
