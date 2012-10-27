<?php
/**
 * Get data for graphing purposes from the SQL table.
 * Echoes back data of the form x1:y1,x2:y2,x3:y3
 */
require_once('sensitive_data.php');

mysql_connect($host, $username, $password);
mysql_selectdb($database);

$name = $_POST['summonerName'];
$x = $_POST['x_field'];
$y = $_POST['y_field'];

$query = "SELECT $x,$y FROM games WHERE summonerName='$name' ORDER BY gameID DESC";

$result = mysql_query($query);

if ($result) {
  $count = 0;
  $numRows = mysql_num_rows($result);
  while($row = mysql_fetch_array($result)) {
    $count++;
    echo $row[$x] . ":" . $row[$y];
    if ($count < $numRows)
      echo ",";
  }
}

mysql_close();

?>