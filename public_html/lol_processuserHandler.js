var tab = '&emsp;&emsp;&emsp;&emsp;';

// Focus the cursor on the login box on page load.
$(document).ready(function() {
    $("input#summonerName").focus();
    // add the default graph!
    get_graph("somePlayer", "gameId", "championsKilled");
    // Add the checkboxes
    $("#checkboxes").html('<ul class="unstyled">' +
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
                                           checkbox('', '') +
                                           checkbox('IP Earned', 'ipEarned') +
                                           checkbox('', '') +
                                           checkbox('Premade Group Size', 'premadeSize') +
                                           
                                           '</ul>');
    var champname = "olaf";
    var id = 121;
    $.ajax({
        type: "POST",
        url: "get_champ.php",
        data: {identifier: id,
               get: "name"},
        dataType: "text",
        success: function(phpdata) {
            console.log(id + " => " + phpdata);
        },
        error: function(p1, p2, p3) {
            console.error("get_champ.php ajax call failed. Errors:");
            console.error(p1);
            console.error(p2);
            console.error(p3);
            console.error("//end ajax call fail.");
        }
    });
    
    // This sets up click events. Using "SomePlayer" as the default.
    $('input[type=checkbox]').tzCheckbox("SomePlayer");    
});

/** do quicker checkbox making */
function checkbox(name, id, checked) { 
    if (name == '' ) {
        var el = '</ul> <ul class="unstyled">';
    } else {
        var el =
            '<label class="checkbox inline" for="' + id + '"><input type="checkbox" class="checkbox" id="' + id + '" name="' + id + '"' + (checked ? "checked" : "") + '/>' + name + '</label>';
    }
    return el;
}

// Form submission on button click
$(function() {
    $("button#submit_btn").click(function() {
        
        // Grab values from the form
        var summonerName = $("input#summonerName").val();
        if (summonerName == "") {
            $("input#summonerName").focus();
            return false;
        }
                
        // Use Ajax to process the form submission
        var dataString = "summonerName=" + summonerName;
        var returnedData = null;
        // Set the loader gif
        $("#graph").html("<img src=/images/ajax-loader.gif />");
        $.ajax({  
            type: "POST",
            url: "lol_processuser.php",
            data: dataString,
            success: function(phpdata) {
                if (phpdata == 'null') {
                    $('#updates').html('<br><strong>Either your summoner name was typed incorrectly,'
                                       + 'or the Elophant data server is temporarily unavailable.</strong> '
                                       + '<br>Please check your spelling and try again. '
                                       + '<br>If your spelling is correct, please try again later.'
                                       + '<br>Name is case insensitive, eg RossHamiSH is the same as rosshAMish is the same as RossHamish');
                    $('#search_form').addClass('error');
                    $("#graph").empty();
                    
                    $('input#summonerName').focus().select();
                } else {
                    // split the return string of form numGames:summonerName
                    var numGames = phpdata.split(":")[0];
                    var name = phpdata.split(":")[1];
                    
                    // Do the graphing and stuff
                    
                    // Get data from SQL
                    get_graph(name, "gameId", "championsKilled");
                    
                    $(".title").remove();
                    $("#intro").remove();
                    $("#updates").remove();
                    $('#search_form').addClass('success');
                    // this is dirty and wrong, but i'm passing the summoner name in through the tzCheckbox options.
                    // shoot me. This sets up click events for the CURRENT USER.
                    $('input[type=checkbox]').tzCheckbox(name);
                }
            }
        });
         
        
        return false;
    });
});