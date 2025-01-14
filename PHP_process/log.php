<?php
require_once 'connection.php';

if (isset($_POST['action'])) {
    $action = $_POST['action'];

    if ($action == "RetrieveData")
        getCollegeAction($mysql_con);
    else if ($action == "retrieveByDate") {
        $startDate = $_POST['startDate'];
        $endDate = $_POST['endDate'];
        $college = $_POST['colCode'];
        getActionByDate($startDate, $endDate, $college, $mysql_con);
    }
}
function getCollegeAction($con)
{
    $query = "SELECT * FROM `collegeadmin_log` ORDER BY `timestamp` DESC LIMIT 50"; //get all the log for today
    $stmt = mysqli_prepare($con, $query);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = mysqli_num_rows($result);

    getDetails($result, $row, $con); //get details
}

function getDetails($result, $row, $con)
{
    $response = 'Unsuccess';
    $action = array();
    $timestamp = array();
    $details = array();
    $colCode = array();
    $colLogo = array();
    $colname = array();
    $colAdminName = array();
    if ($result && $row > 0) {
        $response = "Success";
        while ($data = $result->fetch_assoc()) {
            $action[] = $data['action'];
            $colAdmin = $data['colAdmin'];
            $timestamp[] = $data['timestamp'];
            $details[] = $data['details'];

            // get college data
            $queryCollege = "SELECT college.colCode, college.colLogo,colname,
            CONCAT(person.fname,' ',person.lname) AS 'fullname'
            FROM coladmin JOIN college ON coladmin.colCode = college.colCode
            JOIN person ON coladmin.personID = person.personID
            WHERE coladmin.adminID = ? ";

            $stmtCollege = mysqli_prepare($con, $queryCollege);
            $stmtCollege->bind_param('s', $colAdmin);
            $stmtCollege->execute();
            $resultCol = $stmtCollege->get_result();

            if ($resultCol) {
                while ($data = $resultCol->fetch_assoc()) {
                    $colCode[] = $data['colCode'];
                    $colname[] = $data['colname'];
                    $colLogo[] = base64_encode($data['colLogo']);
                    $colAdminName[] = $data['fullname'];
                }
            }
        }
    }

    $data = array(
        "response" => $response,
        "action" => $action,
        "timestamp" => $timestamp,
        "details" => $details,
        "colCode" => $colCode,
        "colname" => $colname,
        "colLogo" => $colLogo,
        "colAdminName" => $colAdminName,
    );

    echo json_encode($data);
}


function getActionByDate($startDate, $endDate, $college, $con)
{

    if ($startDate != "" && $college == "") {
        // filter by date
        $query = "SELECT * FROM `collegeadmin_log` WHERE DATE(timestamp) >= ? 
        AND DATE(timestamp) <= ? ORDER BY `timestamp` DESC";
        $stmt = mysqli_prepare($con, $query);
        $stmt->bind_param('ss', $startDate, $endDate);
    } else if ($startDate == "" && $college != "") {
        // filter by college
        $query = "SELECT `collegeadmin_log`.*
        FROM `collegeadmin_log`
        JOIN `coladmin` ON `collegeadmin_log`.`colAdmin` = `coladmin`.`adminID`
        WHERE `coladmin`.colCode = ? ";
        $stmt = mysqli_prepare($con, $query);
        $stmt->bind_param('s', $college);
    } else if ($startDate != "" && $college != "") {

        // filter by both college and date
        $query = "SELECT `collegeadmin_log`.*
        FROM `collegeadmin_log`
        JOIN `coladmin` ON `collegeadmin_log`.`colAdmin` = `coladmin`.`adminID`
        WHERE `coladmin`.`colCode` = ? AND DATE(`collegeadmin_log`.`timestamp`) >= ? 
        AND DATE(`collegeadmin_log`.`timestamp`) <= ? ORDER BY `collegeadmin_log`.`timestamp` DESC";

        $stmt = mysqli_prepare($con, $query);
        $stmt->bind_param('sss', $college, $startDate, $endDate);
    } else {
        // no filter
        getCollegeAction($con);
    }

    $stmt->execute();
    $result = $stmt->get_result();
    $row = mysqli_num_rows($result);

    getDetails($result, $row, $con); //get details
}
