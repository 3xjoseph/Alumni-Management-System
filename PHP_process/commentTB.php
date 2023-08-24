<?php
require_once 'notificationTable.php';
class Comment
{
    public function getPostComments($postID, $con)
    {
        $query = 'SELECT * FROM `comment` WHERE `postID`= "' . $postID . '" ORDER BY `timestamp` DESC';
        $result = mysqli_query($con, $query);
        $row = mysqli_num_rows($result);

        $response = "";
        $commentID = array();
        $fullname  = array();
        $comment = array();
        $profilePic = array();

        if ($result && $row > 0) {
            $response = "Success";
            while ($data = mysqli_fetch_assoc($result)) {
                $commentID[] = $data['commentID'];
                $comment[] = $data['comment'];
                $user = $data['username'];


                $queryPerson = "SELECT 'univadmin' AS user_type, p.fname, p.lname, p.profilepicture
                FROM univadmin ua
                JOIN person p ON p.personID = ua.personID
                WHERE ua.username = '$user'
                UNION
                SELECT 'alumni' AS user_type, p.fname, p.lname, p.profilepicture
                FROM alumni al
                JOIN person p ON p.personID = al.personID
                WHERE al.username = '$user'
                UNION
                SELECT 'student' AS user_type, p.fname, p.lname, p.profilepicture
                FROM student s
                JOIN person p ON p.personID = s.personID
                WHERE s.username = '$user';
                ";

                $resultPerson = mysqli_query($con, $queryPerson);
                if ($resultPerson) {
                    while ($personData = mysqli_fetch_assoc($resultPerson)) {
                        $fullname[] = $personData['fname'] . ' ' . $personData['lname'];
                        $img = $personData['profilepicture'];
                        $profilePic[] = base64_encode($img);
                    }
                }
            }
        } else $response = "Unsuccess";

        $data = array(
            "result" => $response,
            'commentID' => $commentID,
            'fullname' => $fullname,
            'comment' => $comment,
            'profile' => $profilePic
        );

        echo json_encode($data);
    }

    public function insertComment($username, $postID, $comment, $con)
    {
        $random = rand(0, 4000);
        $timestamp = date('Y-m-d H:i:s');
        $commendID = substr($postID, 0, 5) . $random  . $timestamp;

        $query = "INSERT INTO `comment`(`commentID`, `username`, `postID`, `comment`, `timestamp`) 
        VALUES ('$commendID','$username','$postID','$comment','$timestamp')";
        $result = mysqli_query($con, $query);

        if ($result) {
            //add to notification
            $typeOfNotif = 'comment';
            $notifObj = new Notification();

            //get the username of the one who post
            $queryUN = "SELECT `username` FROM `post` WHERE `postID`= '$postID'";
            $postUNResult = mysqli_query($con, $queryUN);
            $data = mysqli_fetch_assoc($postUNResult);
            $postUsername = $data['username'];


            //perform insertion
            $insertNotif = $notifObj->insertNotif($postID, $postUsername, $typeOfNotif, $con);
            if ($insertNotif) echo 'Success';
            else 'Unsuccess';
        } else echo 'Unsuccess';
    }
}