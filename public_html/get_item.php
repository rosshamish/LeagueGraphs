<?php

require_once('sensitive_data.php'); # $host, $username, $password, $database, $r_region, $r_key, $r_base_url

$mysqli = new mysqli($host, $username, $password);
$mysqli->select_db($database);

$req = $_POST['get'];
$ret_arr = array();
if ($req == 'id') {
  $item_name = $_POST['identifier'];
  
  for ($i=0; $i<count($item_name); $i++) {
    $cur = $item_name[$i];
    $cur = $mysqli->real_escape_string($cur);
    $query = "SELECT id FROM items WHERE name='$cur'";
  
    $result = $mysqli->query($query);
    if ($result) {
      $row = $result->fetch_assoc();
      $cur_id = $row['id'];
      if ($cur_id != '') {
        array_push($ret_arr, $cur_id);
      }
    }
  }
} else if ($req == 'name') {
  $item_id = $_POST['identifier'];
  
  for ($i=0; $i<count($item_id); $i++) {
    $cur = $item_id[$i];
    $cur = $mysqli->real_escape_string($cur);
    $query = "SELECT name FROM items WHERE id='$cur'";
    
    $result = $mysqli->query($query);
    if ($result) {
      $row = $result->fetch_assoc();
      $cur_name = $row['name'];
      if ($cur_name != '') {
        array_push($ret_arr,$cur_name);
      }
    }
  }
} else {
  console.error("In get_item.php: You need to specify a get paramater. It can be either 'name' or 'id'");
}

$mysqli->close();

if (count($ret_arr) <= 0) {
  echo json_encode('');
} else { 
  echo json_encode($ret_arr);
}

?>