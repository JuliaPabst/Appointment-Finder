//Starting point for JQuery init
let data = undefined;

$(document).ready(function () {
    $("#searchResult").hide();
    $("#btn_Search").click(function (e) {
       loaddata($("#seachfield").val());
    });

    // load all Data 
    showOverview();

    // post new appointment to database 
    createNewAppointment();

    // load all options for one specific appointment 
    showSingleAppointment();
});

function loaddata(searchterm) {
    $.ajax({
        type: "GET",
        url: "../Server/serviceHandler.php",
        cache: false,
        data: {method: "queryPersonByName", param: searchterm},
        dataType: "json",
        success: function (response) {
            
            $("#noOfentries").val(response.length);
            $("#searchResult").show(1000).delay(1000).hide(1000);
            data = response;
        }
    });

}

function showOverview(){
}

function showSingleAppointment(){
}

function createNewAppointment(){
}

