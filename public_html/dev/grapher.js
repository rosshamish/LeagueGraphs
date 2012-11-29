/**
 * Do the hard work of the graphing and such
 */

// constants for graphing - change these up here, do NOT hardcode them down there.
var width = getGraphWidth(), // 93% of the window width
    height = 350,
    xlabel = "default x label",
    ylabel = "default y label",
    padding = 20,
    margin = 20;

function getGraphWidth() {
    return $(window).width() * 93/100; // an arbitrary percentage. Shoot me.
}
function fixGraphWidth() {
    width = getGraphWidth();
    get_graph('', '', '', '');
};

var resizeTimer
$(window).resize(function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fixGraphWidth, 100);
});


var colorOfFilter = {'premadeSize' : "\#888888",
                     'championsKilled' : "\#00FF00",
                     'assists' : "\#FF8000",
                     'numDeaths' : "\#FF0000",
                     'sightWardsBoughtInGame' : "\#FF1A8C", 
                     'minionsKilled' : "\#0000FF",
                     'totalTimeSpentDead' : "\#7ABDFF",
                     'ipEarned' : "\#010101",
                     'goldEarned' : "\#C2C200",
                     'totalDamageDealt' : "\#00CC66",
                     'totalDamageTaken' : "\#FF5757"};
                     
/** Append a no games found notice to the svg space **/
function noGamesFound(svg, champname) {
    var message = "No games found for " + champname;
    var tp = $.cookie('gameType');
    if (tp != null && tp != 'all' && tp != '') {
        message += " in that gametype"; // in that gametype boiii.
    }
    message += "!"; // some exclamation boiii.
    svg.append("text")
      .attr('x', width / 3)
      .attr('y', height / 3)
      .attr('fill', 'black')
      .text(message);
}

/* Define some range scales for use with different statistics.
 * The hard-coded values are based on observation of 'normal' values in game
*/
var minheight = 0 + margin;
var maxheight = height - margin;
var yScale = d3.scale.linear()
              .domain([0, 20])
              .range([minheight, maxheight]); // default
var yScale0_5 = d3.scale.linear()
              .domain([0, 5])
              .range([minheight, maxheight]); // for premade size
var yScale0_25 = d3.scale.linear()
              .domain([0, 25])
              .range([minheight, maxheight]); // for kills, assists, deaths, sight wards
var yScale0_200 = d3.scale.linear()
              .domain([0, 200])
              .range([minheight, maxheight]); // for cs
var yScale0_500 = d3.scale.linear()
              .domain([0, 500])
              .range([minheight, maxheight]); // for time spent dead, ip earned
var yScale1k_20k = d3.scale.linear()
              .domain([1000, 20000])
              .range([minheight, maxheight]); // for gold earned
var yScale2k_300k = d3.scale.linear()
              .domain([2000, 300000])
              .range([minheight, maxheight]); // for damage dealt
var yScale2k_60k = d3.scale.linear()
              .domain([2000, 60000])
              .range([minheight, maxheight]); // for damage taken

/* Does y scaling depending on what the expected values are for that particular statistics */
function scale_on_filter(filter, y) {
    var ret_y = yScale(y);
    switch (filter) {
        case "premadeSize":
            ret_y = yScale0_5(y);
            break;
        case "championsKilled":
        case "assists":
        case "numDeaths":
        case "sightWardsBoughtInGame":
            ret_y = yScale0_25(y);
            break;
        case "minionsKilled":
            ret_y = yScale0_200(y);
            break;
        case "totalTimeSpentDead":
        case "ipEarned":
            ret_y = yScale0_500(y);
            break;
        case "goldEarned":
            ret_y = yScale1k_20k(y);
            break;
        case "totalDamageDealt":
            ret_y = yScale2k_300k(y);
            break;
        case "totalDamageTaken":
            ret_y = yScale2k_60k(y);
            break;
        default:
            ret_y = yScale(y);
            break;
    }
    return ret_y;
}

/**
 * Updates the current game stats in the table
 */
function updateCurrentGameStats(gameData) {
    /** Champ **/
    $('span#champ').html(gameData['champName']);  
    
    /** KDA-CS **/
    $('span#kills').html(gameData['championsKilled']);
    $('span#assists').html(gameData['assists']);
    $('span#deaths').html(gameData['numDeaths']);
    $('span#creep_score').html(gameData['minionsKilled']);
    
    /** Items **/
    for (var i=0; i <= 5; i++) {
        $('span#item' + i).html(gameData['item' + i + '_name']);
    }    
}

