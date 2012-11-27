// Form submission on button click
$(function() {
    $("button#submit_btn").click(function() {
        document.activeElement.blur();
        // Grab values from the form
        var summonerName = $("input#summonerName").val();
        if (summonerName == "") {
            $("input#summonerName").focus();
            return false;
        }
        $.cookie('summoner_name', summonerName); // set the summoner_name, we're looking at a new player
        $.cookie('gameType', 'all');
        $('#gametype_filter_label').text('All Game Types');
        $.cookie('gameRange', null);
        $("#time_filter_label").text('All Time');
        $("#champ_filter_all_champs").addClass('active');
        $("#champ_filter_btn").removeClass('active');
        $("input#champname").text('');
        $("#champ_input_form").removeClass('success');
        
        summonerName = summonerName.replace(" ", "%20");
        // Use Ajax to process the form submission
        $.ajax({  
            type: "POST",
            url: "lol_processuser.php",
            data: {summonerName : summonerName},
            dataType: "json",
            success: function(phpdata) {
                if (phpdata == 'null'|| !phpdata) {
                    console.log('phpdata was null in lol_processuser.php from button_bindings.js');
                    get_graph('', '', '', '', '');
                    $('#search_form').addClass('error');
                    $("button#submit_btn").removeClass('btn-primary')
                                .addClass('btn-danger');
                    
                    $('input#summonerName').focus().select();
                } else {
                    var parsed_games = phpdata['parsed_games'];
                    var total_games = phpdata['total_games'];
                    var name = phpdata['name'];
                    var oldest_game = phpdata['oldest_game'];
                    var date = oldest_game.substring(0, 10);
                    var day = date.substring(8, 10);
                    var monthnum = date.substring(5, 7);
                    var year = date.substring(0, 4);
                    var months_arr = ["Zeroth", "January", "February", "March", "April", "May", "June", "July",
                                      "August", "September", "October", "November", "December"];
                    var month = months_arr[parseInt(monthnum)];
                    
                    // Make the graph
                    get_graph(name, '', '', '');
                    
                    $(".title").remove();
                    $("#intro").remove();
                    $("#updates").remove();
                    $('#search_form').addClass('success');
                    $("#summoner_name").html(name);
                    $("#games_tracked").html(total_games);
                    $("#tracking_since").html(month + " " + day + ", " + year);
                    $('#player_stats').show();
                    $("button#submit_btn").removeClass('btn-primary')
                                .removeClass('btn-danger')
                                .addClass('btn-success');
                    // this is dirty and wrong, but i'm passing the summoner name in through the tzCheckbox options.
                    // shoot me. This sets up click events for the CURRENT USER.
                    $('input[type=checkbox]').tzCheckbox(name);
                }
            },
            error: function() {
                console.log('in lol_processuser.php called from button_bindings.js, something awful happened');
            }
        });
        
        /** Add this player to the auto update list, `players` **/
        $.ajax({
            url: 'add_to_players.php',
            type: 'POST',
            data: {
                summonerName : summonerName
            },
            success: function() {
                // nothing to do here, the insert takes place in add_to_players, nothing has to actually be done on the frontend side.
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
                                          
                    $('input#champname').focus().select();
                } else {
                    var champId = phpdata[0];
                    $.cookie('champId', champId);
                    $("#champ_input_form").removeClass('error')
                                          .addClass('success');
                    // Do the graphing and stuff
                    get_graph('', '', '', champId);
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
        
        $("#champ_input_form").removeClass('error')
                              .addClass('success');
        
        // Do the graphing and stuff
        $.cookie("champId", null);
        get_graph('', "gameId", '', 'all');
        
        return false;
    });
});
