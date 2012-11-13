<?php

require_once('sensitive_data.php');
require_once('PhpConsole.php');
PhpConsole::start();

/** Clean cookies mm cookies **/
if (get_magic_quotes_gpc() == true) {
 foreach($_COOKIE as $key => $value) {
   $_COOKIE[$key] = stripslashes($value);
  }
}

$champId = $_COOKIE['champId'];
$name = $_COOKIE['summoner_name'];

mysql_connect($host, $username, $password);
mysql_selectdb($database);

$query = 'SELECT win,lose FROM games';
$query .= " WHERE summonerName='$name' ";
if ($champId && $champId != '') {
  $query .= " AND championId='$champId' ";
}

$winrate = 0;
$gamesPlayed = 0;
$trend_arr = array();
$trendLength = 10; // how many games is a 'trend'
$wins = 0;
$losses = 0;
$ret_arr = array();

$result = mysql_query($query);

if ($_POST['trendy']) { // if getting the trendy winrate
  debug('===');
  debug('::trendy winrate::');
  if ($result) {
    while ($row = mysql_fetch_array($result)) {
      $wins += $row['win'];
      $gamesPlayed += 1;
      array_push($trend_arr, $row['win']);
      if ($gamesPlayed > $trendLength) {
        array_shift($trend_arr); // push the oldest value off the cliff
      }
      $winrate = array_sum($trend_arr) / count($trend_arr) * 100; // get the winrate percentage
      array_push($ret_arr, $winrate);
      debug("game #$gamesPlayed: winrate: $winrate, trendwins: " . array_sum($trend_arr) . ", trendgames: " . count($trend_arr));
    }
  }
} else { // if getting the overall winrate
  debug('===');
  debug('::overall winrate::');
  if ($result) {
    while ($row = mysql_fetch_array($result)) {
      $wins += $row['win'];
      $gamesPlayed += 1;
      $winrate = $wins / $gamesPlayed * 100; // winrate percentage
      array_push($ret_arr, $winrate);
      debug("game #$gamesPlayed: winrate:$winrate, wins: $wins, games: $gamesPlayed");
    }
  }
}

mysql_close();

echo json_encode($ret_arr);



?>