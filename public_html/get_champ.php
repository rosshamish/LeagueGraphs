<?php

require_once("sensitive_data.php");

mysql_connect($host, $username, $password);
mysql_selectdb($database);

$req = $_POST['get'];
if ($req == 'id') {
  $champ_name = $_POST['identifier'];
  
  $query = "SELECT id FROM champs WHERE name='$champ_name'";
  
  $result = mysql_query($query);
  if ($result) {
    $row = mysql_fetch_array($result);
    echo $row['id'];
  }
} else if ($req == 'name') {
  $champ_id = $_POST['identifier'];
  
  $query = "SELECT name FROM champs WHERE id='$champ_id'";
  
  $result = mysql_query($query);
  if ($result) {
    $row = mysql_fetch_array($result);
    echo $row['name'];
  }
} else {
  echo "You need to specify a get paramater. It can be either 'name' or 'id'";
}

mysql_close();

?>