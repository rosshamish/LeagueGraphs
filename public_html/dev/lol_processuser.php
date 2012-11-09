<?php
// get the keys, passes and such
require_once('sensitive_data.php');

// Data conversion functions to help the updateRow be cleaner
// turns 'true' and 'false' to '1' and '0' respectively
function atob($str) {
    
   $str = strtolower($str);
   if ($str == 'true') {
       return '1';
   } else {
       return '0';
   }
}
// removes the quotations around the string
function atosql($str) {
    $str = substr($str, 1, count($str)-2);
    
    return $str;
}

// returns the intval of the string
function atoi($str) {
   return intval($str);
}



/**
 * Region and Key values, for validating each url
 */
// all in other php file now

/**
 * MySQL values
 */
// all in other php file now

/**
 * @base_url => the base elophant url, eg 'http://elophant.com/api/v1/'
 * @region => the region code, eg na, euw
 * @key => the dev key
 * @request => the request url from elophant, e.g. 'getSummonerName'
 * @params => the GET paramaters as an associative array, e.g. arry('summonerName' => 'RayRayUre');
 * @json => boolean, specify TRUE and it will return a json string. Specify FALSE to have the func return an associative array.
 * @return => either a json string OR an associative array containing all data that was returned from Elophant
 */
function getEloData($base_url, $region, $key, $request, $params, $json) {
    
    // Build the url
    $keys = array_keys($params);
    $count = count($keys);
    $data_string = '';
    for ($i = 0; $i < $count; $i++) {
        if ($i > 0) {
            $data_string = $data_string . '&';
        }
        $data_string = $data_string . $keys[$i] . '=' . $params[$keys[$i]];
    }
    
    $url = $base_url . $region . '/' . $request . '?' . $data_string . '&key=' . $key;

    // Get the data from the url
    $ch = curl_init($url);                                                                  
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $json_response = curl_exec($ch);
    curl_close($ch);
    
    if ($json) {
        return $json_response;
    } else {
        $returned_data = json_decode($json_response);
        return (array)$returned_data;
    }
}


