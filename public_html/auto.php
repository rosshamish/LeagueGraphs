<html>
    <head>
<?php
    $myFile = "auto.txt";
    $fh = fopen($myFile, 'r') or die("can't open file for reading");
    $readData = fread($fh, 6);
    if ($readData == 'in use') {
        window.close();
    } else {
        fclose($fh);
        $fh = fopen($myFile, 'w') or die("can't open file");
        $stringData = "in use";
        fwrite($fh, $stringData);
        fclose($fh);
    }
?>

<?php
    // it is running, yo
    
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

        
        
<script type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js"></script>
<script type="text/javascript">
    // set up the "i'm done using this now goddammit" notice
window.onbeforeunload = function yaya() {
    return "haha";
}

$(document).ready(function() {

// each call to this function is worth 2 api calls
function updateNext() {
    
    $.ajax({
    type: "POST",
    url: "lol_processuser.php",
    data: "summonerName=" + names_arr[count],
    success: function(phpdata) {
        var games = phpdata.split(":");
        games = games[0];
        document.write('--<br>');
        document.write(names_arr[count] + '(player #' + count + ') updated! ' + games + ' new games grabbed.<br>');
        count++;
        if (count >= names_arr.length) {
            count = 0;
        }
    }
    });
    
};

function updateTimer() {
    var minutes = Math.floor(timer / (1000 * 60));
    var seconds = (timer - minutes*60*1000) / 1000;
    $("#updateTimer").html("Next update in " + minutes + ":" + seconds);
    timer -= 1000;
    if (timer <= 0) {
        timer = interval;
    }
}
var names_arr = <?php echo $arr_json ?>;
var count = 0;
var timer = 0;
document.write("<h1>Database auto-updater</h1><br>");
document.write("<h2></h2>");
document.write("<div id='updateTimer'></div>");

var tenminutes = 1000 * 60 * 10;
var thirtyminutes = 1000 * 60 * 30;
var hour = 1000 * 60 * 60;
var interval = hour;
updateNext(); // call it the first time
setInterval(updateNext, interval); // set up the interval
timer = interval;
setInterval(updateTimer, 1000); // set up the timer

$("h2").html("Currently set to one update every " + interval / (1000 * 60) + " minutes");


});

</script>
    </head>

</html>