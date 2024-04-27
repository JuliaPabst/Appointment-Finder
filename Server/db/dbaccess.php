<?php
    $host = "localhost";
    $user = "appointmentAdmin";
    $password = "topSecretPassword123";
    $database = "appointment_finder";

    $conn = new mysqli($host, $user, $password, $database);

    if($conn->connect_error) {
        die('Database error:' . $conn->connect_error);
    }
?>
