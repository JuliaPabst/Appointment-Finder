<?php
include("./db/dataHandler.php");


class SimpleLogic
{
    private $dh;
    function __construct($db_obj)
    {
        $this->dh = new DataHandler($db_obj);
    }

    function handleRequest($method, $param, $appointmentData, $userData)
    {
        switch ($method) {
            case "queryAppointments":
                $res = $this->dh->queryAppointments();
                break;
            case "queryAllAppointments":
                $res = $this->dh->queryAllAppointments();
                break;
            case "queryAppointmentById":
                $res = $this->dh->queryAppointmentById($param);
                break;
            case "queryAppointmentByTitle":
                $res = $this->dh->queryAppointmentByTitle($param);
                break;
            case "queryTimeslots":
                $res = $this->dh->queryTimeslots();
                break;
            case "queryTimeslotsByAppointmentId":
                $res = $this->dh->queryTimeslotsByAppointmentId($param);
                break;
            case "addAppointment":
                $res = $this->dh->addAppointment($appointmentData);
                break;
            case "submitNewVoting":
                $res = $this->dh->submitNewVoting($userData);
                break;
            case "whoVotedThis":
                $res = $this->dh->whoVotedThis($param);
                break;
            case "deleteAppointment":
                $res = $this->dh->deleteAppointment($param);
                break;
            default:
                $res = null;
                break;
        }
        return $res;
    }
}
