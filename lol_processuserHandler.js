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
                    $("#updates").html('got here!');
                    var summoner_info = JSON.parse(phpdata);
                    for (field in summoner_info) {
                        $("#updates").append(summoner_info.field);
                    }
                    $("#updates").html('<h2> YEAAAA THAT ONE EXISTS HAHA </h2>');
                }
            }
        });
        return false;
    });
});