<?php
include("businesslogic/simpleLogic.php");
require 'db/config.php';

$db_obj = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);
    if ($db_obj->connect_error) {
        echo "Connection Error: " . $db_obj->connect_error;
        exit();
        }


$param = "";
$method = "";
$appointmentData = "";
$userData = "";

isset($_POST["method"]) ? $method = $_POST["method"] : false;
isset($_POST["appointmentData"]) ? $appointmentData = $_POST["appointmentData"] : false;
isset($_POST["userData"]) ? $userData = $_POST["userData"] : false;


$logic = new SimpleLogic($db_obj);
$result = $logic->handleRequest($method, $param, $appointmentData, $userData);
if ($result == null) {
    response("POST", 400, null);
} else {
    response("POST", "200", $result);
}

function response($method, $httpStatus, $data)
{
    header('Content-Type: application/json');
    switch ($method) {
        case "POST":
            http_response_code($httpStatus);
            echo (json_encode($data));
            break;
        default:
            http_response_code(405);
            echo ("Method not supported yet!");
    }
}
