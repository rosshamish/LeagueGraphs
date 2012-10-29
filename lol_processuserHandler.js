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
                        // Get data from SQL
                        get_graph(name, "sightWardsBoughtInGame", "assists");                      
                    });
                    
                    // Finally, inform the user.
                     // Tell the user how many games have been added to their file
                    $('#updates').html('<center><h2> ' + numGames + ' new games data-fyed</h2></center>');
                }
                // we're done loading!
                $("#loading").html("");
            }
        });
        
        
        return false;
    });
});