$(document).ready(() => {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: ['dayGrid'],
        display: 'Minty'
    });

    calendar.render();
});