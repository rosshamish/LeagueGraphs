<?php

require_once('sensitive_data.php');
require_once('PhpConsole.php');
PhpConsole::start();

mysql_connect($host, $username, $password);
mysql_selectdb($database);

$query = "SELECT DISTINCT summonerName FROM games";

$result = mysql_query($query);

if ($result) {
    $numRows = mysql_num_rows($result);
}
$ret_obj['currently_tracking'] = $numRows;

$query = 'SELECT gameId FROM games';

$result = mysql_query($query);
if ($result) {
  $numRows = mysql_num_rows($result);
}
$ret_obj['games_in_database'] = $numRows;

echo json_encode($ret_obj);

mysql_close();

?>