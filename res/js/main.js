var updateTime = function(event){
  console.log(event.start.toISOString())
  $("#eventName").val(event["title"])
  $("#startTime").val(event.start.toISOString())
  $("#endTime").val(event.end.toISOString())
}
$(function(){
  var added = 0;
  $('#cal').fullCalendar({
    timezone: "America/Chicago",
    ignoreTimezone: false,
    header: {
			left: 'prev,next today',
			center: 'title',
			right: 'month,agendaWeek,agendaDay'
		},
    googleCalendarApiKey: "AIzaSyB3QonsQFYrMDQAi8lez34l0IMpOSPBmhg",
    events: {
        googleCalendarId: 'ig0tgdisvlpgbjsp9np5g03474@group.calendar.google.com',
        className: "gcal-event"
    },
    defaultView: "agendaWeek",
		selectable: true,
		selectHelper: true,
    editable: true,
    eventLimit: true, // allow "more" link when too many events
		select: function(start, end) {
      if(added==0){
  			var title = prompt('Event Title:');
  			var eventData;
  			if (title) {
  				eventData = {
  					title: title,
  					start: start,
  					end: end
  				};
          updateTime(eventData)
          console.log(eventData)
  				$('#cal').fullCalendar('renderEvent', eventData, true); // stick? = true
          added=1;
  			}
      }
			$('#cal').fullCalendar('unselect');
		},
    eventDrop: function(event){
      updateTime(event);
    },
    eventResize: function(event){
      updateTime(event);
    },
  })
  console.log("TEST")
})
