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
    
    /** Clear Cookies **/
    $.cookie('filters', null); // clear this pesky cookie, why do ipearned and sightwardsboughtingame always get set for some reason
    $.cookie('champId', null);
    $.cookie('gameType', 'all');
    
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
            $('input#summonerName').typeahead({
                source: names_arr
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
            $("input#champname").typeahead({
                source: champnames
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
            default:
                t = '??'
                gameRange = 100000;
                break;
        }
        $('#time_filter_label').text(t);
        $.cookie('gameRange', gameRange);
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
        $('#gametype_filter_label').text(t);
        $.cookie('gameType', gameType);
        get_graph('', '', '', '', '');
    });
    
        
    /** Set up default graph **/
    var defaultPlayer = 'SomePlayer';
    $.cookie('summoner_name', defaultPlayer);
    $('input[type=checkbox]').tzCheckbox(defaultPlayer);
    $('#championsKilled').click(); // this click ALSO gets the initial graph
});
