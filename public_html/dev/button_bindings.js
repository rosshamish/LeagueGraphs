// Form submission on button click
$(function() {
    $("button#submit_btn").click(function() {
        
        // Grab values from the form
        var summonerName = $("input#summonerName").val();
        if (summonerName == "") {
            $("input#summonerName").focus();
            return false;
        }
        $.cookie('summoner_name', summonerName); // set the summoner_name, we're looking at a new player
        $.cookie('champId', null); // clear the champ filter, we're looking at a new player
        $("#champ_filter_all_champs").addClass('active');
        $("#champ_filter_btn").removeClass('active');
        $("input#champname").text('');
        $("#champ_input_form").removeClass('success');
        
        /** This is working code to modify/read/reset cookies as json arrays */
        
        //$.cookie('filters', JSON.stringify(['championsKilled', 'numDeaths', 'goldEarned']));
        //var filters = $.parseJSON($.cookie('filters'));
        //console.log('filters: ' + filters);
        //var idx = filters.indexOf('numDeaths');
        //filters.splice(idx, 1);
        //console.log('filters after splice: ' + filters);
        //$.cookie('filters', JSON.stringify(filters));
        
        // Set the loader gif
        $("#graph").hide();
        $("#graph_load").html("<img src=/images/ajax-loader.gif />");
        // Use Ajax to process the form submission
        $.ajax({  
            type: "POST",
            url: "lol_processuser.php",
            data: {summonerName : summonerName},
            success: function(phpdata) {
                if (phpdata == 'null') {
                    $('#updates').html('<br><strong>Either your summoner name was typed incorrectly,'
                                       + 'or the Elophant data server is temporarily unavailable.</strong> '
                                       + '<br>Please check your spelling and try again. '
                                       + '<br>If your spelling is correct, please try again later.'
                                       + '<br>Name is case insensitive, eg RossHamiSH is the same as rosshAMish is the same as RossHamish');
                    $('#search_form').addClass('error');
                    $("button#submit_btn").removeClass('btn-primary')
                                .addClass('btn-danger');
                    $("#graph").show();
                    $("#graph_load").hide();
                    
                    $('input#summonerName').focus().select();
                } else {
                    // split the return string of form numGames:summonerName:totalGames
                    var numGames = phpdata.split(":")[0];
                    var name = phpdata.split(":")[1];
                    
                    // Make the graph
                    get_graph(name, "gameId", "championsKilled");
                    $("#graph_load").hide();
                    $("#graph").show();
                    
                    $(".title").remove();
                    $("#intro").remove();
                    $("#updates").remove();
                    $('#search_form').addClass('success');
                    $("button#submit_btn").removeClass('btn-primary')
                                .removeClass('btn-danger')
                                .addClass('btn-success');
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
                    $.cookie('champId', champId);
                    $("#champ_input_form").removeClass('error')
                                          .addClass('success');
                    // Do the graphing and stuff
                    get_graph('', "gameId", '', champId);
                    $("#graph_load").hide();
                    $("#graph").show();
                }
            }
        });
        
        return false;
    });
});

/* Champ unfilter button */
$(function() {
    $("button#champ_filter_all_champs").click(function() {
        // Grab values from the form
        var champname = $("input#champname").val();
        if (champname == "") {
            $("input#champname").focus();
            return false;
        }
        $("button#champ_filter_all_champs").addClass('active');
        $("button#champ_filter_btn").removeClass('active');
                
        // Use Ajax to process the form submission
        // Set the loader gif
        $("#graph_load").html("<img src=/images/ajax-loader.gif />");
        $("#graph_load").show();
        $("#graph").hide();
        
        $("#champ_input_form").removeClass('error')
                              .addClass('success');
        
        // Do the graphing and stuff
        $.cookie("champId", null);
        get_graph('', "gameId", '', '');
        $("#graph_load").hide();
        $("#graph").show();
        
        return false;
    });
});
