let data = undefined;

// load page 
$(document).ready(function () {
    $("#searchResult").hide();
    $("#newAppointment").click(function (e) {
        showNewAppointmentForm();
    });
    showOverview();
});

function showOverview() {
    // get appointments from server 
    $.ajax({
        type: "POST",
        url: "../Server/serviceHandler.php",
        data: { method: "queryAppointments"},
        dataType: "json",
        success: function (response) {
            //console.log(response);
            var appointmentList = $('#appointmentList');
            appointmentList.empty();

            response.forEach((appointment) =>  {
                // check if expiration date is before current date
                var expiredText = 'active';
                if (new Date(appointment.expiration_date) < new Date()) {
                expiredText = 'expired';
                 }
                 
                var appointmentHTML = `
                <div class="row rowAppointment">
                    <h4 class="singleAppointment" onClick="showSingleAppointment(event, '${expiredText}')">${appointment.title}</h4>
                    <div>Title: ${appointment.title}</div>
                    <div>Description: ${appointment.description}</div>
                    <div>Location: ${appointment.location}</div>
                    <div>Expiration status: ${expiredText}</div>
                </div>
                `;

                appointmentList.append(appointmentHTML);
            });
        },
        // jqXHR = jQuery XMLHttpRequest object
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("AJAX error:", textStatus, ":", errorThrown);
        }
    });
}

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
        //show newAppointment button
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
    e.preventDefault();
  
    let appointmentDates = [];

    // get all different appointment options and push them as an object in the appointmentDates array
    $('.oneAppointmentContainer').each(function() {
        // select the .dateInput element in each appointment
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

    // post form data to the server
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

  $('#createForm').remove();
  $("#newAppointment").show();
}


function showTimeslots(appointmentId, expirationStatus) {
    appointmentId = parseInt(appointmentId);

    // search for all timeSlots with appointmentId 
    $.ajax({
        type: "POST",
        url: "../Server/serviceHandler.php",
        cache: false,
        data: {method: "queryTimeslotsByAppointmentId", param: appointmentId},
        dataType: "json",
        success: function(response) {
            response.forEach((timeslot, index) => {
                var timeslotHTML = `
                    <div class="singleAppointmentOption col-sm-6 col-md-3 col-xl-2" id="singleAppointmentOption${index}">
                        <div>
                            <h4>Option ${index + 1}</h4>
                            <div class="informationSingleTimeSlot">
                                <label for="${timeslot.id}"> Date: ${timeslot.date}</label>
                            </div>
                            <div>
                                <label for="beginTime">Begin Time: ${timeslot.begin_time}</label>
                            </div>
                            <div>
                                <label for="endTime">End Time: ${timeslot.end_time}</label>
                            </div>
                        </div>
                        
                    </div>
                `;
            
                $("#formRow").append(timeslotHTML);
            
                // if is not expired: create an input field 
                if (expirationStatus != "expired") {
                    let input = `<div>
                                    <input class="checkbox" name="${timeslot.id}" type="checkbox" />
                                </div>`;
                    $("#singleAppointmentOption" + index).append(input);
                }

                let userinformation =`<hr><div id="userInformation${index}" class="user-information"></div>`;
                $("#singleAppointmentOption" + index).append(userinformation);
            
                // Append users who voted underneath each timeslot
                whoVotedThis(timeslot.id, function(users_who_voted) {
                    var usersHTML = '';
                    users_who_voted.forEach((user, index) => {
                        usersHTML += `
                            <div class="user-info">
                                <p>Username: ${user.username}</p>
                                <p>Comment: ${user.comment}</p>
                            </div>`;
                        // Add divider between users
                        if (index < users_who_voted.length - 1) {
                            usersHTML += `<hr>`;
                        }
                    });
                    usersHTML += `<hr>`;
                    $("#userInformation" + index).html(usersHTML);
                }); 
            });     
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("AJAX error:", textStatus, ":", errorThrown);
        }
    });
}

function whoVotedThis(timeslotId, callback) {
    timeslotId = parseInt(timeslotId);
    $.ajax({
        type: "POST",
        url: "../Server/serviceHandler.php",
        cache: false,
        data: {method: "whoVotedThis", param: timeslotId},
        dataType: "json",
        success: function(response) {
            callback(response);
             
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("AJAX error:", textStatus, ":", errorThrown);
        }
    });
}

function deleteAppointment(appointmentId, callback) {
    appointmentId = parseInt(appointmentId);
    $.ajax({
        type: "POST",
        url: "../Server/serviceHandler.php",
        cache: false,
        data: {method: "deleteAppointment", param: appointmentId},
        dataType: "json",
        success: function(response) {
            console.log(response);
            if (typeof callback === "function") {
                callback(); // Call the callback function if provided
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("AJAX error:", textStatus, ":", errorThrown);
        }
    });
}


function getAppointmentId(title, callback){
    $.ajax({
        type: "POST",
        url: "../Server/serviceHandler.php",
        cache: false,
        data: {method: "queryAppointmentByTitle", param: title},
        dataType: "json",
        success: function (response) {
            callback(response[0].id);
        }
        
    });
}
 
function showSingleAppointment(event, expirationStatus) {
    $("#fullPage").hide();
    let title = $(event.target).text();

    let schedule = $('<form class="container mt-3" id="schedule"></form>');
    $('#container').append(schedule);

    let titleRow = $(`
        <div class="row" id="titleRow">
            <h3 class="card-title">` + title + `</h3>
        </div>`
    );

    let backButton = $('<button id="back">Back</button>');
    let deleteButton = $('<button id="delete">Delete Appointment</button>');
    let formRow = $('<div class="row" id="formRow"></div>');
    if (expirationStatus != "expired") {
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
        formRow.append(nameColon);
    }

   

    schedule.append(backButton, deleteButton, titleRow, formRow);

    if (expirationStatus != "expired") {
       
        let commentSection = $(`
        <div class="container mt-3" id="commentSection">
            <h3>Add a comment</h3>
            <div id="comments"></div>
        </div>`
        );
        let commentTextarea = `<textarea class="form-control mb-2" placeholder="Add comment" name="comment"></textarea>`;
        
        schedule.append(commentSection);
        $("#commentSection").append(commentTextarea);
    }

    let appointmentId; 

    getAppointmentId(title, function(appointmentIdResult) {
        appointmentId = appointmentIdResult; 
        showTimeslots(appointmentId, expirationStatus);
    });

    let details = $('<div id="details"></div>').append(schedule);
    let body = $('body');
    body.append(details);

    $('#back').on('click', function(e) {
        $("#fullPage").show();
        $("#details").remove();
    });

    $('#delete').on('click', function(e) {
        e.preventDefault();
        if (appointmentId) { // Ensure appointmentId is defined
            deleteAppointment(appointmentId, function() {
            showOverview();
            $("#fullPage").show();
            $("#details").remove();
                });
        } else {
            console.error("Appointment ID not found.");
        }
    });



    $('#schedule').on('submit', function(e) {
        e.preventDefault();
        submitAppointmentBooking(e);
        $("#fullPage").show();
        $("#details").remove();
    });
}

function submitAppointmentBooking(e){
    let formDataArray = $(e.target).serializeArray();

    let formDataObject = {};
    $.each(formDataArray, function(index, item) {
        formDataObject[item.name] = item.value;
    });

    let chosenArray = [];

    for (let key in formDataObject){
        if (formDataObject.hasOwnProperty(key) && formDataObject[key] === "on") {
            chosenArray.push(key);

        }
    }

    let userData = {
        username: formDataObject.name,
        comment: formDataObject.comment,
        chosen: chosenArray
    };

    //console.log(userData);

    $.ajax({
        type: "POST",
        url: '../Server/serviceHandler.php',
        data: {
        method: 'submitNewVoting', 
        userData: JSON.stringify(userData),
        },
        dataType: 'json',
        success: function(response) {
            //console.log('Voting succesful: userid', response);
            showOverview();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('AJAX error:', textStatus, ':', errorThrown);
        }
});
}

