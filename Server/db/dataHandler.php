<?php
include("./models/appointment.php");
class DataHandler
{
    public function queryAppointments()
    {
        $res =  $this->getDemoData();
        return $res;
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

    private static function getDemoData()
    {
        $demodata = [
            [new Appointment(1, "StudySession", "FH", "03.04.2024", "30.04.2024")],
            [new Appointment(2, "Workout", "GymBros", "29.04.2025", "30.04.2024")],
        ];
        return $demodata;
    }

    private static function getTimeSlotsDemoData()
    {
        $demodata = [
            [new TimeSlot(1, '2024-04-14', '09:00', '10:00', 1)],
            [new TimeSlot(2, '2024-04-14', '10:00', '11:00', 1)],
            [new TimeSlot(3, '2024-04-15', '11:00', '12:00', 2)],
            [new TimeSlot(4, '2024-04-15', '13:00', '14:00', 2)],
            [new TimeSlot(5, '2024-04-16', '14:00', '15:00', 2)]
			
        ];
        return $demodata;
    }
}
