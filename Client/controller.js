//Starting point for JQuery init


let data = undefined;

$(document).ready(function () {
    $("#searchResult").hide();
    $("#btn_Search").click(function (e) {
       loaddata($("#seachfield").val());
    });

    $("#newAppointment").click(function (e) {
        showNewAppointmentForm();
    });


    showOverview();
    showTimeslots(1);
});

function loaddata(searchterm) {
    $.ajax({
        type: "POST",
        url: "../Server/serviceHandler.php",
        cache: false,
        data: {method: "queryAppointmentByTitle", param: searchterm},
        dataType: "json",
        success: function (response) {
            $("#noOfentries").val(response.length);
            $("#searchResult").show(1000).delay(1000).hide(1000);
            data = response;
        }
    });
}

   // load all Data 
   function showOverview() {
    $.ajax({
        type: "POST",
        url: "../Server/serviceHandler.php",
        cache: false,
        data: {method: "queryAllAppointments"},
        dataType: "json",
        success: function(response) {
            //console.log(response);
            var appointmentList = $('#appointmentList');
            appointmentList.empty();

            $.each(response, function( index, appointment ) {
                var expiredText = 'active';
                if (new Date(appointment.expiration_date) < new Date()) {
                expiredText = 'expired';
                 }
                 
                 //console.log(appointment);

                var appointmentHTML = `
                <div class="row appointment">
                <h4 class="singleAppointment" onClick="showSingleAppointment(event)">${appointment.title}</h4>
                <ul>
                <li>Title: ${appointment.title}</li>
                <li>Location: ${appointment.location}</li>
                <li>Expired: ${expiredText}</li>
                </ul>
                `;
                appointmentList.append(appointmentHTML);
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("AJAX error:", textStatus, ":", errorThrown);
        }
    });
}
function showTimeslots(appointmentId) {
    console.log("showTimeslots")
    $.ajax({
        type: "POST",
        url: "../Server/serviceHandler.php",
        cache: false,
        data: {method: "queryTimeslots", param: appointmentId},
        dataType: "json",
        success: function(response) {
            console.log(response);
            var timeslotList = $('#timeslotList');
            $.each(response, function(index, timeslot) {
                var timeslotHTML = `
                    <h4>Timeslot for Appointment ID${timeslot.fk_appointment_id}</h4>"
                    <div class="row timeslot">
                        <ul>
                            <li>Date: ${timeslot.date}</li>
                            <li>Begin Time: ${timeslot.begin_time}</li>
                            <li>End time: ${timeslot.end_time}</li>
                        </ul>
                    </div>
                `;
                timeslotList.append(timeslotHTML);
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("AJAX error:", textStatus, ":", errorThrown);
        }
    });
}


// post new appointment to database 
function showNewAppointmentForm() {
    console.log("create");
    $("#newAppointment").hide();

    let createContainer = $("<form id='createForm'></form>");
    let title = $("<div id='create-title'><label for='title'>Title</label><input name='title' id='create-titleInput'></div>");
    let location = $("<div id='create-location'><label for='location'>Location</label><input name='location' id='create-locationInput'></div>");
    let description = $("<div id='create-description'><label for='description'>Description</label><textarea class='form-control mb-2 description'></textarea></div>");
    let duration = $("<div id='create-duration'><label for='duration'>Duration</label><input name='duration' id='create-durationInput' type='number'></div>");
    let date = $("<div id='create-date'><label for='date'>Appointment Option </label><input type='date' name='date' class='dateInput'></div>");
    let addDateButton = $("<button type='button' id='addOneMoreDateButton'>Add one more appointment option</button>");
    let expiration_date = $("<div id='create-expirationDate'><label for='expiration_date'>Expiration Date</label><input type='date' name='expiration_date' id='create-expirationDateInput'></div>");
    let submitButton = $("<button type='submit'>Submit</button>");
    let dismissButton = $("<button id='dismiss-appointment'>Dismiss appointment</button>");
    
    createContainer.append(title, location, description, duration, date, addDateButton, expiration_date, submitButton, dismissButton);
    $('#createAppointment').append(createContainer);
    
    $('#addOneMoreDateButton').on('click', function(e) {
        e.preventDefault();
        addOneMoreDateInNewAppointmentForm();
    });

    $('#dismiss-appointment').on('click', function(e) {
        e.preventDefault();
        $('#createForm').remove();
        $("#newAppointment").show();
    });
}


function addOneMoreDateInNewAppointmentForm() {
    let newDate = $("<div><label for='date'>Appointment Option </label><input type='date' name='date' class='dateInput'></div>");
    $('#create-date').append(newDate); 
    console.log("add Date");
}

function submitNewAppointment(e) {
  e.preventDefault();
  //console.log(e.target)
  let formData= $(e.target).serialize();
  console.log(formData);
  
  let formDataArray = $(e.target).serializeArray();

    let formDataObject = {};
    $.each(formDataArray, function(index, item) {
        formDataObject[item.name] = item.value;
    });

  // Make an AJAX request to add the new appointment
  $.ajax({
    type: "POST",
    url: '../Server/serviceHandler.php', // Adjust the URL to your server endpoint
    data: {
      method: 'addAppointment',
      title: formDataObject.title,
      location: formDataObject.location,
      date: formDataObject.date,
      expiration_date: formDataObject.expiration_date
  },
    dataType: 'json',
    success: function(response) {
        console.log('New appointment added successfully:', response);
        showOverview();
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.error('AJAX error:', textStatus, ':', errorThrown);
    }
});

  // Remove the form after submission
  $('#createForm').remove();
  $("#newAppointment").show();
}
 
function showSingleAppointment(event){
$("#fullPage").hide();
let backButton = $('<button id="back">Back</button>')
let title = $(event.target).text();
let schedule = $('<form class="container mt-3"></form>');

let headerRow = $('<div class="row"></div>');
  
let  titleCol = $(`
      <div class="col">
        <div class="card">
          <div class="card-body text-center">
            <h5 class="card-title">` + title + `</h5>
          </div>
        </div>
      </div>
    `);

headerRow.append(backButton, titleCol);
schedule.append(headerRow);

let formRow = $('<div class="row"></div>');
    
let nameColon = $(`
        <div class="col">
          <div class="card mb-3">
            <div class="card-body">
              <input class="form-control mb-2" placeholder="Dein Name" />
              <button class="btn btn-primary">Buchen</button>
            </div>
          </div>
        </div>
      `);

let appointmentColon1 = $(`
<div class="col">
        <label for="date1">01-01-20</label>
        <input class="checkbox" name="date1" type="checkbox" />
</div>
`);

let appointmentColon2 = $(`
<div class="col">
        <label for="date2">01-01-20</label>
        <input class="checkbox" name="date2" type="checkbox" />
</div>
`);

let appointmentColon3 = $(`
<div class="col">
        <label for="date3">01-01-20</label>
        <input class="checkbox" name="date3" type="checkbox" />
</div>
`);

formRow.append(nameColon, appointmentColon1, appointmentColon2, appointmentColon3);
    
schedule.append(formRow);
  

let commentSection = $(`
    <div class="container mt-3" id="commentSection">
      <h3>Kommentare</h3>
      <textarea class="form-control mb-2" placeholder="Add comment"></textarea>
      <button class="btn btn-secondary">Add comment</button>
    </div>`
);

let details = $('<div id="details"></div>').append(schedule, commentSection);
let body = $('body');
body.append(details);

$('#back').on('click', function(e) {
    $("#fullPage").show();
    $("#details").remove();
});




// get real Data 
/*$.ajax({
    type: "GET",
    url: "../Server/serviceHandler.php",
    cache: false,
    data: {
        method: "queryAppointmentByTitle",
        title: title  // Titel als Parameter übergeben
    },
    dataType: "json",
    success: function(response) {
        console.log("Erfolg: ", response);
        Do things with data
    },
    error: function(xhr, status, error) {
        console.error("Fehler beim AJAX-Call: ", error);
    }
});
*/

}

