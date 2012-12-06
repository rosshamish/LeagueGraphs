/**  Link sharing **/
$(function() {   
   /*
    *This is using the pattern "click the link, update the link"
    */
   $('.sharelink').click(function() {
    $input = $('input.sharelink');
    var link = $input.val();
    var n = sessionStorage.summoner_name;
    var r = sessionStorage.gameRange;
    var c = sessionStorage.champId;
    var t = sessionStorage.gameType;
    var f = sessionStorage.filters;
    
    // n
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
    // r
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
    // c
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
    // t
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
    // f
    index = link.indexOf('f=');
    if (index != -1) { // if this param is already present
        if (link.substring(index).indexOf('&') != -1) { // if it isn't the last param
            link = link.replace(/f=.+?&/gi, 'n='+f+'&');
        } else { // it's the last param
            link = link.replace(/f=.+/gi, 'f='+n);
        }
    } else { // add this param in
        if (link.indexOf('?') != -1) { // if there are other params already
            link += '&f='+f;
        } else { // this is the first param
            link += '?f='+f;
        }
    }
    
    // Select it for easier copy and paste
    $input.val(link);
    $input.select();
   });
   
   /*
    *All of these are of the pattern "click a button, change the link"
    *
   $('.summoner_search_btn').on('click', function() {
    var link = $('.sharelink').val();
    console.log('oldlink: ' + link);
    var newval = $(this).siblings('.summoner_search_input').val();
    console.log('newval: ' + newval);
    link = link.replace(/n=*&/gi, "n="+newval+"&");
    console.log('newlink: ' + link);
    $('.sharelink').val(link);
   });
   
   $('.time_filter').on('click', function(e) {
    e.preventDefault();
    var link = $('.sharelink').val();
    console.log('oldlink: ' + link);
    var newval = $(this).attr('data-range');
    console.log('newval: ' + newval);
    link = link.replace("r=", "r="+newval);
    console.log('newlink: ' + link);
    $('.sharelink').val(link);
   });
   
   $('.gametype_filter').on('click', function(e) {
    e.preventDefault();
    var oldval = $('.sharelink').val();
   });
   
   $("button.champ_filter_btn").on('click', function() {
    var oldval = $('.sharelink').val();
   });
   
   $("button.champ_filter_all_champs").on('click', function() {
    var oldval = $('.sharelink').val();
   });
   */
   
   // deal with filters
   
   
});

/** Form submission on button click **/
$(function() {
    
    /** Input selection **/
    $('.summoner_search_input').click(function() {
        $(this).select();
    });
    
    /** Player search **/
    $(".summoner_search_btn").click(function() {
        document.activeElement.blur();
        $this = $(this);
        // Grab values from the form
        var input = $this.siblings('.summoner_search_input');
        var summonerName = input.val();
        $('.summoner_search_input').val(input.val());
        if (summonerName == "") {
            input.focus();
            return false;
        }
        sessionStorage.summoner_name = summonerName; // set the summoner_name, we're looking at a new player
        sessionStorage.gameType = 'all';
        sessionStorage.champId = '';
        $('.gametype_filter_label').text('All Game Types');
        sessionStorage.gameRange = '';
        $(".time_filter_label").text('All Time');
        $(".champ_filter_all_champs").addClass('active');
        $(".champ_filter_btn").removeClass('active');
        $("input#champname").text('');
        $(".champ_input_form").removeClass('success');
        
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
                    
                    input.focus().select();
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
                    get_graph('', '', '', '');
                    
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
                summonerName : sessionStorage.summoner_name
            },
            success: function(data) {
                // nothing to do here, the insert takes place in add_to_players, nothing has to actually be done on the frontend side.
            }
        });
        
        $('html, body').stop().animate({
            scrollTop: $('.nav-tabs').offset().top
        }, 1500);
        
        return false;
    });
});

/** Gamerange and gametype filter click events **/
$(function() {
    /** Set up time filter click events **/
    $('.time_filter').click(function(e) {
        e.preventDefault();
        var gameRange = 100000;
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
        e.preventDefault();
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
    
    $('.champ_filter_input').click(function() {
        $(this).select();
    });
    
    $("button.champ_filter_btn").click(function() {
        
        // Grab values from the form
        var champname = $(this).siblings('.champ_filter_input').val();
        $('.champ_filter_input').each(function() {
            $(this).val(champname);
        });
        if (champname == "") {
            $("input#champname").focus();
            return false;
        }
        $("button.champ_filter_all_champs").removeClass('active');
        $("button.champ_filter_btn").addClass('active');
                
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
    $("button.champ_filter_all_champs").click(function() {
        
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
