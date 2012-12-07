<?php

require_once('sensitive_data.php');
require_once('PhpConsole.php');
PhpConsole::start();

$mysqli = new mysqli($host, $username, $password);
$mysqli->select_db($database);

$summoner_name = $mysqli->real_escape_string($_POST['summonerName']);

$query = "INSERT INTO players VALUES ('$summoner_name')";

$result = $mysqli->query($query);

$mysqli->close();

?>