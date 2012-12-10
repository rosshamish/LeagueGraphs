<?php

require_once('sensitive_data.php'); # $host, $username, $password, $database, $r_region, $r_key, $r_base_url
require_once('PhpConsole.php');
PhpConsole::start();

$mysqli = new mysqli($host, $username, $password);
$mysqli->select_db($database);

$query = "SELECT summonerName FROM players";

$result = $mysqli->query($query);

if ($result) {
    $numRows = $result->num_rows;
}
$ret_obj['currently_tracking'] = $numRows;

$query = 'SELECT gameId FROM games';

$result = $mysqli->query($query);
if ($result) {
  $numRows = $result->num_rows;
}
$ret_obj['games_in_database'] = $numRows;

echo json_encode($ret_obj);

$mysqli->close();

?>