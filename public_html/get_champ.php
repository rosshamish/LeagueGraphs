<?php

require_once("sensitive_data.php");

$mysqli = new mysqli($host, $username, $password);
$mysqli->select_db($database);

$req = $_POST['get'];
$ret_arr = array();
if ($req == 'id') {
  $champ_name = $_POST['identifier'];
  
  for ($i=0; $i<count($champ_name); $i++) {
    $query = "SELECT id FROM champs WHERE name='$champ_name'";
  
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
  $champ_id = $_POST['identifier'];
  if (intval($champ_id) <= 0) {
    return json_encode();
  }
  
  for ($i=0; $i<count($champ_id); $i++) {
    $cur = $champ_id[$i];
    $query = "SELECT name FROM champs WHERE id='$cur'";
    
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
  console.error("In get_champ.php: You need to specify a get paramater. It can be either 'name' or 'id'");
}

$mysqli->close();

if (count($ret_arr) <= 0) {
  echo json_encode('');
} else { 
  echo json_encode($ret_arr);
}

?>