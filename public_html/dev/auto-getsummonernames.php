<?php    
    require_once('sensitive_data.php');
    $mysqli = new mysqli($host, $username, $password);
    $mysqli->select_db($database);
    
    $query = "SELECT DISTINCT summonerName FROM games";
    
    $result = $mysqli->query($query);
    
    if ($result) {
        $count = 0;
        $numRows = $result->num_rows;
        while($row = $mysqli->fetch_assoc($result)) {
          $count++;
          $arr[] = $row['summonerName'];
        }
    }
    $arr_json = json_encode($arr);
    
    $mysqli->close();
    
    echo $arr_json;
?>