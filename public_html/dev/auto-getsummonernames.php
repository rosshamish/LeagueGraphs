<?php    
    require_once('sensitive_data.php'); # $host, $username, $password, $database
    $mysqli = new mysqli($host, $username, $password);
    $mysqli->select_db($database);
    
    $query = "SELECT DISTINCT summonerName FROM players";
    
    $result = $mysqli->query($query);
    
    if ($result) {
        $count = 0;
        $numRows = $result->num_rows;
        while($row = $result->fetch_assoc()) {
          $count++;
          $arr[] = $row['summonerName'];
        }
    }
    $arr_json = json_encode($arr);
    
    $mysqli->close();
    
    echo $arr_json;
?>