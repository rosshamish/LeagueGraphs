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
    $.cookie('filters', null); // clear this pesky cookie, why do ipearned and sightwardsboughtingame always get set for some reason
    $.cookie('champId', null);
    $("input#summonerName").focus(); // focus on the important input, the name
    // Add the checkboxes
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
    var id_arr = Array.range(1, 150); // go up to 150 as safety. you never know when champ ids will get huge or something
    $.ajax({
        type: "POST",
        url: "get_champ.php",
        data: {identifier: id_arr,
               get: "name"},
        dataType: "json",
        success: function(phpdata) {
            console.log("get_champ.php => " + phpdata);
            var champnames = phpdata;
            $("input#champname").typeahead({
                source: champnames}
                );
            
        },
        error: function(p1, p2, p3) {
            console.error("get_champ.php ajax call failed. Errors:");
            console.error(p1);
            console.error(p2);
            console.error(p3);
            console.error("//end ajax call fail.");
        }
    });
    
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
                        this.textContent = Math.floor(i(t));
                    };
                });
        },
        error: function() {
            console.log('get_global_stats.php errored out or something');
        }
    });
    $('#graph').attr('data-powertip', 'some game info');
    $('#graph').powerTip({
        followMouse: true
    });
    
    // This sets up click events. Using a default name.
    var defaultPlayer = 'SomePlayer';
    $('input[type=checkbox]').tzCheckbox(defaultPlayer);
    $('#championsKilled').click();
    // add the default graph!
    get_graph(defaultPlayer, '', '', '');
});