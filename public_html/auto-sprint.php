<!--
Does the same thing as auto.php, but just fucking blasts through as fast as it can. A hard update, if you will.
Do not use this often.
-->

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
    
document.write("<h1>LeagueGraphs database auto-updater <b>(sprinter)</b></h1>");
document.write("<br><br>");
document.write("<div id='playerUpdates'></div>");

// each call to this function is worth 2 api calls
function updateNext() {
    
    $.ajax({
    type: "POST",
    url: "lol_processuser.php",
    data: { 'summonerName' : names_arr[count] },
    dataType: "json",
    success: function(phpdata) {
        var parsed_games = phpdata['parsed_games'];
        var total_games = phpdata['total_games'];
        
        $("#playerUpdates").prepend('--<br>');
        $("#playerUpdates").prepend(names_arr[count] + ' (db#' + count + ') updated!<br>  ' +
                                    parsed_games + ' new games grabbed<br>  ' +
                                    total_games + ' total games now.<br>');
        
        count++;
        if (count >= names_arr.length) {
            clearInterval(updateInterval);
        }
    }
    });
};

var names_arr = [];
$.ajax({
    type: "POST",
    url: "auto-getsummonernames.php",
    dataType: "json",
    success: function(phpdata) {
        names_arr = phpdata;
        $("h2").append("<h3>Total players: " + names_arr.length + "</h3>");
    }
});
var count = 0;

var onesecond = 1000;
var oneminute = 1000 * 60;
var fiveminutes = oneminute * 5;
var tenminutes = oneminute * 10;
var thirtyminutes = oneminute * 30;
var hour = oneminute * 60;
var interval = onesecond;
updateNext(); // call it the first time
var updateInterval = setInterval(updateNext, interval); // set up the interval

});

</script>
    </head>
    <body>
        
    </body>

</html>