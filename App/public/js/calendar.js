// ALL CALENDAR FUNCTIONALITY

$(document).ready(() => {
    displayCalendar(new Date());

})

// -------- SETUP ------------

// READ DATA AND DISPLAY THE CALENDAR UI
function displayCalendar(date) {

    var events = [];
    const user = JSON.parse(sessionStorage.user);
    db.collection("calendar").where("user", "==", user.uid).get().then(snapshot => {
        snapshot.forEach(snap => {
            var event = snap.data();
            event.id = snap.id;
            events.push(event);
        });
        console.log(events);
        // SET UP CALENDAR UI
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
            $("#day-" + day).css("grid-column-start", i + 1);
        })


        for (var i = 0; i < 31; i++) {
            var newDate = new Date(date.getFullYear(), date.getMonth(), (i + 1));
            if (newDate.getMonth() == date.getMonth()) {
                //check if any events match this day
                var thisEvent = {};
                events.forEach(e => {
                    var eDate = new Date(e.date);
                    if(eDate.toLocaleDateString() == newDate.toLocaleDateString()){
                        thisEvent = Object.assign(e);
                    };
                })
                //send to display
                dateData(newDate, thisEvent);
            }
        }
        var today = new Date();
        if (date.getMonth() == today.getMonth() && date.getFullYear() == today.getFullYear()) {
            var day = today.getDate().toString();
            $("#day-" + day).css("background-color", "lightblue");
        }
    })
    // console.log(events);



}
// EACH DAY DISPLAY
function dateData(date, event) {

    var html = `
        <div class="date" id="day-${date.getDate()}">${date.getDate()}</div>
    `;
    $(".calendar").append(html);
    if ((Object.keys(event).length) != 0) {
        // console.log(event.tag);
        $("#day-" + (date.getDate())).attr("event", JSON.stringify(event));
        var tag = (event.tag).replace(" ", "-");
        $("#day-" + (date.getDate())).addClass(tag);
    }
    $("#day-" + date.getDate()).css("grid-column-start", (date.getDay()));
}

// -------- INTERACTION ------

// NEXT MONTH
$("#next").click(e => {
    var newDate = new Date($("#title").attr("class"));
    newDate.setMonth(newDate.getMonth() + 1);
    displayCalendar(newDate);
})
// PREV MONTH
$("#prev").click(e => {
    var newDate = new Date($("#title").attr("class"));
    newDate.setMonth(newDate.getMonth() - 1);
    displayCalendar(newDate);
})
// TODAY
$("#go-today").click(e => {
    displayCalendar(new Date());
})
// CAL CLICK
$('.calendar').click(e => {
    //if click day display event
    if (($(e.target).attr("class")).includes("date")) {
        if(typeof $(e.target).attr("event") != "undefined"){
            displayEvent(JSON.parse($(e.target).attr("event")));
        }
    }
});

// -------- EVENTS -----------

// --> READ

// EVENT MODAL HANDLE
function displayEvent(event){
    delete event.user;
    $("#e-info-data").empty();
    for (var key in event) {
        if(key != "id"){
            var name = key.replace(key[0], key[0].toUpperCase());
            (key == "title") ? $("#e-info-title").html(event[key]) : $("#e-info-data").append(`<p>${name}: ${event[key]}</p>`);
        }
    }
    var tag = (event.tag).replace(" ", "-");    
    $("#e-info-data").attr("class", tag);
    $("#e-info-data").attr("event", JSON.stringify(event));
    var modal = M.Modal.getInstance($("#event-info"));
    modal.open();
}

// --> WRTIE

// ADD EVENT CLICK
$("#add-event").click(() => {
    $("#new-event").fadeIn();
})
// NEW EVENT FORM VALIDATION
$("#submit").click(() => {
    var title = $("#event-title")[0].value;
    title = title.replace(title[0], title[0].toUpperCase());
    var event = {
        title: title,
        date: M.Datepicker.getInstance($("#datepicker")).toString(),
        start: $("#start-time")[0].value,
        end: $("#end-time")[0].value,
        tag: M.FormSelect.getInstance($("#tag")).input.value
    }
    var valid = true;
    for (var key in event) {
        valid = (event[key] == "" || event[key] == "Select One") ? false : true;
    }

    // valid = true;
    valid ? confirmEvent(event) : $("#event-err").html(`<p>Please Fill Out All Data</p>`);
})
// CONFIRM EVENT MODAL
function confirmEvent(event) {
    $("#event-data").empty();
    for (var key in event) {
        var name = key.replace(key[0], key[0].toUpperCase());
        (key == "title") ? $("#e-title").html(event[key]) : $("#event-data").append(`<p>${name}: ${event[key]}</p>`);
    }
    var modal = M.Modal.getInstance($("#event-confirm"));
    modal.open();
    var user = JSON.parse(sessionStorage.user);
    event.user = user.uid;
    $("#e-title").attr("class", JSON.stringify(event));
}
// SUBMIT EVENT
$("#confirm-submit").click(() => {
    addEvent(JSON.parse($("#e-title").attr("class")));
    $("#new-event").fadeOut();
    displayCalendar(new Date($("#title").attr("class")));
})
// FORM CLOSE HANDLE
$("#new-event").click(e => {
    if ($(e.target).attr("id") == "new-event") {
        $("#new-event").fadeOut();
    }
})

// --> EDIT



// --> DELETE

// DELETE CLICKED
$("#delete-event").click(() => {
    var modal = M.Modal.getInstance($("#confirm-delete"));
    modal.open();
})

// DELETE CONFIRM
function deleteEvent(){
    var event = JSON.parse($("#e-info-data").attr("event"));
    console.log("delete:", event.id);
    
    db.collection('calendar').doc(event.id).delete();
    var modal = M.Modal.getInstance($("#event-info"));
    modal.close();

    displayCalendar(new Date($("#title").attr("class")));
}