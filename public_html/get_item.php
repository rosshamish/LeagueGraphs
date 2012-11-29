<?php

require_once("sensitive_data.php");

mysql_connect($host, $username, $password);
mysql_selectdb($database);

$req = $_POST['get'];
$ret_arr = array();
if ($req == 'id') {
  $item_name = $_POST['identifier'];
  
  for ($i=0; $i<count($item_name); $i++) {
    $query = "SELECT id FROM items WHERE name='$item_name'";
  
    $result = mysql_query($query);
    if ($result) {
      $row = mysql_fetch_array($result);
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
    $query = "SELECT name FROM items WHERE id='$cur'";
    
    $result = mysql_query($query);
    if ($result) {
      $row = mysql_fetch_array($result);
      $cur_name = $row['name'];
      if ($cur_name != '') {
        array_push($ret_arr,$cur_name);
      }
    }
  }
} else {
  console.error("In get_item.php: You need to specify a get paramater. It can be either 'name' or 'id'");
}

mysql_close();

if (count($ret_arr) <= 0) {
  echo json_encode('');
} else { 
  echo json_encode($ret_arr);
}

?>