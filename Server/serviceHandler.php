<?php
include("businesslogic/simpleLogic.php");
require 'db/dbaccess.php';

$db_obj = new mysqli($host, $user, $password, $database);

    if ($db_obj->connect_error) {
        echo "Connection Error: " . $db_obj->connect_error;
        exit();
        }


$param = "";
$method = "";
$title = "";
$location = "";
$date = "";
$expiration_date = "";

isset($_POST["method"]) ? $method = $_POST["method"] : false;
isset($_POST["param"]) ? $param = $_POST["param"] : false;
isset($_POST["title"]) ? $title = $_POST["title"] : false;
isset($_POST["location"]) ? $location = $_POST["location"] : false;
isset($_POST["date"]) ? $date = $_POST["date"] : false;
isset($_POST["expiration_date"]) ? $expiration_date = $_POST["expiration_date"] : false;

$logic = new SimpleLogic($db_obj);
$result = $logic->handleRequest($method, $param, $title, $location, $date, $expiration_date);
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