/** @objective: display the graph inside of #graph
 * @params:
 *  summoner_name (string) => the summoner name. If given empty string, the 'summoner_name' cookie will be used instead.
 *  x_field (string) => the x axis of the graph. If given empty string, this defaults to 'gameId', which will basically be time on the x axis.
 *  y_field (string) => the y axix/es of the graph. If given empty string, this defaults to the contents of the JSON-string 'filters' cookie.
 *  champId (string) => the championId filter (i.e. only show games with this champ). If given empty string, this defaults to the 'champId' cookie.
 *                      To reset champId, pass the string 'all' as a parameter.
 *  gameRange (string) => options: 'ten_games', 'thirty_games', 'ten_days', 'thirty_days', 'all_games' -- the range of games to get. If given empty string, this defaults
 *                      to 'all_games'.
 *  gameType (string) => options: 'all', 'NORMAL', 'NORMAL_3x3', 'RANKED_SOLO_5x5', 'RANKED_TEAM_5x5', 'RANKED_TEAM_3x3', 'ODIN_UNRANKED'. If given empty string, defaults to 'gameType' cookie.
 */
function get_graph(summoner_name, x_field, y_field, champId, gameRange, gameType) {
    if (summoner_name == '') {
        summoner_name = $.cookie('summoner_name');
    } else {
        $.cookie('summoner_name', summoner_name);
    }
    if (x_field == '') {
        x_field = 'gameId';
    }
    if (y_field == '') {
        y_field = $.cookie('filters');
    }
    if (champId == 'all') {
        $.cookie('champId', null);
    } else {
        champId = $.cookie('champId');
    }
    if (gameType != null && gameType != undefined) { // if it was passed
        if (gameType == '') { // if it is blank, use the cookie. Otherwise, just use what was given.
            gameType = $.cookie('gameType');
        }
    } else {
        gameType = $.cookie('gameType');
    }
    //console.log('received game type "' + gameType + '" in grapher.js');
    $('#gametype_title').html(' - ' + $('#gametype_filter_label').text());
    
    // get the data from x_field and y_field from an ajax post request to get_graph_data.php
    $.ajax({
        type: "POST",
        url: "get_graph_data.php",
        data: { summonerName : summoner_name,
                x_field : x_field,
                y_field : y_field,
                champId : champId,
                gameRange : gameRange,
                gameType : gameType },
        dataType: "json",
        success: function(data) {
            $("#graph_title").html(" - " + $.cookie('summoner_name'));
            
            // SVG creation. This only happens once.
            var svg = d3.select("svg")
                    .attr("width", width)
                    .attr("height", height);
            $("svg").empty();
            
            /* 
             * Bar Graph of Filtered Statistics
             */
            if (data.length > 0) { // if there is indeed data
                var num_filters = data[0].y.length;
            } else {
                var num_filters = 0;
            }
            var num_values = data.length;
            var filters = $.parseJSON($.cookie('filters'));
            
            /** deal with "time" being the desired x value */
            if (x_field == 'gameId') {
                for (var i=0; i < data.length; i++) { // for each x point in the data
                    data[i].x = i;   
                }
            }
            var x_arr = [];
            var y_arr = [];
            
            // this gives x_arr and y_arr to be arrays of arrays, containing *number of fields* number of arrays,
            // with each array containing *number of gamesplayed/datapoints* values in each inner array
            for (var cur_filter=0; cur_filter < num_filters; cur_filter++) {
                x_arr[cur_filter] = [];
                y_arr[cur_filter] = [];
                // game_found will be used MUCH later down to layer a notification text on top of the graph that no games were
                // found for this particular champion.
                var game_found = false; // check if a game was actually found (this is for the champ and gametype filters)
                for (var idx=0; idx < data.length; idx++) {
                    x_arr[cur_filter].push(data[idx].x);
                    y_arr[cur_filter].push(data[idx].y[cur_filter]);
                    if (data[idx].game_found) {
                        game_found = true;
                    }
                }
            }
            
            var seriesData = [];
            for (var i=0; i < num_filters; i++) {
                seriesData[i] = [];
                for (var j=0; j < num_values; j++) {
                    seriesData[i][j] = new Object();
                    seriesData[i][j].x = x_arr[i][j];
                    seriesData[i][j].y = y_arr[i][j];
                }
                
            }
            
            /** domain and range */
            padding = width / data.length; // padding is the width divided by the number of data points
            // set domain
            var xmin = Math.min.apply(Math, x_arr[0]); // just use the lowest array of x vals
            var xmax = Math.max.apply(Math, x_arr[0]); // just use the lowest array of x vals
            var xScale = d3.scale.linear()
                          .domain([xmin, xmax])
                          .range([0, width-padding]);
                          
            // Groups scale, x axis
            var xgScale = d3.scale.ordinal()
                .domain(d3.range(num_values))
                .rangeBands([0, width], 0.2);
          
            // Series scale, x axis
            // It might help to think of the series scale as a child of the groups scale
            var xsScale = d3.scale.ordinal()
                .domain(d3.range(num_filters))
                .rangeBands([0, xgScale.rangeBand()]);
            
            // Series selection
            // We place each series into its own SVG group element. In other words,
            // each SVG group element contains one series (i.e. bars of the same colour).
            // It might be helpful to think of each SVG group element as containing one bar chart.
            var series = svg.selectAll("g.filter")
                .data(seriesData)
              .enter()
                .append("g")
                .attr("class", "filter")
                .attr("fill", function(d, i) {
                    return colorOfFilter[filters[i]];
                    })
                .attr("transform", function (d, i) { return "translate(" + xsScale(i) + ")"; });
                
            var groups = series.selectAll("rect")
                .data(Object)
              .enter()
                .append("rect")
                .attr('data-powertip', function(d, i, j) {
                    $(this).powerTip({
                        followMouse: true,
                        fadeInTime: 100,
                        fadeOutTime: 50,
                        closeDelay: 50
                    });
                    val = d.y;
                    var sVal = val.toString();
                    if (d.y <= 999) {
                        return sVal;
                    }
                    /** This codeblock returns a comma'ed version of the number, i.e. 22351 -> 22,351 **/
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
                    return s;
                })
                .on('mouseover', function(d, i, j) {
                    d3.select(this).attr('stroke', d3.rgb(0, 0, 0));
                    $.powerTip.showTip($(this));
                })
                .on('mouseout', function(d, i, j) {
                    d3.select(this).attr('stroke', d3.select(this).attr('fill'));
                    $.powerTip.closeTip();
                })
                .on('click', function(d, i) {
                    var oldest_game = data[i]['createDate'];
                    var date = oldest_game.substring(0, 10);
                    var day = Number(date.substring(8, 10));
                    var monthnum = Number(date.substring(5, 7));
                    var year = date.substring(0, 4);
                    var months_arr = ["Zeroth", "January", "February", "March", "April", "May", "June", "July",
                                      "August", "September", "October", "November", "December"];
                    var month = months_arr[monthnum];
                    
                    var hour = oldest_game.substring(11, 13);
                    var minute = oldest_game.substring(14,16);
                    var second = oldest_game.substring(17,19);
                    
                    var d1 = new Date(month + " " + day + ", " + year + " " + hour +":"+minute+":"+second);
                    console.log(d1);
                    var d2 = new Date(d1.getTime() - d1.getTimezoneOffset()*60*1000);
                    console.log(d2.toDateString());
                    var ampm = 'am';
                    var ampmhour = d2.getHours();
                    if (d2.getHours() > 11) { // if it is past noon
                        ampm = 'pm';
                        if (d2.getHours() > 12) {
                            ampmhour -= 12;
                        }
                    }
                    var time = ampmhour + ":" + d2.getMinutes() + " " + ampm;
                    $("span#selected_game_date").html(d2.toDateString() + " at " + time);
                    
                    d3.select('.selected_game').classed('selected_game', false);
                    d3.select(this).classed('selected_game', true);
                    $.ajax({
                        url: 'get_champ.php',
                        type: 'POST',
                        data: { identifier : [data[i]['championId']],
                                get : 'name'},
                        dataType: 'json',
                        async: false,
                        success: function(champName) {
                            data[i]['champName'] = champName[0];
                        }
                    });
                    var items = [];
                    for (var j=0; j <= 5; j++) {
                        items[j] = data[i]['item' + j];
                    }
                    $.ajax({
                        url: 'get_item.php',
                        type: 'POST',
                        data: { identifier : items,
                                get : 'name' },
                        dataType: 'json',
                        success: function(items) {
                            for (var j=0; j <= 5; j++) {
                                data[i]['item'+j+'_name'] = items[j];
                            }
                            updateCurrentGameStats(data[i]);
                        }
                    });
                    
                })
                .attr('data-filter', function(d, i, j) {
                    return filters[j];
                })
                .attr("width", function(d, i) {
                    return xsScale.rangeBand();
                    })
                .attr("height", function(d, i, j) {
                    return scale_on_filter(filters[j], d.y) * 3/2; // make it a bit bigger so that it can bounce in without showing its bottom
                    })
                .attr("x", function(d, i) {
                    return 0; // this value is handled by the attr('transform')
                    })
                .attr("transform", function (d, i) { return "translate(" + xgScale(i) + ")"; })
                .attr("y", height)
              .transition()
                .duration('750')
                .ease('elastic')
                .attr("y", function(d, i) {
                    return height - scale_on_filter($(this).attr('data-filter'), d.y);
                    });
                
            /**
             * End Bar Graph *
             */
            
            /**
             * Line Graph of Winrate *
             */
            $.ajax({
                type: "POST",
                url: "get_winrate.php",
                data: { trendy: true,
                        gameRange : gameRange
                      },
                dataType: "json",
                success: function(phpdata) {
                    var winrate_arr = phpdata;
                    var margin = 20,
                    y = d3.scale.linear().domain([0, 100]).range([height - margin*2, 0 + margin*2]),
                    x = d3.scale.linear().domain([0, winrate_arr.length-1]).range([0 + margin, width - margin]);
                    
                    var line = d3.svg.line()
                        .x(function(d,i) { return xgScale(i) + (xsScale.rangeBand() * num_filters) / 2; }) // the stats graph x value plus half each bar group's width
                        .y(function(d) { return y(d); })
                        .interpolate('basis');
                    
                    var wr_50 = d3.svg.line()
                        .x(function(d,i) { return d; })
                        .y(function(d,i) { return height/2; });
                    
                    var wr_g = svg.append('g')
                      .classed('wr_50', true);
                      
                    wr_g.append("svg:path")
                      .classed('wr_dotted', true)
                      .attr('stroke-dasharray', '10 10')
                      .attr('d', wr_50([0, width]));
                      
                    wr_g.append("text")
                      .classed('wr_50_text', true)
                      .text('50% Winrate')
                      .attr('x', width / 2)
                      .attr('y', height / 2 - 10)
                      .attr("text-anchor", "middle");
                    
                    
                    var g = svg.append("g")
                      .classed('winrate', true);
                      
                    var path = g.append("svg:path")
                      .attr("d", line(winrate_arr))
                      .attr('id', "winrate_line")
                      .classed("winrate", true)
                    
                      
                    var totalLength = path.node().getTotalLength();

                    path
                      .attr("stroke-dasharray", totalLength + " " + totalLength)
                      .attr("stroke-dashoffset", totalLength)
                      .transition()
                        .duration(2000)
                        .ease("linear")
                        .attr("stroke-dashoffset", 0);
                },
                error: function(error) {
                    console.log('get_winrate errored out');
                }
            });
            
            /**
             * End Line Graph *
             */
            
            /**
             * Notification of No Games Found
             */
            // If no game was found, do an ajax call to find out the champName from the champId and
            // display a notification that no games were found for ~summoner~ playing as ~champname~.
            // ...Should find out the champ name anyway so that we can display it in the graph title.
            $.ajax({
                type: "POST",
                url: "get_champ.php",
                data: { identifier: [champId],
                        get: "name" },
                dataType: "json",
                async: false,
                success: function(names) {
                    var champName = '';
                    if (names[0] != "N/A") { // if we're filtering by champ, and not just set on All Champs
                        champName = names[0];
                        $("#graph_title").html(' - ' + summoner_name + ' (' + champName + ')');
                    } else {
                        champName = 'any champion';
                        $("#graph_title").html(' - ' + summoner_name);
                    }
                    if (!game_found) {
                        noGamesFound(svg, champName);
                        console.log('no game found');
                    }
                }
            });
            
            /**
             * End Notification of No Games Found
             */
        }
    });
    
}