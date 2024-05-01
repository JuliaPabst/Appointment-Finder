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

    public function whoVotedThis($timeslot_id)
{
    $query = "SELECT users.username, users.comment FROM users_timeslots 
          JOIN users ON users.id = users_timeslots.fk_user_id
          WHERE users_timeslots.fk_timeslot_id = ?";
    $stmt = $this->db->prepare($query);
    $stmt->bind_param("i", $timeslot_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $users = array();
    while ($row = $result->fetch_assoc()) {
        $user = new User($row["username"], $row["comment"]); // Fetch usernames and comments
        $users[] = $user;
    }
    return $users;
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

    public function addVoting($userData, $user_id)
    {
        $data = json_decode($userData, true);
        $timeslotArray = $data['chosen'];
        foreach ($timeslotArray as $timeslot) {
            $stmt = $this->db->prepare("INSERT INTO users_timeslots (fk_user_id, fk_timeslot_id) VALUES (?, ?)");
            $stmt->bind_param("ii", $user_id, $timeslot);
            $stmt->execute();
           
        }
        $stmt->close();
    }

    public function submitNewVoting($userData)
    {
        $user_id = $this->addUser($userData);
        $this->addVoting($userData, $user_id);
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
        $query = "SELECT * FROM appointments WHERE title = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("s", $title);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $appointments = array();
        while ($row = $result->fetch_assoc()) {
            $appointment = new Appointment($row['id'], $row['title'], $row['description'], $row['location'], $row['duration'], $row['expiration_date']);
            $appointments[] = $appointment;
        }
        
        $stmt->close();
        
        return $appointments;
    }

    public function queryTimeslotsByAppointmentId($fk_appointment_id)
    {

        $query = "SELECT * FROM timeslots WHERE fk_appointment_id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("i", $fk_appointment_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $timeslots = array();
        while ($row = $result->fetch_assoc()) {
            $timeslot = new TimeSlot($row['id'], $row['date'], $row['begin_time'], $row['end_time'], $row['fk_appointment_id']);
            $timeslots[] = $timeslot;
        }
        
        $stmt->close();
        
        return $timeslots;
    }
    
    public function deleteAppointment($appointment_id)
    {
        // Löschen der zugehörigen Zeitschlitze
        $stmt = $this->db->prepare("DELETE FROM timeslots WHERE fk_appointment_id = ?");
        $stmt->bind_param("i", $appointment_id);
        $stmt->execute();
        $stmt->close();


        // Löschen der Termine
        $stmt = $this->db->prepare("DELETE FROM appointments WHERE id = ?");
        $stmt->bind_param("i", $appointment_id);
        $stmt->execute();
        $stmt->close();
    
        
    
        // Rückgabe des gelöschten Termins
        return $appointment_id;
    }

    
}
