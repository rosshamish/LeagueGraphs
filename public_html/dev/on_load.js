var tab = '&emsp;&emsp;&emsp;&emsp;';
/** This MUST be defined AFTER grapher.js so that the checkboxes can inherit the same colors as the graph filters */

/** Array range function, for python-like range(0,10) syntax **/
Array.range= function(a, b, step){
    var A= [];
    if(typeof a== 'number'){
        A[0]= a;
        step= step || 1;
        while(a+step<= b){
            A[A.length]= a+= step;
        }
    }
    else{
        var s= 'abcdefghijklmnopqrstuvwxyz';
        if(a=== a.toUpperCase()){
            b=b.toUpperCase();
            s= s.toUpperCase();
        }
        s= s.substring(s.indexOf(a), s.indexOf(b)+ 1);
        A= s.split('');        
    }
    return A;
}

/** do quicker checkbox making */
function checkbox(name, id, checked) { 
    if (name == '' ) {
        var el = '</ul> <ul class="unstyled">';
    } else {
        var el =
            '<label style="color: '+colorOfFilter[id]+'" class="checkbox inline" for="' + id + '">' +
            '<input type="checkbox" class="checkbox" id="' + id + '" name="' + id + '"' + (checked ? "checked" : "") + '/>' + name +
            '</label>';
    }
    return el;
}

