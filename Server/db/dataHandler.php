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
            $appointment = new Appointment($row['id'], $row['title'], $row['description'], $row['location'], $row['expiration_date']);
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
        $data = json_decode($appointmentData, true);
        $title = $data["title"];
        $location = $data["location"];
        $expiration_date = $data["expiration_date"];
        $description = $data["description"];

        $stmt = $this->db->prepare("INSERT INTO appointments (title, location, expiration_date, description) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $title, $location, $expiration_date, $description);
        $stmt->execute();
        $stmt->close();
        return true; 
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
