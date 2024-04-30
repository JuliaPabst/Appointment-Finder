<?php
class Appointment {
    public $id;
    public $title;
    public $location;
    public $expiration_date;

    function __construct($id, $title, $location, $expiration_date) {
        $this->id = $id;
        $this->title = $title;
        $this->location=$location;
        $this->expiration_date=$expiration_date;

      }
}

class TimeSlot {
  public $id;
  public $date;
  public $begin_time;
  public $end_time;
  public $fk_appointment_id;
  function __construct($id, $date, $begin_time, $end_time, $fk_appointment_id) {
      $this->id = $id;
      $this->date = $date;
      $this->begin_time=$begin_time;
      $this->end_time=$end_time;
      $this->fk_appointment_id=$fk_appointment_id;

    }
}
