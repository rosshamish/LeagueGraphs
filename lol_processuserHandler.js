var tab = '&emsp;&emsp;&emsp;&emsp;';

// Focus the cursor on the login box on page load.
$(document).ready(function() {
    $("input#summonerName").focus();
});

// Form submission on button click
$(function() {
    $("input#submit_btn").click(function() {
        
        // Grab values from the form
        var summonerName = $("input#summonerName").val();
        if (summonerName == "") {
            $("input#summonerName").focus();
            return false;
        }
        
        $("#search_form").fadeOut(500);
        
        // Use Ajax to process the form submission
        var dataString = "summonerName=" + summonerName;
        var returnedData = null;
        $.ajax({
            type: "POST",
            url: "lol_processuser.php",
            data: dataString,
            success: function(phpdata) {
                if (phpdata == 'null') {
                    $('#updates').html('nope, didnt work');
                    return;
                } else {
                    $('#updates').html('<h2> Account Info Grabbed! </h2>');
                    $('#debug').html(phpdata);
                    var rec_games = JSON.parse(phpdata);
                    
                    // print out recent games
                    for (field in rec_games) {
                        if (rec_games.hasOwnProperty(field)) {
                            // for each recent games list
                            if (field == 'gameStatistics') {
                                for (var i=0; i < rec_games['gameStatistics'].length; i++) {
                                    var cur_gamestats = rec_games['gameStatistics'][i];
                                    $("#updates").append('['+i+'] => ' + cur_gamestats + '<br>');
                                    // for each game
                                    for (field in cur_gamestats) {
                                        if (cur_gamestats.hasOwnProperty(field)) {
                                            
                                            // print fellowPlayers array
                                            if (field == 'fellowPlayers') {
                                                var players = cur_gamestats[field];
                                                // for each player
                                                for (var p_id = 0; p_id < players.length; p_id++) {
                                                    // for each field in fellow players
                                                    var cur_player = players[p_id];
                                                    for (field in cur_player) {
                                                        if (cur_player.hasOwnProperty(field)) {
                                                            $("#updates").append(tab+tab + field + ': ' + cur_player[field] + '<br>');
                                                        }
                                                    }
                                                    $("#updates").append('<br>');
                                                }
                                                continue;
                                            }
                                            // print statistics array
                                            if (field == 'statistics') {
                                                var stats = cur_gamestats[field];
                                                // for each stat
                                                for (var s_id = 0; s_id < stats.length; s_id++) {
                                                    // for each field in stats
                                                    var cur_stat = stats[s_id];
                                                    for (field in cur_stat) {
                                                        if (cur_stat.hasOwnProperty(field)) {
                                                            $("#updates").append(tab+tab + field + ': ' + cur_stat[field] + '<br>');
                                                        }
                                                    }
                                                    $("#updates").append('<br>');
                                                }
                                                continue;
                                            }
                                            
                                            // print normal fields
                                            $("#updates").append(tab + field + ' => ' + cur_gamestats[field] + '<br>');
                                        }
                                    }
                                    $("#updates").append('<br>');
                                }
                            }
                            
                        }
                    }
                }
            }
        });
        return false;
    });
});