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

if (isset($_COOKIE['gameRange'])) {
  $gameRange = $_COOKIE['gameRange'];
} else {
  $gameRange = 100000;
}

$champId = $_COOKIE['champId'];
$name = $_COOKIE['summoner_name'];

$mysqli = new mysqli($host, $username, $password);
$mysqli->select_db($database);

$query = 'SELECT championId,win,lose FROM games';
$query .= " WHERE summonerName='$name' ";

$winrate = 0;
$gamesPlayed = 0;
$trend_arr = array();
$trendLength = 10; // how many games is a 'trend'
$wins = 0;
$losses = 0;
$ret_arr = array();

$result = $mysqli->query($query);

if ($_POST['trendy']) { // if getting the trendy winrate
  if ($result) {
  $totalGamesFound = 0;
    while ($row = $result->fetch_assoc()) {
      if ($champId && $champId != '') { // if we're sorting by champ
        if ($row['championId'] == $champId) { // if this is the right champ
          $wins += $row['win'];
          $gamesPlayed += 1;
          array_push($trend_arr, $row['win']);
          if ($gamesPlayed > $trendLength) {
            array_shift($trend_arr); // push the oldest value off the cliff
          }
          $winrate = array_sum($trend_arr) / count($trend_arr) * 100; // get the winrate percentage
        }
      } else { // not sorting by champ
        $wins += $row['win'];
        $gamesPlayed += 1;
        array_push($trend_arr, $row['win']);
        if ($gamesPlayed > $trendLength) {
          array_shift($trend_arr); // push the oldest value off the cliff
        }
        $winrate = array_sum($trend_arr) / count($trend_arr) * 100; // get the winrate percentage
      }
      if (!$winrate) {
        $winrate = 50;
      }
      
      array_push($ret_arr, $winrate);
      $totalGamesFound += 1;
      if ($totalGamesFound > $gameRange) {
        array_shift($ret_arr);
      }
    }
  }
} else { // if getting the overall winrate
  if ($result) {
    while ($row = $result->fetch_assoc()) {
      $wins += $row['win'];
      $gamesPlayed += 1;
      $winrate = $wins / $gamesPlayed * 100; // winrate percentage
      array_push($ret_arr, $winrate);
    }
  }
}
debug("in winrate.php, games played: $gamesPlayed");


$mysqli->close();

echo json_encode($ret_arr);

?>