<?php    
    require_once('sensitive_data.php');
    mysql_connect($host, $username, $password);
    mysql_selectdb($database);
    
    $query = "SELECT DISTINCT summonerName FROM games";
    
    $result = mysql_query($query);
    
    if ($result) {
        $count = 0;
        $numRows = mysql_num_rows($result);
        while($row = mysql_fetch_array($result)) {
          $count++;
          $arr[] = $row['summonerName'];
        }
    }
    $arr_json = json_encode($arr);
    
    mysql_close();
    
    echo $arr_json;
?>