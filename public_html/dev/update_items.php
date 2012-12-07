<?php
/**
 * Resetting the `items` table after patches and item releases and stuff
 */
require('sensitive_data.php');

// Connect and select the database
$mysqli = new mysqli($host, $username,$password) or die('Could not connect to database');
$mysqli->select_db($database);

// Get the data from the url
$url = $r_base_url . $r_region . "/items?key=" . $r_key;
$ch = curl_init($url);                                                                  
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$json_response = curl_exec($ch);
curl_close($ch);

// For each field, insert a value into the items table
$items = (array)json_decode($json_response);
// BUT FIRST, truncate (empty) the table.
// If no data was returned, just leave the table as it is
if (count($items) > 0) {
    $mysqli->query("TRUNCATE TABLE items") or die("Error in MySql: " . $mysqli->error);
} else {
    echo "Item lookup failed. No data was returned from Elophant.";
    return;
}
for ($i=0; $i < count($items); $i++) {
    $cur_item = (array)$items[$i];
    $id = $mysqli->real_escape_string($cur_item['id']);
    // fix single quotes in champs names to escape them with \'
    // it was having problems with things like Cho 'Gath
    $name = $mysqli->real_escape_string($cur_item['name']);
    echo "id: $id, name: $name <br>";
    $query = "INSERT INTO items VALUES (
                            '$id',
                            '$name'
                        );";
    $mysqli->query($query) or die('Error in MySql: ' . $mysqli->error);
}

// Clean up
$mysqli->close();
?>