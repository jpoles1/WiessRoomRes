//Function used to verify that the user's Google Calendar contains a calendar with the right name "calname"
var calname = "WiessRoomRes"
function calVerify(){
  var request = gapi.client.calendar.calendarList.list({});
  request.execute(function(resp){
    cal_list = resp["items"]
    cal_present = cal_list.some(function(context){
      return context["summary"] == calname
    })
    if(!cal_present){
      var request = gapi.client.calendar.calendars.insert({"summary": calname});
      request.execute(function(resp){
        alert("Added Calendar \"WiessRoomRes\" to your account.")
      });
    }
  });
}
function addToGCal(event_data){

  var request = gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'orderBy': 'startTime'
  });

  request.execute(function(resp) {
    var events = resp.items;
    appendPre('Upcoming events:');

    if (events.length > 0) {
      for (i = 0; i < events.length; i++) {
        var event = events[i];
        var when = event.start.dateTime;
        if (!when) {
          when = event.start.date;
        }
        appendPre(event.summary + ' (' + when + ')')
      }
    } else {
      appendPre('No upcoming events found.');
    }

  });
}