function updateRow($region, $key, $base_url, $host, $username, $password, $database, $summoner_array) {
    
    // Connect to the database
    mysql_connect($host, $username, $password);
    @mysql_select_db($database) or die( "Unable to select database");
    
    // Count how many games are grabbed/nommed/parsed.
    $gamesSuccessfullyParsed = 0;
    
    // reset fields before the initial iteration
    if (true) {
        /** Fields can be found at sql_fields.txt */
        $primaryKey = 73577357;
        
        $accountId = 7357; // int
        $summonerName = 'test'; // string
        
        $ranked = '0'; // bool
        $level = 7357; // int
        $userServerPing = 7357; // int
        $createDate = '7357'; // string
        $gameId = 0; // int
        
        $ipEarned = 7357; // int
        $experienceEarned = 7357; // int
        
        $gameMapId = 7357; // int
        $leaver = false; // bool
        
        $timeInQueue = 7357; // int
        $premadeTeam = false; // bool
        $premadeSize = 7357; // int
        $gameMode = '7357'; // string
        $gameType = '7357'; // string
        $gameTypeEnum = '7357'; // string
        $queueType = '7357'; // string
        $subType = '7357'; // string
        
        $teammate0 = '0'; // string
        $teammate0champ = '0'; // string
        $teammate1 = '0'; // string
        $teammate1champ = '0'; // string
        $teammate2 = '0'; // string
        $teammate2champ = '0'; // string
        $teammate3 = '0'; // string
        $teammate3champ = '0'; // string
        
        $championId = 7357; // int
        $spell1 = 7357; // int
        $spell2 = 7357; // int
        
        $win = 0; // int
        $lose = 0; // int
        
        $largestMultiKill = 0; // int
        $largestKillingSpree = 0; // int
        
        $championsKilled = 0; // int
        $numDeaths = 0; // int
        $assists = 0; // int
        $minionsKilled = 0; // int
        $goldEarned = 7357; // int
        
        $neutralMinionsKilled = 0; // int
        $turretsKilled = 0; // int
        $barracksKilled = 0; // int
        
        $sightWardsBoughtInGame = 0; // int
        $totalHeal = 0; // int
        
        $item0 = 0; // int
        $item1 = 0; // int
        $item2 = 0; // int
        $item3 = 0; // int
        $item4 = 0; // int
        $item5 = 0; // int
        
        $totalDamageDealt = 7357; // int
        $physicalDamageDealtPlayer = 7357; // int
        $magicDamageDealtPlayer = 7357; // int
        $largestCriticalStrike = 0; // int
        
        $totalDamageTaken = 7357; // int
        $physicalDamageTaken = 7357; // int
        $magicDamageTaken = 7357; // int
        
        $totalTimeSpentDead = 0; // int
    }
    
    
    // Get at recent games data
    $account_id_arr = array(
                 'accountId' => $summoner_array['acctId']
                 );
    
    $recent_games = getEloData($base_url, $region, $key, 'getRecentGames', $account_id_arr, TRUE);
    //echo $recent_games;
    $rec_arr = (array)json_decode($recent_games);
    // for each field in recent games
    foreach($rec_arr as $i_key => $i_val) {
        // gamestatistics
        if ($i_key == 'gameStatistics') {
            $all_games = (array)$rec_arr[$i_key];
            
            // for each game in gamestatistics, start with the MOST RECENT (9/9) moving towards OLDEST (0/9);
            for($game_num = count($all_games)-1; $game_num >= 0; $game_num--) {
                $cur_game = (array)$all_games[$game_num];
                
                // for each field in the current game
                foreach($cur_game as $field => $value) {
                    
                    // if it is fellowPlayers
                    if ($field == 'fellowPlayers') {
                        // get the players array
                        $players = (array)$cur_game[$field];
                        $teammatesCount = 0;
                        // for each player
                        for ($p_id=0; $p_id < count($players); $p_id++) {
                            // get the current player
                            $cur_player = (array)$players[$p_id];
                            // if this person is on my team, then add them to teammates
                            $my_teamId = $cur_game['teamId'];
                            if ($cur_player['teamId'] == $my_teamId) {
                                switch($teammatesCount) {
                                    case 0: // this is the first teammate found 
                                        $teammate0 = $cur_player['summonerName'];
                                        $teammate0champ = $cur_player['championId'];
                                        break;
                                    case 1: // this is the second teammate found
                                        $teammate1 = $cur_player['summonerName'];
                                        $teammate1champ = $cur_player['championId'];
                                        break;
                                    case 2: // this is the third teammate found
                                        $teammate2 = $cur_player['summonerName'];
                                        $teammate2champ = $cur_player['championId'];
                                        break;
                                    case 3: // this is the fourth teammate found
                                        $teammate3 = $cur_player['summonerName'];
                                        $teammate3champ = $cur_player['championId'];
                                        break;
                                }
                                $teammatesCount++;
                            }
                            // for each field in the current player
                            foreach ($cur_player as $p_field => $p_value) {
                                $str_p_value = var_export($p_value, TRUE);
                                
                                // echo "cur_player => $p_id, p_field => $p_field, p_value => $str_p_value <br>";
                            }
                        }
                    // else if it is statistics
                    } else if ($field == 'statistics') {
                        // get the statistics array
                        $stats = (array)$cur_game[$field];
                        
                        // for each statistic
                        for ($s_id=0; $s_id < count($stats); $s_id++) {
                            // get the current stat
                            $cur_stat = (array)$stats[$s_id];
                            
                            $statName = $cur_stat['statType'];
                            $statValue = $cur_stat['value'];
                            // apply values to all of the sql variables via switch case on the field
                            switch($statName) {
                                case "WIN": // WIN - bool bit - is represented by 0 or 1 in the JSON though
                                    $win = $statValue;
                                    break;
                                case "LOSE": // LOSE - bool bit - is represented by 0 or 1 in the JSON though
                                    $lose = $statValue;
                                    break;
                                case "LARGEST_MULTI_KILL": // LARGEST_MULTI_KILL - int
                                    $largestMultiKill = atoi($statValue);
                                    break;
                                case "LARGEST_KILLING_SPREE": // LARGEST_KILLING_SPREE - int
                                    $largestKillingSpree = atoi($statValue);
                                    break;
                                case "CHAMPIONS_KILLED": // CHAMPIONS_KILLED - int
                                    $championsKilled = atoi($statValue);
                                    break;
                                case "NUM_DEATHS": // NUM_DEATHS - int
                                    $numDeaths = atoi($statValue);
                                    break;
                                case "ASSISTS": // ASSISTS - int
                                    $assists = atoi($statValue);
                                    break;
                                case "MINIONS_KILLED": // MINIONS_KILLED - int
                                    $minionsKilled = atoi($statValue);
                                    break;
                                case "GOLD_EARNED": // GOLD_EARNED - int
                                    $goldEarned = atoi($statValue);
                                    break;
                                case "NEUTRAL_MINIONS_KILLED": // NEUTRAL_MINIONS_KILLED - int
                                    $neutralMinionsKilled = atoi($statValue);
                                    break;
                                case "TURRETS_KILLED": // TURRETS_KILLED - int
                                    $turretsKilled = atoi($statValue);
                                    break;
                                case "BARRACKS_KILLED": // BARRACKS_KILLED - int
                                    $barracksKilled = atoi($statValue);
                                    break;
                                case "SIGHT_WARDS_BOUGHT_IN_GAME": // SIGHT_WARDS_BOUGHT_IN_GAME - int
                                    $sightWardsBoughtInGame = atoi($statValue);
                                    break;
                                case "TOTAL_HEAL": // TOTAL_HEAL - int
                                    $totalHeal = atoi($statValue);
                                    break;
                                case "ITEM0": // ITEM0 - int
                                    $item0 = atoi($statValue);
                                    break;
                                case "ITEM1": // ITEM1 - int
                                    $item1 = atoi($statValue);
                                    break;
                                case "ITEM2": // ITEM2 - int
                                    $item2 = atoi($statValue);
                                    break;
                                case "ITEM3": // ITEM3 - int
                                    $item3 = atoi($statValue);
                                    break;
                                case "ITEM4": // ITEM4 - int
                                    $item4 = atoi($statValue);
                                    break;
                                case "ITEM5": // ITEM5 - int
                                    $item5 = atoi($statValue);
                                    break;
                                case "TOTAL_DAMAGE_DEALT": // TOTAL_DAMAGE_DEALT - int
                                    $totalDamageDealt = atoi($statValue);
                                    break;
                                case "PHYSICAL_DAMAGE_DEALT_PLAYER": // PHYSICAL_DAMAGE_DEALT_PLAYER - int
                                    $physicalDamageDealtPlayer = atoi($statValue);
                                    break;
                                case "MAGIC_DAMAGE_DEALT_PLAYER": // MAGIC_DAMAGE_DEALT_PLAYER - int
                                    $magicDamageDealtPlayer = atoi($statValue);
                                    break;
                                case "LARGEST_CRITICAL_STRIKE": // LARGEST_CRITICAL_STRIKE - int
                                    $largestCriticalStrike = atoi($statValue);
                                    break;
                                case "TOTAL_DAMAGE_TAKEN": // TOTAL_DAMAGE_TAKEN - int
                                    $totalDamageTaken = atoi($statValue);
                                    break;
                                case "PHYSICAL_DAMAGE_TAKEN": // PHYSICAL_DAMAGE_TAKEN - int
                                    $physicalDamageTaken = atoi($statValue);
                                    break;
                                case "MAGIC_DAMAGE_TAKEN": // MAGIC_DAMAGE_TAKEN - int
                                    $magicDamageTaken = atoi($statValue);
                                    break;
                                case "TOTAL_TIME_SPENT_DEAD": // TOTAL_TIME_SPENT_DEAD - int
                                    $totalTimeSpentDead = atoi($statValue);
                                    break;
                            }
                            
                            
                            
                            // for each field in the current stats
                            foreach ($cur_stat as $s_field => $s_value) {
                                $str_s_value = var_export($s_value, TRUE);
                                // echo "field =>$s_field, val => $str_s_value <br>";
                            }
                            
                        }
                    // else if it is NOT an arry, i.e. a general field
                    } else {
                        $str_value = var_export($value, TRUE);
                        // apply values to all of the sql variables via switch case on the field
                        switch ($field) {
                            case "ranked": // ranked - bool
                                $ranked = atob($str_value);
                                break;
                            
                            case "gameType": // gameType - string
                                $gameType = atosql($str_value);
                                break;
                            case "experienceEarned": // experienceEarned - int
                                $experienceEarned = atoi($str_value);
                                break;
                            
                            case "gameMapId": // gameMapId - int
                                $gameMapId = atoi($str_value);
                                break;
                            case "leaver": // leaver - bool
                                $leaver = atob($str_value);
                                break;
                            case "spell1": // spell1 - int
                                $spell1 = atoi($str_value);
                                break;
                            case "spell2": // spell2 - int
                                $spell2 = atoi($str_value);
                                break;
                            case "gameTypeEnum": // gameTypeEnum - string
                                $gameTypeEnum = atosql($str_value);
                                break;
                            
                            case "level": // level - int
                                $level = atoi($str_value);
                                break;
                            case "createDate": // createDate - string
                                $createDate = atosql($str_value);
                                break;
                            case "userServerPing": // userServerPing - int
                                $userServerPing = atoi($str_value);
                                break;
                            case "gameId": // gameId - int
                                $gameId = atoi($str_value);
                                break;
                            case "timeInQueue": // timeInQueue - int
                                $timeInQueue = atoi($str_value);
                                break;
                            case "ipEarned": // ipEarned - int
                                $ipEarned = atoi($str_value);
                                break;
                            case "gameMode": // gameMode - string
                                $gameMode = atosql($str_value);
                                break;
                            case "subType": // subType - string
                                $subType = atosql($str_value);
                                break;
                            case "queueType": // queueType - string
                                $queueType = atosql($str_value);
                                break;
                            case "premadeSize": // premadeSize - int
                                $premadeSize = atoi($str_value);
                                break;
                            case "premadeTeam": // premadeTeam - bool
                                $premadeTeam = atob($str_value);
                                break;
                            case "championId": // championId - int
                                $championId = atoi($str_value);
                                break;                            
                        }
                        
                        // echo "general field => $field, general value => $str_value <br>";
                    }
                }
                
                
                // do the query here (for each game)                
                // set $query
                if (true) {
                    /* Fields can be found at sql_fields.txt */
                    
                    /** Do fixes on fields that report weird values HERE */
                    
                    // fix the killing spree (if it isn't > 1, it doesn't get returned by Elophant)
                    // therefore, if you have at least one kill but no killing spree, your spree must be 1.
                    if ($championsKilled > 0 && $largestKillingSpree == 0) {
                        $largestKillingSpree = 1;
                    }
                    // fix the premade size value - for some reason, when you play a ranked 5v5
                    // game it gets reported as zero. Obviously this isn't right.
                    if ($queueType == 'RANKED_TEAM_5x5') {
                        $premadeSize = 5;
                    }
                    // fix weird custom game thing where it gets reported as 0
                    if ($premadeSize == 0) {
                        $premadeSize = 1;
                    }
                    // Set the accountId
                    $accountId = $summoner_array['acctId'];
                    // Set the summonerName
                    $summonerName = $summoner_array['name'];
                    // SET THE PRIMARY KEY
                    $pkey = strval($gameId) . strval($accountId);
                    // Set the query
                    $query = "INSERT INTO games VALUES (
                        '$pkey',
                        '$accountId',
                        '$summonerName',
                        '$ranked',
                        '$level',
                        '$userServerPing',
                        '$createDate',
                        '$gameId',
                        '$ipEarned',
                        '$experienceEarned',
                        '$gameMapId',
                        '$leaver',
                        '$timeInQueue',
                        '$premadeTeam',
                        '$premadeSize',
                        '$gameMode',
                        '$gameType',
                        '$gameTypeEnum',
                        '$queueType',
                        '$subType',
                        '$teammate0',
                        '$teammate0champ',
                        '$teammate1',
                        '$teammate1champ',
                        '$teammate2',
                        '$teammate2champ',
                        '$teammate3',
                        '$teammate3champ',
                        '$championId',
                        '$spell1',
                        '$spell2',
                        '$win',
                        '$lose',
                        '$largestMultiKill',
                        '$largestKillingSpree',
                        '$championsKilled',
                        '$numDeaths',
                        '$assists',
                        '$minionsKilled',
                        '$goldEarned',
                        '$neutralMinionsKilled',
                        '$turretsKilled',
                        '$barracksKilled',
                        '$sightWardsBoughtInGame',
                        '$totalHeal',
                        '$item0',
                        '$item1',
                        '$item2',
                        '$item3',
                        '$item4',
                        '$item5',
                        '$totalDamageDealt',
                        '$physicalDamageDealtPlayer',
                        '$magicDamageDealtPlayer',
                        '$largestCriticalStrike',
                        '$totalDamageTaken',
                        '$physicalDamageTaken',
                        '$magicDamageTaken',
                        '$totalTimeSpentDead'
                    );";
                }
                
                
                // execute the query
                $q_err = mysql_query($query)
                        or die(strval($gamesSuccessfullyParsed) . ":" . $summoner_array['name']);
                $gamesSuccessfullyParsed++;
                
                // clear all the values back to test or 7357 or 0
                if (true) {
                    /** Fields can be found at sql_fields.txt */
                    $primaryKey = 73577357;
                    
                    $accountId = 7357; // int
                    $summonerName = 'test'; // string
                    
                    $ranked = '0'; // bool
                    $level = 7357; // int
                    $userServerPing = 7357; // int
                    $createDate = '7357'; // string
                    $gameId = 0; // int
                    
                    $ipEarned = 7357; // int
                    $experienceEarned = 7357; // int
                    
                    $gameMapId = 7357; // int
                    $leaver = false; // bool
                    
                    $timeInQueue = 7357; // int
                    $premadeTeam = false; // bool
                    $premadeSize = 7357; // int
                    $gameMode = '7357'; // string
                    $gameType = '7357'; // string
                    $gameTypeEnum = '7357'; // string
                    $queueType = '7357'; // string
                    $subType = '7357'; // string
                    
                    $teammate0 = '0'; // string
                    $teammate0champ = '0'; // string
                    $teammate1 = '0'; // string
                    $teammate1champ = '0'; // string
                    $teammate2 = '0'; // string
                    $teammate2champ = '0'; // string
                    $teammate3 = '0'; // string
                    $teammate3champ = '0'; // string
                    
                    $championId = 7357; // int
                    $spell1 = 7357; // int
                    $spell2 = 7357; // int
                    
                    $win = 0; // int
                    $lose = 0; // int
                    
                    $largestMultiKill = 0; // int
                    $largestKillingSpree = 0; // int
                    
                    $championsKilled = 0; // int
                    $numDeaths = 0; // int
                    $assists = 0; // int
                    $minionsKilled = 0; // int
                    $goldEarned = 7357; // int
                    
                    $neutralMinionsKilled = 0; // int
                    $turretsKilled = 0; // int
                    $barracksKilled = 0; // int
                    
                    $sightWardsBoughtInGame = 0; // int
                    $totalHeal = 0; // int
                    
                    $item0 = 0; // int
                    $item1 = 0; // int
                    $item2 = 0; // int
                    $item3 = 0; // int
                    $item4 = 0; // int
                    $item5 = 0; // int
                    
                    $totalDamageDealt = 7357; // int
                    $physicalDamageDealtPlayer = 7357; // int
                    $magicDamageDealtPlayer = 7357; // int
                    $largestCriticalStrike = 0; // int
                    
                    $totalDamageTaken = 7357; // int
                    $physicalDamageTaken = 7357; // int
                    $magicDamageTaken = 7357; // int
                    
                    $totalTimeSpentDead = 0; // int
                }
            
            }
            
            echo strval($gamesSuccessfullyParsed) . ":" . $summoner_array['name'];
        }
    }
    mysql_close();
}





$summoner_name_arr = array(
                    'summonerName' => $_POST['summonerName']
                    );

$summoner_data = getEloData($r_base_url, $r_region, $r_key, 'getSummonerByName', $summoner_name_arr, TRUE);

// Make sure this summoner actually has data that returned
$summoner_arr = (array)json_decode($summoner_data);
$keys = array_keys($summoner_arr);
if (!$keys) {
    echo 'null';
    return;
}

updateRow($r_region, $r_key, $r_base_url, $host, $username, $password, $database, $summoner_arr);

?>