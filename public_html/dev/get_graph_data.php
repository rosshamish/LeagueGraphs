<?php
/**
 * Get data for graphing purposes from the SQL table.
 * Echoes back data of the form x1:y1,x2:y2,x3:y3
 */
require_once('sensitive_data.php');

mysql_connect($host, $username, $password);
mysql_selectdb($database);

/** Clean cookies mm cookies **/
if (get_magic_quotes_gpc() == true) {
 foreach($_COOKIE as $key => $value) {
   $_COOKIE[$key] = stripslashes($value);
  }
}

//$name = $_POST['summonerName']; // this is the PASSED value

//$y = $_POST['y_field']; // this is the PASSED value
//$champId = $_POST['champId']; // this is the PASSED value

$name = $_COOKIE['summoner_name']; // this is the COOKIE value
$x = 'gameId'; // this is always gameId anyway, who gives a care.
$y_arr = json_decode($_COOKIE['filters'], true); // this is the COOKIE value
$champId = $_COOKIE['champId']; // this is the COOKIE value

$query = "SELECT $x"; // start off the query with a select by x value,

for ($i=0; $i<count($y_arr); $i++) {
  $query .= ",$y_arr[$i]";
}

$query .= " FROM games WHERE summonerName='$name' ";
if ($champId && $champId != '') {
  $query .= " AND championId='$champId' ";
}

$query .= " ORDER BY gameID ASC"; // finish off the query by ordering it

//echo "query: $query"; // query is working k on Nov 8, 2012 @ 10:51pm

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