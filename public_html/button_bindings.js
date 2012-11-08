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
        $("#graph").hide();
        $("#graph_load").html("<img src=/images/ajax-loader.gif />");
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
                    $("#graph").show();
                    $("#graph_load").hide();
                    
                    $('input#summonerName').focus().select();
                } else {
                    // split the return string of form numGames:summonerName:totalGames
                    var numGames = phpdata.split(":")[0];
                    var name = phpdata.split(":")[1];
                    
                    // Make the graph
                    get_graph(name, "gameId", "championsKilled");
                    $("#title_name").html("- " + name);
                    $("#graph_load").hide();
                    $("#graph").show();
                    
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

// Champ filter form submission
$(function() {
    $("button#champ_filter_btn").click(function() {
        
        // Grab values from the form
        var champname = $("input#champname").val();
        if (champname == "") {
            $("input#champname").focus();
            return false;
        }
        $("button#champ_filter_all_champs").removeClass('active');
        $("button#champ_filter_btn").addClass('active');
                
        // Use Ajax to process the form submission
        // Set the loader gif
        $("#graph_load").html("<img src=/images/ajax-loader.gif />");
        $("#graph_load").show();
        $("#graph").hide();
        $.ajax({  
            type: "POST",
            url: "get_champ.php",
            data: {identifier: champname,
                   get: "id"},
            dataType: "json",
            success: function(phpdata) {
                if (!phpdata[0]) {
                    console.error('invalid champName "'+champname+'" given to get_champ.php');
                    $('#champ_input_form').removeClass('success')
                                          .addClass('error');
                    $("#graph_load").hide();
                    $("#graph").show();
                    
                    $('input#champname').focus().select();
                } else {
                    var champId = phpdata[0];
                    console.log('champId from ajax get_champ from champ_filter_form => ' + champId);
                    $("#champ_input_form").removeClass('error')
                                          .addClass('success');
                    
                    // Do the graphing and stuff
                    get_graph('', "gameId", "championsKilled", champId);
                    $("#graph_load").hide();
                    $("#graph").show();
                }
            }
        });
         
        
        return false;
    });
});