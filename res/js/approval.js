getEvents = function(email){
  $.post("getEvents", {"email": email}, function(rawjson){
    jsondata = JSON.parse(rawjson);
    eventdata = jsondata["eventjson"]
    conflicted = jsondata["conflicted"]
    var source = $("#event-template").text();
    var template = Handlebars.compile(source);
    $("#conflict").html(template(jsondata));
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
      console.log(eventdata[event_id])
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
