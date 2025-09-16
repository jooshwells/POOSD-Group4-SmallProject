<?php
    $inData = getRequestInfo();
    
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $phone = $inData["phone"];
    $email = $inData["email"];
    $userId = $inData["userId"];

    // Validate phone number syntax (123-456-7890) using a regular expression
    if (!preg_match("/^\d{3}-\d{3}-\d{4}$/", $phone))
    {
        returnWithError("Invalid phone number format. Use 123-456-7890.", 400);
    }
    // Validate email address using filter_var
    else if (!filter_var($email, FILTER_VALIDATE_EMAIL))
    {
        returnWithError("Invalid email address format.", 400);
    }
    else
    {
        $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
        if ($conn->connect_error) 
        {
            returnWithError( $conn->connect_error , 500);
        } 
        else
        {
            $stmt = $conn->prepare("INSERT into Contacts (FirstName,LastName,Phone,Email,UserID) VALUES(?,?,?,?,?)");
            $stmt->bind_param("sssss", $firstName, $lastName, $phone, $email, $userId);
            $stmt->execute();
            $stmt->close();
            $conn->close();
            returnWithError("", 200);
        }
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson( $obj )
    {
        header('Content-type: application/json');
        echo $obj;
    }
    
    function returnWithError( $errmsg, $errcode )
    {
		http_response_code($errcode); 

        $retValue = '{"error":"' . $errmsg . '"}';
        sendResultInfoAsJson( $retValue );
    }
    
?>