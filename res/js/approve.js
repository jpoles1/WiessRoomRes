Handlebars.registerHelper('time', function(context) {
  d = new Date(context);
  return d.toLocaleString();
});
function initFullCall(){
  $('#cal').fullCalendar({
    timezone: 'America/Chicago',
    ignoreTimezone: false,
    header: {
			left: 'prev,next today',
			center: 'title',
			right: 'month,agendaWeek,agendaDay'
		},
    googleCalendarApiKey: "AIzaSyD2ZI4IAjejeNnOUEKJIaAoEo5tyGuV1uc",
    events: {
        googleCalendarId: 'vtm3ngrte97bfumjc48pc2n1n0@group.calendar.google.com',
        className: "gcal-event"
    },
    defaultView: "agendaWeek",
		selectable: true,
    eventLimit: true, // allow "more" link when too many events
  })
}
getEvents = function(email){
  $.post("getEvents", {"email": email}, function(rawjson){
    jsondata = JSON.parse(rawjson);
    eventdata = jsondata["eventjson"]
    conflicted = jsondata["conflicted"]
    //Add Conflict Events
    var source = $("#conflict-template").html();
    var template = Handlebars.compile(source);
    $("#conflict").html(template(jsondata));
    //Add non-conflicted
    source = $("#noconflict-template").html();
    template = Handlebars.compile(source);
    $("#noconflict").html(template(jsondata));
    //Add badges to tabs
    $("#noconflict-badge").html(jsondata["no_conflict"].length)
    $("#conflict-badge").html(jsondata["conflicted"].length)
    for(ev_id in eventdata){
      ev = eventdata[ev_id]
      eventOpts = {
        "id": ev["_id"],
        "title": ev["eventName"]+"\n\n"+ev ["room"],
        "start": ev["start"],
        "end": ev["end"]
      }
      if(conflicted.indexOf(ev_id)==-1){
        eventOpts["color"] = "#008A40";
      }
      else{
        //eventOpts["color"] = "#8A004A";
        eventOpts["color"] = "#8A004A";
      }
      $('#cal').fullCalendar('renderEvent', eventOpts, true); // stick? = true
    }
    $(".btn-success").click(function(){
      event_id = ($(this).parent().parent().attr("id"));
      eventobj = eventdata[event_id];
      gapi.client.load('calendar', 'v3', calVerify(function(calid){
        return addToGCal(calid, eventobj["start"], eventobj["end"], eventobj["eventName"], email)
      }));
    })
    $(".btn-danger").click(function(){
      var event_id = $(this).parent().parent().attr("id");
      $.post("/rejectEvent", {"eventid": event_id, "email": email}, function(resp){
        console.log(email);
        window.location.reload();
        //getEvents(email);
        //initFullCall();
      });
    })
  });
}
$(function(){
  var added = 0;
  initFullCall();
  $("#tablist a").tab("show")
})
