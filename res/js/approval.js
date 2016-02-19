Handlebars.registerHelper('time', function(context) {
  d = new Date(context);
  return d.toLocaleString();
});
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
    var source = $("#noconflict-template").html();
    var template = Handlebars.compile(source);
    $("#noconflict").html(template(jsondata));
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
      console.log(eventobj)
      gapi.client.load('calendar', 'v3', calVerify(function(calid){
        return addToGCal(calid, eventobj["start"], eventobj["end"], eventobj["eventName"])
      }));
    })
    $(".btn-danger").click(function(){
      var event_id = $(this).parent().parent().attr("id");
      $.post("/rejectEvent", {"eventid": event_id, "email": email}, function(resp){
        console.log(resp);
        if(resp=="success") window.location.reload();
      });
    })
  });
}
$(function(){
  var added = 0;
  $('#cal').fullCalendar({
    timezone: 'America/Chicago',
    header: {
			left: 'prev,next today',
			center: 'title',
			right: 'month,agendaWeek,agendaDay'
		},
    googleCalendarApiKey: "AIzaSyD3e2q0eBsNFHE0S3S1lT1w-X4K_JCiyS0",
    events: {
        googleCalendarId: 'ig0tgdisvlpgbjsp9np5g03474@group.calendar.google.com',
        className: "gcal-event"
    },
    defaultView: "agendaWeek",
		selectable: true,
    eventLimit: true, // allow "more" link when too many events
  })
  $("#tablist a").tab("show")
})
