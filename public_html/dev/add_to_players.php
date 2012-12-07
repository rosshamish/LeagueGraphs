<?php

require_once('sensitive_data.php');
require_once('PhpConsole.php');
PhpConsole::start();
$playerCap = 5000;

$mysqli = new mysqli($host, $username, $password);
$mysqli->select_db($database);

$summoner_name = $mysqli->real_escape_string($_POST['summonerName']);

$query = "SELECT DISTINCT summonerName FROM players";
    
$result = $mysqli->query($query);

if ($result) {
    $numRows = $result->num_rows;
    if ($numRows < $playerCap) { // if we haven't reached the player cap
      // do normal stuff
      $query = "INSERT INTO players VALUES ('$summoner_name')";
      $result = $mysqli->query($query);
      echo json_encode(array('capped' => false,
                             'cap' => $playerCap));
    } else { // we've reached the player cap
      echo json_encode(array('capped' => true,
                             'cap' => $playerCap));
    } 
} else {
  echo json_encode(array('capped' => false,
                             'cap' => $playerCap));
}

$mysqli->close();

?>