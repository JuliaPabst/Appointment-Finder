<?php
class Appointment {
    public $id;
    public $title;
    public $location;
    public $date;
    public $expiration_date;

    function __construct($id, $title, $location, $date, $expiration_date) {
        $this->id = $id;
        $this->title = $title;
        $this->location=$location;
        $this->date=$date;
        $this->expiration_date=$expiration_date;

      }
}
