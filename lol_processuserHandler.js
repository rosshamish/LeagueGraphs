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
                    $("#search_form").fadeIn(500);
                    $('#updates').append('<br><strong>Either your summoner name was typed incorrectly,'
                                       + 'or the Elophant data server is temporarily unavailable.</strong> '
                                       + '<br>Please check your spelling and try again. '
                                       + '<br>If your spelling is correct, please try again later.'
                                       + '<br>Name is case insensitive, eg RossHamiSH is the same as rosshAMish is the same as RossHamish');
                    $('input#summonerName').focus().select();
                    return;
                } else {
                    // Tell the user how many games have been added to their file
                    $('#updates').html('<h2> ' + phpdata + ' new games data-fyed</h2>');
                    // Get the grapher
                    $.getScript("grapher.js", function(data, textStatus) {
                        // Get data from SQL
                        get_graph([0, 1, 2, 3, 4], [-10, -2, 0, 2, 10]);                        
                    });
                    
                }
            }
        });
        return false;
    });
});