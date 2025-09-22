<?php

    $inData = getRequestInfo();
    
    $searchResults = "";
    $searchCount = 0;

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error) 
    {
        returnWithError( $conn->connect_error );
    } 
    else
    {
	$sql = "SELECT ID, FirstName, LastName, Phone AS PhoneNumber, Email AS EmailAddress FROM Contacts WHERE UserID = ?";

        $params = [$inData['userId']];
        $types = 'i';

        if (!empty($inData['firstName']) || !empty($inData['lastName']) || !empty($inData['phone']) || !empty($inData['email'])) {
            $searchConditions = [];
            if (!empty($inData['firstName'])) {
                $searchConditions[] = "FirstName LIKE ?";
                $params[] = "%" . $inData['firstName'] . "%";
                $types .= 's';
            }
            if (!empty($inData['lastName'])) {
                $searchConditions[] = "LastName LIKE ?";
                $params[] = "%" . $inData['lastName'] . "%";
                $types .= 's';
            }
            if (!empty($inData['phone'])) {
                $searchConditions[] = "Phone LIKE ?";
                $params[] = "%" . $inData['phone'] . "%";
                $types .= 's';
            }
            if (!empty($inData['email'])) {
                $searchConditions[] = "Email LIKE ?";
                $params[] = "%" . $inData['email'] . "%";
                $types .= 's';
            }
            $sql .= " AND (" . implode(" AND ", $searchConditions) . ")";
        }

        $stmt = $conn->prepare($sql);

        $bindParams = [];
        $bindParams[] = $types;
        foreach ($params as $key => &$value) {
            $bindParams[] = &$value;
        }

        call_user_func_array([$stmt, 'bind_param'], $bindParams);

        $stmt->execute();
        
        $result = $stmt->get_result();

        $searchArray = array();

        while($row = $result->fetch_assoc())
        {
            $searchArray[] = $row;
        }
            
        if (empty($searchArray)) {
            returnWithError("No Records Found");
        } else {
            $searchResults = json_encode($searchArray);
            returnWithInfo($searchResults);
        }

        $stmt->close();
        $conn->close();
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
    
    function returnWithError( $err )
    {
        $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }
    
    function returnWithInfo( $searchResults )
    {
        $retValue = '{"results":' . $searchResults . ',"error":""}';
        sendResultInfoAsJson( $retValue );
    }
    
?>
