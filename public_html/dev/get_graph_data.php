<?php
/**
 * Get data for graphing purposes from the SQL table.
 * Echoes back data of the form x1:y1,x2:y2,x3:y3
 */
require_once('sensitive_data.php');
require_once('PhpConsole.php');
PhpConsole::start();

$mysqli = new mysqli($host, $username, $password);
$mysqli->select_db($database);

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
if (isset($_COOKIE['filters'])) {
  $y_arr = json_decode($_COOKIE['filters'], true); // this is the COOKIE value
} else {
  $y_arr = array();
}

if (isset($_COOKIE['champId'])) {
  $champId = $_COOKIE['champId']; // this is the COOKIE value
} else {
  $champId = '';
}


$query = "SELECT $x,championId"; // start off the query with a select by x value and champId for filtering

for ($i=0; $i<count($y_arr); $i++) {
  $query .= ",$y_arr[$i]";
}

$query .= " FROM games WHERE summonerName='$name' ";

$query .= " ORDER BY gameID ASC"; // finish off the query by ordering it

//echo "query: $query"; // query is working k on Nov 8, 2012 @ 10:51pm

$result = $mysqli->query($query);
$ret_arr = array();

if ($result) {
  while($row = $mysqli->fetch_assoc($result)) {
    $row_array["x"] = $row[$x];
    $row_y_arr = array();
    for ($i=0; $i<count($y_arr); $i++) {
      array_push($row_y_arr, $row[$y_arr[$i]]);
    }
    if ($champId && $champId != '') {
      if ($row['championId'] != $champId) {
        debug("resetting filtered row, found champ " . $row['championId'] . ", looking for $champId.");
        for ($j=0; $j<count($row_y_arr); $j++) {
          $row_y_arr[$j] = 0;
        }
      } else {
        debug("leaving this value alone, found the right champId");
      }
    }
    $row_array["y"] = $row_y_arr; 
    $row_array["filter"] = $y_arr; // set a reference to the filter name, so we can so dynamic scaling of the graph
    array_push($ret_arr, $row_array);
  }
}

echo json_encode($ret_arr);

$mysqli->close();

?>