<script type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js"></script>
<script type="text/javascript">

<?php

    require_once('sensitive_data.php');
    mysql_connect($host, $username, $password);
    mysql_selectdb($database);
    
    $query = "SELECT DISTINCT summonerName FROM games";
    
    $result = mysql_query($query);
    
    if ($result) {
        $count = 0;
        $numRows = mysql_num_rows($result);
        while($row = mysql_fetch_array($result)) {
          $count++;
          $arr[] = $row['summonerName'];
        }
    }
    $arr_json = json_encode($arr);
    
    mysql_close();
?>



$(document).ready(function() {

function print_arr(arr, arrname) {
    var debug_string = "<br>" + "== " + arrname + " ==";
    for (var i=0; i < arr.length; i++) {
        debug_string += "<br> i: " + i + ", val: " + arr[i];
    }
    debug_string += "<br>======<br><br>";
    //$("#debug").append(debug_string);
}

// each call to this function is worth 2 api calls
function updateNext() {
    
    $.ajax({
    type: "POST",
    url: "lol_processuser.php",
    data: "summonerName=" + names_arr[count],
    success: function(phpdata) {
        document.write('--<br>');
        document.write(names_arr[count] + '(player #' + count + ') updated!<br>');
        count++;
        if (count >= names_arr.length) {
            count = 0;
        }
    }
    });
    
};
var names_arr = <?php echo $arr_json ?>;
var count = 0;

var tenminutes = 1000 * 60 * 10;
var thirtyminutes = 1000 * 60 * 30;
var hour = 1000 * 60 * 60;
var interval = thirtyminutes;
updateNext(); // call it the first time
setInterval(updateNext, hour); // set up the interval

document.write("<h2>Database auto-updater</h2><br>");
document.write("...working...<br><h1>Currently doing one update every " + interval / (1000 * 60) + " minutes</h1>");

});

</script>