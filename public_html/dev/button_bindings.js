/**  Link sharing **/
$(function() {   
   /*
    * Update the Share link with the current filters/graph data when it is clicked.
    *     using the pattern "click the link, update the link"
    */
   $('.sharelink').click(function(e) {
    e.preventDefault(); // prevent default action (isn't this nothing here? whatevvvv)
    
    // Setup
    $input = $('input.sharelink');
    var link = $input.val();
    var n = sessionStorage.summoner_name;
    var r = sessionStorage.gameRange;
    var c = sessionStorage.champId;
    var t = sessionStorage.gameType;
    var f = sessionStorage.filters;
    
    // n (summoner name)
    index = link.indexOf('n=');
    if (index != -1) { // if this param is already present
        if (link.substring(index).indexOf('&') != -1) { // if it isn't the last param
            link = link.replace(/n=.+?&/gi, 'n='+n+'&');
        } else { // it's the last param
            link = link.replace(/n=.+/gi, 'n='+n);
        }
    } else { // add this param in
        if (link.indexOf('?') != -1) { // if there are other params already
            link += '&n='+n;
        } else { // this is the first param
            link += '?n='+n;
        }
    }
    // r (game range i.e. last x games)
    index = link.indexOf('r=');
    if (index != -1) { // if this param is already present
        if (link.substring(index).indexOf('&') != -1) { // if it isn't the last param
            link = link.replace(/r=.+?&/gi, 'r='+r+'&');
        } else { // it's the last param
            link = link.replace(/r=.+/gi, 'r='+r);
        }
    } else { // add this param in
        if (link.indexOf('?') != -1) { // if there are other params already
            link += '&r='+r;
        } else { // this is the first param
            link += '?r='+r;
        }
    }
    // c (champion i.e. only Taric)
    index = link.indexOf('c=');
    if (index != -1) { // if this param is already present
        if (link.substring(index).indexOf('&') != -1) { // if it isn't the last param
            link = link.replace(/c=.+?&/gi, 'c='+c+'&');
        } else { // it's the last param
            link = link.replace(/c=.+/gi, 'c='+c);
        }
    } else { // add this param in
        if (link.indexOf('?') != -1) { // if there are other params already
            link += '&c='+c;
        } else { // this is the first param
            link += '?c='+c;
        }
    }
    // t (game type i.e. only normals 5v5)
    index = link.indexOf('t=');
    if (index != -1) { // if this param is already present
        if (link.substring(index).indexOf('&') != -1) { // if it isn't the last param
            link = link.replace(/t=.+?&/gi, 't='+t+'&');
        } else { // it's the last param
            link = link.replace(/t=.+/gi, 't='+t);
        }
    } else { // add this param in
        if (link.indexOf('?') != -1) { // if there are other params already
            link += '&t='+t;
        } else { // this is the first param
            link += '?t='+t;
        }
    }
    // f (filters i.e. what bars the graph shows)
    index = link.indexOf('f=');
    if (index != -1) { // if this param is already present
        if (link.substring(index).indexOf('&') != -1) { // if it isn't the last param
            link = link.replace(/f=.+?&/gi, 'f='+f+'&');
        } else { // it's the last param
            link = link.replace(/f=.+/gi, 'f='+f);
        }
    } else { // add this param in
        if (link.indexOf('?') != -1) { // if there are other params already
            link += '&f='+f;
        } else { // this is the first param
            link += '?f='+f;
        }
    }
    
    $input.val(link); // Update it with the newly built link
    $input.select(); // Select it for easier copy and paste
   });   
   
});

