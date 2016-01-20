$(function(){
  $('#cal').fullCalendar({
    header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},
      defaultView: "agendaWeek",
			selectable: true,
			selectHelper: true,
      editable: true,
      eventLimit: true, // allow "more" link when too many events
			select: function(start, end) {
				var title = prompt('Event Title:');
				var eventData;
				if (title) {
					eventData = {
						title: title,
						start: start,
						end: end
					};
          console.log(eventData)
					$('#cal').fullCalendar('renderEvent', eventData, true); // stick? = true
				}
				$('#cal').fullCalendar('unselect');
			},
      events: []
  })
  console.log("TEST")

})
