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
        type: "GET",
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
        type: "GET",
        url: "../Server/serviceHandler.php",
        cache: false,
        data: {method: "queryAllAppointments"},
        dataType: "json",
        success: function(response) {
            var appointmentList = $('#appointmentList');
            $.each(response, function( index, appointment ) {
                var appointmentHTML = `

                <div class="row appointment">
                <h4 class="singleAppointment" onClick="showSingleAppointment(event)">${appointment[0].title}</h4>
                <ul>
                <li>Title: ${appointment[0].title}</li>
                <li>Created at: ${appointment[0].date}</li>
                <li>Location: ${appointment[0].location}</li>
                <li>Title ${appointment[0].expiration_date}</li>
                </ul>
                `;
                appointmentList.append(appointmentHTML);
            });
        }
    });
}

function showTimeslots(appointmentId) {
    $.ajax({
        type: "GET",
        url: "../Server/serviceHandler.php",
        cache: false,
        data: {method: "queryTimeslotsByAppointmentId", param: appointmentId},
        dataType: "json",
        success: function(response) {
            var timeslotList = $('#timeslotList');
            $.each(response, function(index, timeslot) {
                var timeslotHTML = `
                    <h4>Timeslot for Appointment ID${timeslot[0].fk_appointment_id}</h4>"
                    <div class="row timeslot">
                        <ul>
                            <li>Date: ${timeslot[0].date}</li>
                            <li>Begin Time: ${timeslot[0].begin_time}</li>
                            <li>End time: ${timeslot[0].end_time}</li>
                        </ul>
                    </div>
                `;
                timeslotList.append(timeslotHTML);
            });
        }
    });
}


// post new appointment to database 
function showNewAppointmentForm(){
    console.log("create");

    let createContainer = $("<form id='createForm'></form>");
    let title = $("<div id='create-title'><label for='title' id='create-titleLabel'>Title</label><input name='title' id='create-titleInput'></div>")
    let location = $("<div id='create-location'><label for='location' id='create-locationLabel'>Location</label><input name='location' id='create-locationInput'></div>")
    let date = $("<div id='create-date'><label for='date' id='create-dateLabel'>Date</label><input type='date' name='date' id='create-dateInput'></div>")
    let expiration_date = $("<div id='create-expirationDate'><label for='expiration_date' id='create-expirationDateLabel'>Expiration Date</label><input type='date' name='expiration_date' id='create-expirationDateInput'></div>");
    let submitButton = $("<button type='submit'>Submit</button>");
    createContainer.append(title, location, date, expiration_date, submitButton);
    $('#createAppointment').append(createContainer);

    $("#createForm").on("submit", function (e) {
        e.preventDefault();
        submitNewAppointment(e)
    });
}


function submitNewAppointment(e){
    e.preventDefault();

    let formDataArray = $(e.target).serializeArray();

    let formDataObject = {};
    $.each(formDataArray, function(index, item) {
      formDataObject[item.name] = item.value;
    });

    $('#createForm').remove();
    console.log(formDataObject);

    // server endpoint to be done
    /*
    $.ajax({
      type: 'POST',
      url: 'your-server-endpoint.php', 
      data: formDataObject,
      success: function(response) {
        console.log(response);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error('AJAX error: ', textStatus, ' : ', errorThrown);
      }
    }); 
  });
  */
}
 
function showSingleAppointment(event){
$("#fullPage").hide();
let title = $(event.target).text();

let schedule = $('<div class="container mt-3"></div>');

let headerRow = $('<div class="row"></div>');
  
let col = $(`
      <div class="col">
        <div class="card">
          <div class="card-body text-center">
            <h5 class="card-title">` + title + `</h5>
          </div>
        </div>
      </div>
    `);
headerRow.append(col);
schedule.append(headerRow);

let row = $('<div class="row"></div>');
    
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

row.append(nameColon);
    
schedule.append(row);
  

let commentSection = $(`
    <div class="container mt-3">
      <h3>Kommentare</h3>
      <textarea class="form-control mb-2" placeholder="Add comment"></textarea>
      <button class="btn btn-secondary">Add comment</button>
    </div>`
);

let body = $('body');
body.append(schedule, commentSection);


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

