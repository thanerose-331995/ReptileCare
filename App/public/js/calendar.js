// var today = (new Date()).toISOString();
// today = today.split("T")[0];
// console.log(today);

// $('#calendar').fullCalendar({
//     header: {
//         left: 'prev,next',
//         center: 'title',
//         right: 'today',
//     },
//     defaultDate: today,
//     editable: true,
//     eventLimit: true,
//     title: "check",
//     events: [{
//         title: 'Simple static event',
//         start: '2018-11-16',
//         description: 'Super cool event'
//     },
//     ],
//     dayClick: function (date, jsEvent, view) {
//         var date = moment(date);
//         console.log(date);
//         $('#calendar').fullCalendar('renderEvent', {
//             title: 'Dynamic event from date click',
//             start: date,
//             allDay: true
//         });
//         //   if (date.isValid()) {
//         //     $('#calendar').fullCalendar('renderEvent', {
//         //       title: 'Dynamic event from date click',
//         //       start: date,
//         //       allDay: true
//         //     });
//         //   } else {
//         //     alert('Invalid');
//         //   }
//     },
// });

$(document).ready(() => {
    displayCalendar(new Date());
})

function displayCalendar(date) {
    $(".calendar").empty();
    const months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const days = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];

    var html = `
    <h5 id="current-month">${(months[date.getMonth()])}</h5>
    <p id="current-year">${date.getFullYear()}<p>
    `;
    $("#title").html(html);

    $("#title").attr("class", (date.toISOString()).split("T")[0]);

    days.forEach((day, i) => {
        var html = `
        <div class="weekday" id="day-${day}">${day}</div>
    `;
        $(".calendar").append(html);
        $("#day-" + day).css("grid-column-start", (i + 1));
    })


    for (var i = 0; i < 31; i++) {
        var newDate = new Date(date.getFullYear(), date.getMonth(), (i + 1));
        if (newDate.getMonth() == date.getMonth()) {
            dateData(newDate);
        }
    }

    var today = new Date();
    if (date.getMonth() == today.getMonth() && date.getFullYear() == today.getFullYear()) {
        var day = today.getDate().toString();
        $("#day-" + day).css("background-color", "lightblue");
    }

}

function dateData(date) {
    //check for event here

    var html = `
        <div class="date" id="day-${date.getDate()}">${date.getDate()}</div>
    `;
    $(".calendar").append(html);
    $("#day-" + date.getDate()).css("grid-column-start", (date.getDay() + 1));
}

$("#next").click(e => {
    var newDate = new Date($("#title").attr("class"));
    newDate.setMonth(newDate.getMonth() + 1);
    displayCalendar(newDate);
})

$("#prev").click(e => {
    var newDate = new Date($("#title").attr("class"));
    newDate.setMonth(newDate.getMonth() - 1);
    displayCalendar(newDate);
})
$("#go-today").click(e => {
    displayCalendar(new Date());
})

$('.calendar').click(e => {
    if ($(e.target).attr("class") == "date") {
        console.log($(e.target).html());
    }
});