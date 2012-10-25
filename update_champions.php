<?php
/**
 * Resetting the `champions` table after patches and champ releases and stuff
 */

///**
// * Region and Key values, for validating each url
// */
//// Region
//$r_region = 'na';
//// Developer Key
//$r_key
//// Base API url
//$r_base_url = 'http://elophant.com/api/v1/';
//
///**
// * MySQL values
// */
//$host
//$username
//$password
//$database
require('sensitive_data.php');

// Connect and select the database
mysql_connect($host, $username,$password) or die('Could not connect to database');
mysql_selectdb($database);

// Get the data from the url
$url = $r_base_url . $r_region . "/champions?key=" . $r_key;
echo "url => $url <br>";
$ch = curl_init($url);                                                                  
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$json_response = curl_exec($ch);
curl_close($ch);

// For each field, insert a value into the champions table
$champs = (array)json_decode($json_response);
// BUT FIRST, truncate (empty) the table.
// If no data was returned, just leave the table as it is
if (count($champs) > 0) {
    mysql_query("TRUNCATE TABLE champs") or die("Error in MySql: " . mysql_error());
} else {
    echo "Champion lookup failed.";
    return;
}
for ($i=0; $i < count($champs); $i++) {
    $cur_champ = (array)$champs[$i];
    $id = mysql_real_escape_string($cur_champ['id']);
    $name = mysql_real_escape_string($cur_champ['name']);
    // fix single quotes in champs names to escape them with \'
    $name = str_replace("'", "g", $name);
    echo "<br>id => $id";
    echo "<br>name => $name";
    echo "<br>ret => $ret";
    echo "<br>";
    $query = "INSERT INTO champs VALUES (
                            '$id',
                            '$name'
                        );";
    mysql_query($query) or die('Error in MySql: ' . mysql_error());
}

// Clean up
mysql_close();
?>