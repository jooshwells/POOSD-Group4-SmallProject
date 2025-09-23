<?php

    $inData = getRequestInfo();
    
    $searchResults = "";
    $searchCount = 0;
    
    // New: Get limit and offset from the request
    $limit = isset($inData['limit']) ? intval($inData['limit']) : 10;
    $offset = isset($inData['offset']) ? intval($inData['offset']) : 0;

    $conn = new mysqli("db", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error) 
    {
        returnWithError( $conn->connect_error );
    } 
    else
    {
	    // The search is now integrated into the main SQL query
        $sql = "SELECT ID, FirstName, LastName, Phone AS PhoneNumber, Email AS EmailAddress FROM Contacts WHERE UserID = ?";

        $params = [$inData['userId']];
        $types = 'i';

        if (!empty($inData['search'])) {
            $sql .= " AND (FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ?)";
            $searchQuery = "%" . $inData['search'] . "%";
            $params = array_merge($params, array($searchQuery, $searchQuery, $searchQuery, $searchQuery));
            $types .= 'ssss';
        }
        
        // New: Add LIMIT and OFFSET to the query
        $sql .= " ORDER BY LastName LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;
        $types .= 'ii';

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