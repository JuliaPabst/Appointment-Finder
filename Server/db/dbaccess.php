<?php
    $host = "localhost";
    $user = "appointmentAdmin";
    $password = "topSecretPassword123";
    $database = "appointment_finder";

    $db_obj = new mysqli($host, $user, $password, $database);

    if ($db_obj->connect_error) {
        echo "Connection Error: " . $db_obj->connect_error;
        exit();
        }

