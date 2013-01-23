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
    
var onesecond = 1000;
var oneminute = 1000 * 60;
var fiveminutes = oneminute * 5;
var tenminutes = oneminute * 10;
var thirtyminutes = oneminute * 30;
var hour = oneminute * 60;

$(document).ready(function() {
    
var count = 0;
var timer = 0;
window.interval = 20000;
    
document.write("<h1>LeagueGraphs database auto-updater</h1>");
document.write("<h2></h2>");
document.write("Updating <span id='nextPlayer'></span> next.");
document.write("<div id='updateTimer'></div>");
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
        if (!phpdata || phpdata == null) {
        
            $("#playerUpdates").prepend('--<br>');
            $("#playerUpdates").prepend('<p color="red" ' + names_arr[count] + ' (db#' + count + ') failed to update.<br>  ' +
                                        'NULL new games grabbed<br>  ' +
                                        'NULL total games now.</p><br>');
            
        } else {
            var parsed_games = phpdata['parsed_games'];
            var total_games = phpdata['total_games'];
            
            $("#playerUpdates").prepend('--<br>');
            $("#playerUpdates").prepend(names_arr[count] + ' (db#' + count + ') updated!<br>  ' +
                                        parsed_games + ' new games grabbed<br>  ' +
                                        total_games + ' total games now.<br>');  
        }
    },
    error: function(err) {
        $("#playerUpdates").prepend('--<br>');
        $("#playerUpdates").prepend('<p color="red"> ' + names_arr[count] + ' (db#' + count + ') failed to update.<br>  ' +
                                    'NULL new games grabbed<br>  ' +
                                    'NULL total games now.</p><br>');
        
    },
    complete: function() {
        count++;
        if (count >= names_arr.length) {
            count = 0;
        }
        $("#nextPlayer").html(names_arr[count]);
    }
    });
}

function updateTimer() {
    var minutes = Math.floor(timer / (1000 * 60));
    var seconds = (timer - minutes*60*1000) / 1000;
    $("#updateTimer").html("Next update in " + minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
    timer -= 1000;
    if (timer <= 500) {
        timer = window.interval;
        $.ajax({
            type: "POST",
            url: "auto-getsummonernames.php",
            dataType: "json",
            async: false,
            success: function(data) {
                names_arr = data;
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
        
        var min_update_time = hour * 6; // 6 hours between updates minimum
        window.interval = Math.floor(min_update_time / names_arr.length / 1000) * 1000;
        // console.log('num players: ' + names_arr.length + ', window.interval: ' + window.interval);
        updateNext(); // call it the first time
        setInterval(updateNext, window.interval); // set up the interval
        timer = window.interval;
        setInterval(updateTimer, 1000); // set up the timer
        
        $("h2").html("Currently set to update one player every " + window.interval / (1000 * 60) + " minutes");
        $("h2").append("<h3>Updating each player every " + Math.ceil(window.interval * names_arr.length / (1000 * 60 * 60))  + " hours.</h3>");
        $("h2").append("<h3>Total players: " + names_arr.length + "</h3>");
        
    }
});

});

</script>
    </head>
    <body>
        
    </body>

</html>