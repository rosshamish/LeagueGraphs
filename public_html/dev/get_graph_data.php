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
if (isset($_COOKIE['gameRange'])) {
  $gameRange = $_COOKIE['gameRange'];
} else {
  $gameRange = 100000;
}
if (isset($_COOKIE['gameType'])) {
  $gameType = $_COOKIE['gameType'];
} else {
  $gameType = $_POST['gameType'];
}


$query = "SELECT *"; // select all the data

$query .= " FROM games WHERE summonerName='$name' "; // filter by the current summoner

if ($gameType != null) { // gametype exists
  if ($gameType != 'all' && $gameType != '') { // if we are actually filtering a gametype
    $query .= " AND queueType='$gameType' ";
  }
}

$query .= " ORDER BY gameID ASC"; // finish off the query by ordering it

//echo "query: $query"; // query is working k on Nov 8, 2012 @ 10:51pm
$result = $mysqli->query($query);
$ret_arr = array();

if ($result) {
  if ($result->num_rows <= 0) { // if no games were found
    echo json_encode(array('x' => 0,
                           'y' => 0,
                           'gameFound' => false));
    return;
  }
  
  /* Get field information for all columns */
  $fieldobj = $result->fetch_fields();
  
  $totalGamesFound = 0;
  while($row = $result->fetch_assoc()) {
    // set the games_found flag to false at the beginning of each row loop, set it to true once we are sure this game applies.
    $game_found = false;
    
    $row_array["x"] = $row[$x];
    $row_y_arr = array();
    for ($i=0; $i<count($y_arr); $i++) {
      array_push($row_y_arr, $row[$y_arr[$i]]);
    }
    
    /** Handle champ filtering **/
    if ($champId && $champId != '') { 
      if ($row['championId'] != $champId) { // if this is the wrong champ
        for ($j=0; $j<count($row_y_arr); $j++) { 
          $row_y_arr[$j] = 0; // set the WRONG champ's game to 0.
        }
      } else { // if this is the correct champ, then at least one game was found.
        $game_found = true;
      }
    } else {
      $game_found = true; // if no champId filter was set, there must be at least 1 game.
    }
    
    $row_array['game_found'] = $game_found;
    $row_array["y"] = $row_y_arr;
    foreach ($fieldobj as $val) {
      $row_array[$val->name] = $row[$val->name];
    }
    
    $row_array["filter"] = $y_arr; // set a reference to the filter name, so we can so dynamic scaling of the graph
    array_push($ret_arr, $row_array);
    
    $totalGamesFound += 1;
    /** Delete the oldest game if we are enough games in that it makes sense to do so, given the desired range of games **/
    if ($totalGamesFound > $gameRange) {
      array_shift($ret_arr);
    }
  }
}

// set the $ret_arr flag of whether at least one game was found or not (mainly for champId purposes)
echo json_encode($ret_arr);

$mysqli->close();

?>