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

    
    submitNewVoting();
});

function showOverview() {
    $.ajax({
        type: "POST",
        url: "../Server/serviceHandler.php",
        data: { method: "queryAppointments"},
        dataType: "json",
        success: function (response) {
            //console.log(response);
            var appointmentList = $('#appointmentList');
            appointmentList.empty();

            $.each(response, function( index, appointment ) {
                var expiredText = 'active';
                if (new Date(appointment.expiration_date) < new Date()) {
                expiredText = 'expired';
                 }
                 
                var appointmentHTML = `
                <div class="row rowAppointment">
                    <h4 class="singleAppointment" onClick="showSingleAppointment(event)">${appointment.title}</h4>
                    <div>Title: ${appointment.title}</div>
                    <div>Description: ${appointment.description}</div>
                    <div>Location: ${appointment.location}</div>
                    <div>Expiration status: ${expiredText}</div>
                </div>
                `;
                appointmentList.append(appointmentHTML);
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("AJAX error:", textStatus, ":", errorThrown);
        }
    });
}



// post new appointment to database 
function showNewAppointmentForm() {
    $("#newAppointment").hide();

    let createContainer = $("<form id='createForm'></form>");
    let title = $("<div id='create-title'><label for='title'>Title</label><input name='title' id='create-titleInput'></div>");
    let location = $("<div id='create-location'><label for='location'>Location</label><input name='location' id='create-locationInput'></div>");
    let description = $("<div id='create-description'><label for='description'>Description</label><textarea class='form-control mb-2 description'></textarea></div>");
    let duration = $("<div id='create-duration'><label for='duration'>Duration</label><input name='duration' id='create-durationInput' type='number'></div>");
    let allAppointments = $("<div id='allAppointments'></div>");
    let oneAppointment = $("<div class='oneAppointmentContainer'></div>")
    let date = $("<div id='create-date'><label for='date'>Appointment Option </label><input type='date' name='date' class='dateInput'></div>");
    let startTime = $("<div id='create-startTime'><label for='startTime'>Start time </label><input type='time' name='startTime' class='startTimeInput'></div>");
    let endTime = $("<div id='create-endTime'><label for='endTime'>End time </label><input type='time' name='endTime' class='endTimeInput'></div>");
    let addDateButton = $("<button type='submit' id='addOneMoreDateButton'>Add one more appointment option</button>");
    let expiration_date = $("<div id='create-expirationDate'><label for='expiration_date'>Expiration Date</label><input type='date' name='expiration_date' id='create-expirationDateInput'></div>");
    let submitButton = $("<button type='submit' id='submitNewAppointment'>Submit</button>");
    let dismissButton = $("<button id='dismiss-appointment'>Dismiss appointment</button>");
    
    oneAppointment.append(date, startTime, endTime)
    allAppointments.append(oneAppointment);
    createContainer.append(title, location, description, duration, allAppointments, addDateButton, expiration_date, submitButton, dismissButton);
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

    $('#createForm').on('submit', function(e) {
        e.preventDefault();
        submitNewAppointment(e);
    });
}

function addOneMoreDateInNewAppointmentForm() {
    let index = $('.oneAppointmentContainer').length;  
    let separation =$('<hr/>');
    let container = $("<div class='oneAppointmentContainer'></div>");
    let newDate = $(`<div><label for='date${index}'>Appointment Date:</label><input type='date' name='date${index}' class='dateInput'></div>`);
    let startTime = $(`<div><label for='startTime${index}'>Start Time:</label><input type='time' name='startTime${index}' class='startTimeInput'></div>`);
    let endTime = $(`<div><label for='endTime${index}'>End Time:</label><input type='time' name='endTime${index}' class='endTimeInput'></div>`);
    container.append(newDate, startTime, endTime);
    $('#allAppointments').append(separation, container);
}

function submitNewAppointment(e) {
    //console.log("submitNewAppointment");
    e.preventDefault();
  
    let appointmentDates = [];
    console.log($('.oneAppointmentContainer'));
    $('.oneAppointmentContainer').each(function() {
        console.log("an Element in the oneAppointmentContainerArray");
        let date = $(this).find('.dateInput').val();
        let startTime = $(this).find('.startTimeInput').val();
        let endTime = $(this).find('.endTimeInput').val();
        appointmentDates.push({
            date: date,
            startTime: startTime,
            endTime: endTime
        });
    });

    

    let formData = {
        title: $('#create-titleInput').val(),
        location: $('#create-locationInput').val(),
        description: $('#create-description .description').val(),
        duration: $('#create-durationInput').val(),
        dates: appointmentDates,
        expiration_date: $('#create-expirationDateInput').val()
    };

    console.log(formData);


    // Make an AJAX request to add the new appointment
    $.ajax({
        type: "POST",
        url: '../Server/serviceHandler.php',
        data: {
        method: 'addAppointment', 
        appointmentData: JSON.stringify(formData),
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

function submitNewVoting()
{
    let userData = {
        username: "TestUsername",
        comment: "TestComment"
    };
    
    $.ajax({
        type: "POST",
        url: '../Server/serviceHandler.php',
        data: {
        method: 'submitNewVoting', 
        userData: JSON.stringify(userData),
        },
        dataType: 'json',
        success: function(response) {
            console.log('Voting succesful:', response);
            showOverview();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('AJAX error:', textStatus, ':', errorThrown);
        }
});
}

function showTimeslots(appointmentId) {
    // console.log("showTimeslots")
    $.ajax({
        type: "POST",
        url: "../Server/serviceHandler.php",
        cache: false,
        data: {method: "queryTimeslots", param: appointmentId},
        dataType: "json",
        success: function(response) {
            // console.log(response);
            response.forEach((timeslot,index) => {
                var timeslotHTML = `
                <div class="col">
                <div>
                    <div class="informationSingleTimeSlot">
                        <label for="${timeslot.id}">Date: ${timeslot.date}</label>
                    </div>
                    <div>
                        <label for="beginTime">Begin Time: ${timeslot.begin_time}</label>
                    </div>
                     <div>
                        <label for="endTime">End Time: ${timeslot.end_time}</label>
                    </div>
                </div>
                    <div>
                        <input class="checkbox" name="${timeslot.id}" type="checkbox" />
                    </div>    
                </div>
                `;

                $("#formRow").append(timeslotHTML)});
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("AJAX error:", textStatus, ":", errorThrown);
        }
    });
}

function getAppointmentId(title){
    $.ajax({
        type: "POST",
        url: "../Server/serviceHandler.php",
        cache: false,
        data: {method: "queryAppointmentByTitle", param: title},
        dataType: "json",
        success: function (response) {
            //console.log(response);
            return response[0].id;
        }
    });
}

function showComments(id){
    // ajax call to show all comments related to an appointment with the usernames and the comment
    
    console.log($('#comments'));

    let singleComment = $('<div class="singleComment"></div>');
    let userName = $('<div class="userName">Username Placeholder</div>')
    let comment = $('<div class="comment">Comment Placeholder</div>')
    singleComment.append(userName, comment);
    $('#comments').append(singleComment);

    
    /*
    $.ajax({
        type: "POST",
        url: "../Server/serviceHandler.php",
        cache: false,
        data: {method: "queryCommentsByAppointmentId", param: id},
        dataType: "json",
        success: function (response) {
            
        }
    });
*/
}
 
function showSingleAppointment(event){
    $("#fullPage").hide();
    let title = $(event.target).text();
    
    let schedule = $('<form class="container mt-3" id="schedule"></form>');
    $('#container').append(schedule);

    let titleRow = $(`
        <div class="row" id="titleRow">
            <h3 class="card-title">` + title + `</h3>
        </div>`
    );

    let backButton = $('<button id="back">Back</button>')
    let formRow = $('<div class="row" id="formRow"></div>');
    let nameColon = $(`
            <div class="col">
            <div class="card mb-3">
                <div class="card-body">
                <input class="form-control mb-2" placeholder="Your name" name="name" />
                <button type="submit">Book</button>
                </div>
            </div>
            </div>
    `);

    let commentSection = $(`
        <div class="container mt-3" id="commentSection">
        <h3>Comments</h3>
            <div id="comments"></div>
            <textarea class="form-control mb-2" placeholder="Add comment" name="comment"></textarea>
        </div>`
    );
    
    formRow.append(nameColon);
    schedule.append(backButton, titleRow, formRow, commentSection);
    
    let appointmentId = getAppointmentId(title);
    getAppointmentId(title);
    showTimeslots(appointmentId); 
    showComments(appointmentId);

    let details = $('<div id="details"></div>').append(schedule);
    let body = $('body');
    body.append(details);

    $('#back').on('click', function(e) {
        $("#fullPage").show();
        $("#details").remove();
    });

    $('#schedule').on('submit', function(e){
        e.preventDefault();
        submitAppointmentBooking(e);
        $("#fullPage").show();
        $("#details").remove();
    })
}

function submitAppointmentBooking(e){
    let formDataArray = $(e.target).serializeArray();

    let formDataObject = {};
    $.each(formDataArray, function(index, item) {
        formDataObject[item.name] = item.value;
    });

    console.log(formDataObject);
}
