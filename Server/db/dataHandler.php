<?php
include("./models/appointment.php");
class DataHandler
{
    public function queryAppointments()
    {
        $res =  $this->getDemoData();
        return $res;
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
            [new Appointment(2, "StudySession", "McDonalds", "29.04.2025", "30.04.2024")],
            [new Appointment(3, "Workout", "McFit", "29.04.2025", "30.04.2024")],
            [new Appointment(4, "Workout", "GymBros", "29.04.2025", "30.04.2024")],
            [new Appointment(5, "Workout", "McFit", "29.08.2025", "30.07.2024")]

        ];
        return $demodata;
    }
}