/**
 * Form submission on button click
**/
$(function() {
    
    /** Input selection **/
    $('.summoner_search_input').click(function(e) {
        e.preventDefault();
        $(this).select();
    });
    
    /** Player search **/
    $(".summoner_search_btn").click(function(e) {
        e.preventDefault(); // prevent default button click action
        document.activeElement.blur(); // un-focus the element. This is only really necessary for phones/mobile.
        $this = $(this); // grab a reference to the current element
        // Grab values from the form
        var input = $this.siblings('.summoner_search_input');
        var summonerName = input.val();
        $('.summoner_search_input').val(input.val()); // update the other input (nav->main or main->nav)
        // If they haven't typed anything yet, just don't do anything and return
        if (summonerName == "") {
            input.focus();
            return false;
        }
        /* Google Analytics custom event */
        _gaq.push(['_trackEvent', 'Player', 'Search']);
        
        // Set the session storage of what is currently going on.
        sessionStorage.summoner_name = summonerName; // set the summoner_name, we're looking at a new player
        sessionStorage.gameType = 'all';
        sessionStorage.champId = '';
        sessionStorage.gameRange = '';
        
        // Update the inputs to reflect what's what in the what.
        $('.gametype_filter_label').text('All Game Types');
        $(".time_filter_label").text('All Time');
        $(".champ_filter_all_champs").addClass('active');
        $(".champ_filter_btn").removeClass('active');
        $("input#champname").text('');
        $(".champ_input_form").removeClass('success');
        
        // Should probably use urlencode but I'm not sure if it will break
        // and it doesn't matter enough to find out
        summonerName = summonerName.replace(" ", "%20");
        // Use Ajax to process the user
        $.ajax({  
            type: "POST",
            url: "lol_processuser.php",
            data: {summonerName : summonerName},
            dataType: "json", // tell ajax that we expect json to come back
            success: function(phpdata) {
                if (phpdata == 'null'|| !phpdata) {
                    /* If we got back bad data.
                     * This typically means that the Elophant API is down.
                     * This could also mean that lol_processuser broke somehow */
                    console.log('phpdata was null in lol_processuser.php from button_bindings.js');
                    get_graph('', '', '', '', '');
                    $('#search_form').addClass('error');
                    $("button#submit_btn").removeClass('btn-primary')
                                .addClass('btn-danger');
                    input.focus().select();
                } else {
                    // Get some meta stats
                    var parsed_games = phpdata['parsed_games'];
                    var total_games = phpdata['total_games'];
                    var name = phpdata['name'];
                    var oldest_game = phpdata['oldest_game'];
                    if (oldest_game != null) { // if this isn't their first time
                        // get all the info from the date
                        var date = oldest_game.substring(0, 10);
                        var day = date.substring(8, 10);
                        var monthnum = date.substring(5, 7);
                        var year = date.substring(0, 4);
                        var months_arr = ["Zeroth", "January", "February", "March", "April", "May", "June", "July",
                                          "August", "September", "October", "November", "December"];
                        var month = months_arr[parseInt(monthnum)];
                    }
                    
                    // Make the graph
                    get_graph('', '', '', ''); // give '' to tell get_graph to use sessionStorage
                    
                    // Update the ui with visible indicators that it worked :)
                    $('#search_form').addClass('success');
                    $("#summoner_name").html(name);
                    $("#games_tracked").html(total_games);
                    if (oldest_game != null) { // if this isn't their first time 
                        $("#tracking_since").html(month + " " + day + ", " + year);
                    } else {
                        // this IS their first time
                        $('#tracking_since').html('today');
                    }
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
                summonerName : sessionStorage.summoner_name
            },
            dataType: 'json', // tell ajax we expect JSON to come back
            success: function(data) {
                // Only thing to do is check if the player cap was hit
                if (data['capped'] == true) {
                    $("#tracking_since").html('<i>cap reached</i>');
                    $('<p>').html('Unfortunately, the auto-tracker\'s player cap has been reached. Budget currently allows for <i>'+data['cap']+'</i> players. <br>' +
                                  'You can support LeagueGraphs and increase the cap by making a small donation at the bottom of this page.<br>'+
                                  'In the meantime, here are your 10 latest games. Enjoy!')
                            .appendTo('#tracking_since');
                }
            },
            error: function(a,b,c) {
                console.error('add_to_players.php error, called from button_bindings.js');
            }
        });
        
        // Scroll the page down to the graph
        // but ONLY if they used the main input, NOT the nav input
        if (this.id == 'submit_btn') {
            $('html, body').stop().animate({
                scrollTop: $('.nav-tabs').offset().top
            }, 1500);
        }
        
        return false;
    });
});

/** Gamerange and gametype filter click events **/
$(function() {
    /** Set up time filter click events **/
    $('.time_filter').click(function(e) {
        e.preventDefault(); // prevent default click
        /** Google Analytics custom event */
        _gaq.push(['_trackEvent', 'Filter', 'Time']);
        
        var gameRange = 100000; // hopefully nobody ever racks up more than this many games
        switch(this.id) {
            case 'ever':
                t = 'All Time';
                gameRange = 100000;
                break;
            case 'ten_games':
                t = 'Last 10 Games';
                gameRange = 10;
                break;
            case 'twenty_games':
                t = 'Last 20 Games';
                gameRange = 20;
                break;
            case 'thirty_games':
                t = 'Last 30 Games';
                gameRange = 30;
                break;
            case 'sixty_games':
                t = 'Last 60 Games';
                gameRange = 60;
                break;
            default:
                t = '??'
                gameRange = 100000;
                break;
        }
        $('.time_filter_label').text(t);
        sessionStorage.gameRange = gameRange;
        get_graph('', '', '', '');
    });
    
    /** Set up game type filter click events **/
    $('.gametype_filter').click(function(e) {
        e.preventDefault(); // prevent default click event
        /** Google Analytics custom event */
        _gaq.push(['_trackEvent', 'Filter', 'Gametype']);
        
        switch(this.id) {
            case 'all':
                t = 'All Game Types';
                break;
            case 'NORMAL':
                t = 'Normal 5v5';
                break;
            case 'NORMAL_3x3':
                t = 'Normal 3v3';
                break;
            case 'RANKED_SOLO_5x5':
                t = 'Ranked Solo Queue';
                break;
            case 'RANKED_TEAM_5x5':
                t = 'Ranked Team 5v5';
                break;
            case 'RANKED_TEAM_3x3':
                t = 'Ranked Team 3v3';
                break;
            case 'ODIN_UNRANKED':
                t = 'Dominion';
                break;
            default:
                t = 'All Game Types'
                break;
        }
        var gameType = this.id;
        $('.gametype_filter_label').text(t);
        sessionStorage.gameType = gameType;
        get_graph('', '', '', '', '');
    });
});

/** Champ filter form submission **/
$(function() {
    
    $('.champ_filter_input').click(function(e) {
        // just select the text
        e.preventDefault();
        $(this).select();
    });
    
    $("button.champ_filter_btn").click(function(e) {
        e.preventDefault(); // prevent the default click event
        /* Google Analytics custom event */
        _gaq.push(['_trackEvent', 'Filter', 'Champion']);
        
        // Grab values from the form
        var champname = $(this).siblings('.champ_filter_input').val();
        $('.champ_filter_input').each(function() {
            $(this).val(champname);
        });
        if (champname == "") {
            // If they didn't supply anything, just don't do anything and return.
            $("input#champname").focus();
            return false;
        }
        $("button.champ_filter_all_champs").removeClass('active');
        $("button.champ_filter_btn").addClass('active');
                
        // Use Ajax to process the form submission
        $.ajax({  
            type: "POST",
            url: "get_champ.php",
            data: {identifier: [champname],
                   get: "id"},
            dataType: "json",
            success: function(phpdata) {
                if (!phpdata[0]) {
                    console.error('invalid champName "'+champname+'" given to get_champ.php');
                    $('.champ_input_form').removeClass('success')
                                          .addClass('error');
                                          
                    $('input#champname').focus().select();
                } else {
                    var champId = phpdata[0];
                    sessionStorage.champId = champId;
                    $(".champ_input_form").removeClass('error')
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
    $("button.champ_filter_all_champs").click(function(e) {
        e.preventDefault();
        
        $("button.champ_filter_all_champs").addClass('active');
        $("button.champ_filter_btn").removeClass('active');
                
        // Use Ajax to process the form submission
        $(".champ_input_form").removeClass('error')
                              .addClass('success');
        
        // Do the graphing and stuff
        sessionStorage.champId = '';
        get_graph('', "", '', 'all');
        
        return false;
    });
});
