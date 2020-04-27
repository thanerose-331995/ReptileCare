$(document).ready(() => {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: ['dayGrid'],
        display: 'Minty',
    });

    calendar.render();


    calendar.on('dateClick', function (info) {
        console.log('clicked on ' + info.dateStr);
    });
});
