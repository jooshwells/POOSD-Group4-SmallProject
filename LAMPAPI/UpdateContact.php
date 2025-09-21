<?php
    $inData = getRequestInfo();
    
    if (!isset($inData["contactId"]) || !isset($inData["userId"]))
    {
        returnWithError("contactId and userId are required fields.", 400);
    }

    $contactId = $inData["contactId"];
    $userId = $inData["userId"];

    $updateFields = [];
    $bindParams = '';
    $bindValues = [];

    if (isset($inData["firstName"]))
    {
        $updateFields[] = "FirstName = ?";
        $bindParams .= 's';
        $bindValues[] = $inData["firstName"];
    }
    if (isset($inData["lastName"]))
    {
        $updateFields[] = "LastName = ?";
        $bindParams .= 's';
        $bindValues[] = $inData["lastName"];
    }
    if (isset($inData["phone"]))
    {
        if (!preg_match("/^\d{3}-\d{3}-\d{4}$/", $inData["phone"]))
        {
            returnWithError("Invalid phone number format. Use 123-456-7890.", 400);
        }
        $updateFields[] = "Phone = ?";
        $bindParams .= 's';
        $bindValues[] = $inData["phone"];
    }
    if (isset($inData["email"]))
    {
        if (!filter_var($inData["email"], FILTER_VALIDATE_EMAIL))
        {
            returnWithError("Invalid email address format.", 400);
        }
        $updateFields[] = "Email = ?";
        $bindParams .= 's';
        $bindValues[] = $inData["email"];
    }

    if (empty($updateFields))
    {
        returnWithError("No fields provided to update.", 400);
    }
    else
    {
        $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
        if ($conn->connect_error) 
        {
            returnWithError($conn->connect_error, 500);
        } 
        else
        {
            $sql = "UPDATE Contacts SET " . implode(", ", $updateFields) . " WHERE ID = ? AND UserID = ?";
            $stmt = $conn->prepare($sql);

            $bindParams .= 'ss';
            $bindValues[] = $contactId;
            $bindValues[] = $userId;

            $stmt->bind_param($bindParams, ...$bindValues);
            
            $stmt->execute();
            
            if ($stmt->affected_rows > 0)
            {
                returnWithError("", 200);
            }
            else
            {
                returnWithError("Contact not found or no changes were made.", 404);
            }
            
            $stmt->close();
            $conn->close();
        }
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }
    
    function returnWithError($errmsg, $errcode)
    {
        http_response_code($errcode); 
        $retValue = '{"error":"' . $errmsg . '"}';
        sendResultInfoAsJson($retValue);
    }
?>
