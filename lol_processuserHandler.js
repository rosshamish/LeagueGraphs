var tab = '&emsp;&emsp;&emsp;&emsp;';

// Focus the cursor on the login box on page load.
$(document).ready(function() {
    $("input#summonerName").focus();
});

/** do quicker checkbox making */
function checkbox(name, id, checked) {
    if (name == '' ) {
        var el = '</ul> <ul>';
    } else {
        var el = '<li>' +
            '<label for="' + id + '">' + name + '</label><input type="checkbox" class="checkbox" id="' + id + '" name="' + id + '"' + (checked ? "checked" : "") + '/>' +
            '</li>';
    }
    return el;
}

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
        // Set the loader gif
        $("#loading").html("<center><img src=/images/ajax-loader.gif /> Nomming data...</center>");
        $.ajax({  
            type: "POST",
            url: "lol_processuser.php",
            data: dataString,
            success: function(phpdata) {
                if (phpdata == 'null') {
                    $("#search_form").fadeIn(500);
                    $('#updates').html('<br><strong>Either your summoner name was typed incorrectly,'
                                       + 'or the Elophant data server is temporarily unavailable.</strong> '
                                       + '<br>Please check your spelling and try again. '
                                       + '<br>If your spelling is correct, please try again later.'
                                       + '<br>Name is case insensitive, eg RossHamiSH is the same as rosshAMish is the same as RossHamish');
                    $('input#summonerName').focus().select();
                } else {
                    // split the return string of form numGames:summonerName
                    var numGames = phpdata.split(":")[0];
                    var name = phpdata.split(":")[1];
                    
                    // Get the grapher
                    $.getScript("grapher.js", function(data, textStatus) {
                        // we're done loading!
                        
                        
                        $("#checkboxes").html('<ul>' +
                                               checkbox('Gold Earned', 'goldEarned') +
                                               checkbox('', '') +
                                               checkbox('Champions Killed', 'championsKilled', true) + 
                                               checkbox('Deaths', 'numDeaths') +
                                               checkbox('Assists', 'assists') +
                                               checkbox('Creep Score', 'minionsKilled') +
                                               checkbox('', '')  +
                                               checkbox('Damage Dealt', 'totalDamageDealt') +
                                               checkbox('Damage Taken', 'totalDamageTaken') +
                                               checkbox('', '') +
                                               checkbox('Time Spent Dead', 'totalTimeSpentDead') +
                                               checkbox('Sight Wards Bought', 'sightWardsBoughtInGame') +
                                               
                                               checkbox('IP Earned', 'ipEarned') +
                                               checkbox('Premade Group Size', 'premadeSize') +
                                               
                                               '</ul>');
                        
                        
                        // Get data from SQL
                        get_graph(name, "gameId", "championsKilled");
                        
                        $(".title").remove();
                        $("#intro").remove();
                        // this is dirty and wrong, but i'm passing the summoner name in through the tzCheckbox options.
                        // shoot me.
                        $('input[type=checkbox]').tzCheckbox({labels:[name, name]});
                        
                        // Finally, inform the user.
                        // Tell the user how many games have been added to their file
                        $('#updates').html('<center><h2> ' + numGames + ' new games data-fyed</h2></center>');
                    });
                }
                $("#loading").empty();
            }
        });
         
        
        return false;
    });
});