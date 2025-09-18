<?php
    $inData = getRequestInfo();
    
    $contactId = $inData["contactId"];
    $userId = $inData["userId"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error) 
    {
        returnWithError( $conn->connect_error , 500);
    } 
    else
    {
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=? AND UserID=?");
        $stmt->bind_param("ss", $contactId, $userId);
        $stmt->execute();

        $deleteSuccess = false;
        
        if ($stmt->affected_rows > 0)
        {
            $deleteSuccess = true;
        }

        $stmt->close();
        $conn->close();
        
        if($deleteSuccess == false)
        {
            returnWithError("Contact not found or could not be deleted.", 400);
        }
        else
        {
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