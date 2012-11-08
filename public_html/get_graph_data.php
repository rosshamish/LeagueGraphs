<?php
/**
 * Get data for graphing purposes from the SQL table.
 * Echoes back data of the form x1:y1,x2:y2,x3:y3
 */
require_once('sensitive_data.php');

mysql_connect($host, $username, $password);
mysql_selectdb($database);

$name = $_POST['summonerName'];
//$debug->debug('name', null, LOG);
$x = $_POST['x_field'];
$y = $_POST['y_field'];
$champId = $_POST['champId'];

if ($champId == '') {
  $query = "SELECT $x,$y FROM games WHERE summonerName='$name' ORDER BY gameID ASC";
} else {
  $query = "SELECT $x,$y FROM games WHERE summonerName='$name' AND championId='$champId' ORDER BY gameID ASC";
}

$result = mysql_query($query);
$ret_arr = array();

if ($result) {
  $count = 0;
  $numRows = mysql_num_rows($result);
  while($row = mysql_fetch_array($result)) {
    $count++;
    $row_array["x"] = $row[$x];
    $row_array["y"] = $row[$y];
    array_push($ret_arr, $row_array);
  }
}

echo json_encode($ret_arr);

mysql_close();

?>