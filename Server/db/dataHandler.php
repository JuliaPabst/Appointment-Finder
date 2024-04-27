<?php
include("./models/appointment.php");
require 'dbaccess.php';
class DataHandler
{
    private $demoAppointments;
    private $demoTimeSlots;
    public function __construct()
    {
        $this->demoAppointments = [
            [new Appointment(1, "StudySession", "FH", "03.04.2024", "30.04.2024")],
            [new Appointment(1, "Workout", "Gym", "03.04.2024", "30.04.2024")]
        ];

        $this->demoTimeSlots = [
            [new TimeSlot(1, '2024-04-14', '09:00', '10:00', 1)],
            [new TimeSlot(2, '2024-04-14', '10:00', '11:00', 1)],
            [new TimeSlot(3, '2024-04-15', '11:00', '12:00', 2)],
            [new TimeSlot(4, '2024-04-15', '13:00', '14:00', 2)],
            [new TimeSlot(5, '2024-04-16', '14:00', '15:00', 2)]
        ];
    }
    public function queryAppointments()
    {
        $res =  $this->demoAppointments;
        return $res;
    }

    public function queryTimeslots()
    {
        $res =  $this->demoTimeSlots;
        return $res;
    }

    public function addAppointment($title, $location, $date, $expiration_date)
    {

        // Generate a unique ID for the new appointment
        $newAppointmentId = count($this->demoAppointments) + 1;
    
    
        // Create a new Appointment object
        $newAppointment = [new Appointment($newAppointmentId, $title, $location, $date, $expiration_date)];
    
        // Add the new appointment to the array of appointments
        $this->demoAppointments[] = $newAppointment;
    
        // Optionally, you can return the ID of the newly added appointment
        return $this->demoAppointments;
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
            if ($val[0]->id == $id) {
                array_push($result, $val);
            }
        }
        return $result;
    }

    public function queryAppointmentByTitle($title)
    {
        $result = array();
        foreach ($this->queryAppointments() as $val) {
            if ($val[0]->title == $title) {
                array_push($result, $val);
            }
        }
        return $result;
    }

    public function queryTimeslotsByAppointmentId($fk_appointment_id)
    {
        $result = array();
        foreach ($this->queryTimeslots() as $val) {
            if ($val[0]->fk_appointment_id == $fk_appointment_id) {
                array_push($result, $val);
            }
        }
        return $result;
    }

    
}
