<?php

require 'alumniTB.php';
require_once 'connection.php';

if (isset($_POST['action'])) {
    $actionArray = $_POST['action'];
    $actionJSON = json_decode($actionArray, true);
    $action = $actionJSON['action'];

    switch ($action) {
        case 'readAll':
            $alumni = new Alumni();
            $alumni->getAlumniRecord($mysql_con);
            break;
    }
} else {
    echo 'not pumasok';
}