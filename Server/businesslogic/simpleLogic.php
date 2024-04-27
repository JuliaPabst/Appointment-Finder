<?php
include("./db/dataHandler.php");


class SimpleLogic
{
    private $dh;
    function __construct($db_obj)
    {
        $this->dh = new DataHandler($db_obj);
    }

    function handleRequest($method, $param, $title, $location, $date, $expiration_date)
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
                $res = $this->dh->addAppointment($title, $location, $date, $expiration_date);
                break;
            default:
                $res = null;
                break;
        }
        return $res;
    }
}
