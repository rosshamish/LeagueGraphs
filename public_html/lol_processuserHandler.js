var tab = '&emsp;&emsp;&emsp;&emsp;';

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

// Focus the cursor on the login box on page load.
$(document).ready(function() {
    $("input#summonerName").focus();
    // add the default graph!
    get_graph("somePlayer", "gameId", "championsKilled");
    // Add the checkboxes
    $("#checkboxes").html('<ul class="unstyled">' +
                                           checkbox('Gold Earned', 'goldEarned') +
                                           checkbox('Champions Killed', 'championsKilled', true) + 
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
    var champname = "olaf";
    var id = Array.range(1, 150);
    $.ajax({
        type: "POST",
        url: "get_champ.php",
        data: {identifier: id,
               get: "name"},
        dataType: "json",
        success: function(phpdata) {
            console.log("get_champ.php => " + phpdata);
            var champnames = phpdata;
            champnames.sort();
            $("#champ-select").append('<select multiple="multiple" id="select">');
            $("#select").append("<option>Any Champion</option>");
            for (var i=0; i < champnames.length; i++) {
                console.log("champnames["+i+"] => " + champnames[i]);
                $("#select").append(select(champnames[i]));
            }
            $("#champ-select").append('</select>');
            $(".typeahead").typeahead({
                source: ["Akali", "Alistar"]}
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
    
    // This sets up click events. Using "SomePlayer" as the default.
    $('input[type=checkbox]').tzCheckbox("SomePlayer");    
});

/** do quicker checkbox making */
function checkbox(name, id, checked) { 
    if (name == '' ) {
        var el = '</ul> <ul class="unstyled">';
    } else {
        var el =
            '<label class="checkbox inline" for="' + id + '"><input type="checkbox" class="checkbox" id="' + id + '" name="' + id + '"' + (checked ? "checked" : "") + '/>' + name + '</label>';
    }
    return el;
}

/** do quicker select option making */
function select(name) { 
    if (name == '' ) {
        var el = '</select> <select multiple="multiple">';
    } else {
        var el =
            '<option value="'+name+'">'+name+'</option>';
    }
    return el;
}


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
        $("#graph").html("<img src=/images/ajax-loader.gif />");
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
                    $("#graph").empty();
                    
                    $('input#summonerName').focus().select();
                } else {
                    // split the return string of form numGames:summonerName
                    var numGames = phpdata.split(":")[0];
                    var name = phpdata.split(":")[1];
                    
                    // Do the graphing and stuff
                    
                    // Get data from SQL
                    get_graph(name, "gameId", "championsKilled");
                    
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