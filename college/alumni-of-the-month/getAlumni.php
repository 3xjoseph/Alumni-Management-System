<?php
session_start();


require '../php/connection.php';
require '../model/AlumniOfTheMonth.php';

//    check if college admin is logged in
if ($_SESSION['accountType'] !== 'ColAdmin') {
    // TODO redirect to error page.
    header("Location: ../index.php");
    exit();
}

// check if session admin is set
if (!isset($_SESSION['college_admin']) && !isset($_SESSION['adminID'])) {
    // TODO redirect to error page.
    header("Location: ../index.php");
    exit();
}


if ($_SERVER['REQUEST_METHOD'] == 'GET') {

    $result = null;
    $event = new AlumniOfTheMonth($mysql_con, $_SESSION['colCode']);

    if (isset($_GET['partial']) &&   $_GET['partial'] === 'true') {
        // get the offset from the url
        $offset = $_GET['offset'];



        //convert to int
        $offset = (int) $offset;

        $results = $event->getAllLatest($offset);
        header("Content-Type: application/json; charset=UTF-8");
        echo json_encode($results);
    } else {
        $results = $event->getFullDetailById($_GET['studentNo']);
        header("Content-Type: application/json; charset=UTF-8");
        echo json_encode($results);
    }
} else {
    echo "You are not supposed to be here.";
    header("refresh:5; url=../index.php");
    exit();
}
