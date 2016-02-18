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
})
