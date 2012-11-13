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
        
<script type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js"></script>
<script type="text/javascript">

$(document).ready(function() {
    
document.write("<h1>LeagueGraphs database auto-updater</h1>");
document.write("<h2></h2>");
document.write("<div id='updateTimer'></div>");
document.write("<div id='playerUpdates'></div>");


// each call to this function is worth 2 api calls
function updateNext() {
    
    $.ajax({
    type: "POST",
    url: "lol_processuser.php",
    data: "summonerName=" + names_arr[count],
    success: function(phpdata) {
        var games = phpdata['parsed_games'];
        
        $("#playerUpdates").prepend('--<br>');
        $("#playerUpdates").prepend(names_arr[count] + ' (db#' + count + ') updated! ' + games + ' new games grabbed.<br>');
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
        $.ajax({
            type: "POST",
            url: "auto-getsummonernames.php",
            dataType: "json",
            success: function(phpdata) {
                names_arr = phpdata;
            }
        });
    }
}
var names_arr = [];
$.ajax({
    type: "POST",
    url: "auto-getsummonernames.php",
    dataType: "json",
    success: function(phpdata) {
        names_arr = phpdata;
    }
});
var count = 0;
var timer = 0;

var tenminutes = 1000 * 60 * 10;
var thirtyminutes = 1000 * 60 * 30;
var hour = 1000 * 60 * 60;
var interval = tenminutes;
updateNext(); // call it the first time
setInterval(updateNext, interval); // set up the interval
timer = interval;
setInterval(updateTimer, 1000); // set up the timer

$("h2").html("Currently set to update one player every every " + interval / (1000 * 60) + " minutes");
$("h2").append("<h3>Total players: " + names_arr.length + "</h3>");


});

</script>
    </head>

</html>