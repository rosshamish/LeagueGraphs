<?php

require_once('sensitive_data.php');
require_once('PhpConsole.php');
PhpConsole::start();

$mysqli = new mysqli($host, $username, $password);
$mysqli->select_db($database);

$summoner_name = $_POST['summonerName'];

$query = "INSERT INTO players VALUES $summoner_name";

$mysqli->query($query);

$mysqli->close();

?>