<?php
include("./models/appointment.php");

class DataHandler
{
    private $db; // Declare the property without initializing it here

    public function __construct($db)
    {
        $this->db = $db; // Initialize the property in the constructor
    }
    public function queryAppointments()
    {
        $query = "SELECT * FROM appointments";
        $result = $this->db->query($query);
        $appointments = array();
        while ($row = $result->fetch_assoc()) {
            $appointment = new Appointment($row['id'], $row['title'], $row['description'], $row['location'], $row['duration'],  $row['expiration_date']);
            $appointments[] = $appointment;
        }
        return $appointments;
    }

    public function queryTimeslots()
    {
        $query = "SELECT * FROM timeslots";
        $result = $this->db->query($query);
        $timeslots = array();
        while ($row = $result->fetch_assoc()) {
            $timeslot = new TimeSlot($row['id'], $row['date'], $row['begin_time'], $row['end_time'], $row['fk_appointment_id']);
            $timeslots[] = $timeslot;
        }
        return $timeslots;
    }

    public function addAppointment($appointmentData)
    {
        $data = json_decode($appointmentData, true);    //true: decode as associative array
        $title = $data["title"];
        $location = $data["location"];
        $expiration_date = $data["expiration_date"];
        $description = $data["description"];
        $duration = $data["duration"];

        $stmt = $this->db->prepare("INSERT INTO appointments (title, location, duration, expiration_date, description) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $title, $location, $duration, $expiration_date, $description);

        $stmt->execute();
        // Get ID of last inserted record
        $appointment_id = $this->db->insert_id;
        $stmt->close();
        $this->addTimeSlots($appointmentData, $appointment_id);
        return $appointment_id; 
    }

    public function addTimeSlots($appointmentData, $appointment_id)
    {
        $data = json_decode($appointmentData, true);
        $datesArray = $data['dates'];
        foreach ($datesArray as $date) {
            $stmt = $this->db->prepare("INSERT INTO timeslots (date, begin_time, end_time, fk_appointment_id) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssss", $date['date'], $date['startTime'], $date['endTime'], $appointment_id);
            $stmt->execute();
            $stmt->close();
        }
    }

    public function addUser($userData)
    {
        $data = json_decode($userData, true);
        $username = $data['username'];
        $comment = $data['comment'];
        $stmt = $this->db->prepare("INSERT INTO users (username, comment) VALUES (?, ?)");
        $stmt->bind_param("ss", $username, $comment);
        $stmt->execute();
        // Get ID of last inserted record
        $user_id = $this->db->insert_id;
        $stmt->close();
        return $user_id; 
    }

    public function addVoting($votingData)
    {
        $this->addUser($votingData);
        

    }

    public function submitNewVoting($userData, $chosen_timeslots)
    {
        $user_id = $this->addUser($userData);
        return $user_id;
    }

    public function queryAllAppointments()
    {
        $result = array();
        foreach ($this->queryAppointments() as $val) {
                array_push($result, $val);
        }
        return $result;
    }
    public function queryAppointmentById($id)
    {
        $result = array();
        foreach ($this->queryAppointments() as $val) {
            if ($val->id == $id) {
                array_push($result, $val);
            }
        }
        return $result;
    }

    public function queryAppointmentByTitle($title)
    {
        $result = array();
        foreach ($this->queryAppointments() as $val) {
            if ($val->title == $title) {
                array_push($result, $val);
            }
        }
        return $result;
    }

    public function queryTimeslotsByAppointmentId($fk_appointment_id)
    {
        $result = array();
        foreach ($this->queryTimeslots() as $val) {
            if ($val->fk_appointment_id == $fk_appointment_id) {
                array_push($result, $val);
            }
        }
        return $result;
    }
    


    
}