// All the onload stuff
$(document).ready(function() {
    
    /** Input Focus **/
    $("input#summonerName").focus(); // focus on the important input, the name
    
    /** Add Filter Checkboxes **/
    $("#checkboxes").html('<ul class="unstyled">' +
                                           checkbox('Gold Earned', 'goldEarned') +
                                           checkbox('Champions Killed', 'championsKilled') + 
                                           checkbox('Deaths', 'numDeaths') +
                                           checkbox('Assists', 'assists') +
                                           checkbox('Creep Score', 'minionsKilled') +
                                           checkbox('Damage Dealt', 'totalDamageDealt') +
                                           checkbox('Damage Taken', 'totalDamageTaken') +
                                           checkbox('', '') +
                                           checkbox('Time Spent Dead', 'totalTimeSpentDead') +
                                           checkbox('Sight Wards Bought', 'sightWardsBoughtInGame') +
                                           checkbox('IP Earned', 'ipEarned') +
                                           checkbox('Premade Group Size', 'premadeSize') +
                                           '</ul>');
    
    /** Fill the Summoner Name autocomplete **/
    $.ajax({
        type: "POST",
        url: "auto-getsummonernames.php",
        dataType: "json",
        success: function(phpdata) {
            names_arr = phpdata;
            $('.summoner_search_input').each(function(i,el) {
                $(el).typeahead({
                    source: names_arr,
                    updater: function (item) {
                        //item = selected item
                        $(el).val(item);
                        $(el).siblings('.summoner_search_btn').click();
                        //dont forget to return the item to reflect them into input
                        return item;
                    }
                });
            });
        }
    });
    
    /** Fill the Champ Filter autocomplete **/
    var id_arr = Array.range(1, 300); // go up to 300 as safety. you never know when champ ids will get huge or something
    $.ajax({
        type: "POST",
        url: "get_champ.php",
        data: {identifier: id_arr,
               get: "name"},
        dataType: "json",
        success: function(phpdata) {
            var champnames = phpdata;
            $("input#champname").each(function(i,el) {
                $(el).typeahead({
                    source: champnames,
                    updater: function(item) {
                        // item = selected item
                        $(el).val(item);
                        $(el).siblings().click();
                        return item;
                    }
                });
            });
        },
        error: function(p1, p2, p3) {
            console.error("get_champ.php ajax call failed. Errors:");
            console.error(p1);
            console.error(p2);
            console.error(p3);
            console.error("//end ajax call fail.");
        }
    });
    
    /** Add the meta stats, e.g. player being tracked, total games tracked, etc **/
    $.ajax({
        type: "POST",
        url: "get_global_stats.php",
        dataType: "json",
        success: function(phpdata) {
            var duration = 4500;
            d3.select('#currently_tracking')
                .text('0')
              .transition()
                .duration(duration)
                .tween("text", function() {
                    var i = d3.interpolate(this.textContent, phpdata['currently_tracking']);
                    return function(t) {
                        this.textContent = Math.floor(i(t));
                    };
                });
            d3.select('#games_in_database')
                .text('0')
              .transition()
                .duration(duration)
                .tween("text", function() {
                    var i = d3.interpolate(this.textContent, phpdata['games_in_database']);
                    return function(t) {
                        /** This codeblock returns a comma'ed version of the number, i.e. 22351 -> 22,351 **/
                        var sVal = Math.floor(i(t)).toString();
                        s = "";
                        temp = "";
                        for (var idx=sVal.length-1; idx >= 0; idx--) {
                            real = s.replace(',', '');
                            if (real.length % 3 == 0 && real.length > 0) {
                                s = "," + s;
                            }
                            temp = sVal[idx];
                            s = temp + s;
                        }
                        this.textContent = s;
                    };
                });
        },
        error: function() {
            console.log('get_global_stats.php errored out or something');
        }
    });
    
    
    
    /**
     *
     * Set up pageload graph
     * 
    **/
    
    /**
     * Set sessionStorage.share to an appropriate value.
     *     .share represents whether or not we came from a share link.
     */
    if (sessionStorage.share != 'true') {
        sessionStorage.share = false;
    }
    
    /** Normal page-hit, no share link **/
    if (sessionStorage.share == 'false') {
        var defaultPlayer = 'SomePlayer';
        sessionStorage.filters = JSON.stringify([]); 
        sessionStorage.champId = '';
        sessionStorage.gameRange = 200000;
        sessionStorage.gameType = 'all';
        sessionStorage.summoner_name = defaultPlayer;
        
        $('input[type=checkbox]').tzCheckbox(defaultPlayer);
        $('input#championsKilled').click();
        get_graph('', '', '', '');
    }
    
    /** Page hit coming from a share link **/
    if (sessionStorage.share == 'true') {
        // Defaults if unspecified
        if (!sessionStorage.summoner_name) {
            sessionStorage.summoner_name = 'SomePlayer';
        }
        if (!sessionStorage.champId) {
            sessionStorage.champId = '';
        }
        if (!sessionStorage.filters) {
            sessionStorage.filters = ["championsKilled"];
        }
        if (!sessionStorage.gameRange) {
            sessionStorage.gameRange = 20000;
        }
        if (!sessionStorage.gameType) {
            sessionStorage.gameType = '';
        }
        
        /** Summoner name **/
        $('.summoner_search_input').val(sessionStorage.summoner_name);
        
        /** Set up filters **/
        $('input[type=checkbox]').tzCheckbox(sessionStorage.summoner_name); 
        var f = $.parseJSON(sessionStorage.filters);
        if (f) {
            for (var i=0; i < f.length; i++) {
                $('#'+f[i]).attr('checked', 'checked'); // visually check these boxes HEYO
            }
        }
        
        /** gameRange **/
        switch (parseInt(sessionStorage.gameRange)) {
            case 10:
                t = 'Last 10 Games';
                id = 'ten_games';
                gameRange = 10;
                break;
            case 20:
                t = 'Last 20 Games';
                id = 'twenty_games';
                gameRange = 20;
                break;
            case 30:
                t = 'Last 30 Games';
                id = 'thirty_games';
                gameRange = 30;
                break;
            case 60:
                t = 'Last 60 Games';
                id = 'sixty_games';
                gameRange = 60;
                break;
            default:
                t = 'All Time';
                id = 'ever';
                gameRange = 200000;
                break;
        }
        console.log(id);
        $('.time_filter_label').text(t);
        
        /** gameType **/
        switch(sessionStorage.gameType) {
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
        $('.gametype_filter_label').text(t);
        
        /** champId **/
        $.ajax({  
            type: "POST",
            url: "get_champ.php",
            data: {identifier: [sessionStorage.champId],
                   get: "name"},
            dataType: "json",
            success: function(phpdata) {
                if (!phpdata[0]) {
                    console.error('invalid champId "'+sessionStorage.champId+'" given to get_champ.php');
                    $('.champ_input_form').removeClass('success')
                                          .addClass('error');
                                          
                    $('input#champname').focus().select();
                } else {
                    var champname = phpdata[0];
                    if (champname != 'N/A' && champname != '') {
                        $(".champ_input_form").removeClass('error')
                                              .addClass('success');
                        $(".champ_filter_input").val(champname);
                    }                    
                }
            }
        });
        
        /** Get the graph **/
        get_graph('', '', '', '');
    }
    
});
