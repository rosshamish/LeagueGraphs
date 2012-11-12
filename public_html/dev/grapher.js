/**
 * Do the hard work of the graphing and such
 */

// constants for graphing - change these up here, do NOT hardcode them down there.
var width = 800,
    height = 300,
    xlabel = "default x label",
    ylabel = "default y label",
    padding = width / 10;
    
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
    svg.append("text")
      .attr('x', width / 2)
      .attr('y', height / 2)
      .attr('fill', 'red')
      .text("No games found for " + champname + "!");
}

/* Define some range scales for use with different statistics.
 * The hard-coded values are based on observation of 'normal' values in game
*/
var minheight = height / 50;
var maxheight = height * 95/100;
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
 *  Takes an SQL field and returns a string containing a more user-friendly name
 *  for the field.
 */
function sanitize_field_name(field) {
    // TODO write this function
}

// Generate some data.
// TODO allow more than one set of y-values on a range of x-values
function get_graph(summoner_name, x_field, y_field, champId) {
    if (summoner_name == '') {
        summoner_name = $.cookie('summoner_name');
    } else {
        $.cookie('summoner_name', summoner_name);
    }
    if (champId == '') {
        $.cookie('champId', null);
    } else if (!champId) {
        champId = $.cookie('champId');
    }
    if (y_field == '') {
        y_field = $.cookie('filters');
    }
    
    // get the data from x_field and y_field from an ajax post request to get_graph_data.php
    $.ajax({
        type: "POST",
        url: "get_graph_data.php",
        data: { summonerName : summoner_name,
                x_field : x_field,
                y_field : y_field,
                champId : champId},
        dataType: "json",
        success: function(data) {
            $("#graph_title").html(" - " + $.cookie('summoner_name'));
            
            // Empty the old graph
            $("#graph").empty();
            // SVG creation. This only happens once.
            var svg = d3.select("#graph")
                  .append("svg")
                    .attr("width", width)
                    .attr("height", height);
            
            $.ajax({
                type: "POST",
                url: "get_champ.php",
                data: { identifier: [champId],
                        get: "name" },
                dataType: "json",
                async: false,
                success: function(names) {
                    if (names[0] != "N/A") { // if we're filtering by champ, and not just set on All Champs
                        $("#graph_title").append(" (" + names[0] + ")"); // append the champ name to the graph title
                        if (!data[0]) { // if no games were returned
                            noGamesFound(svg, names[0]); // show no games found and return, stop making the graph cause you'll just error out
                            return;
                        }
                    }
                }
            });
            
            var num_filters = data[0].y.length;
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
                for (var idx=0; idx < data.length; idx++) {
                    x_arr[cur_filter].push(data[idx].x);
                    y_arr[cur_filter].push(data[idx].y[cur_filter]);
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
            var series = svg.selectAll("g.series")
                .data(seriesData)
              .enter()
                .append("g")
                .attr("class", "series")
                .attr("fill", function(d, i) {
                    return colorOfFilter[filters[i]];
                    })
                .attr("transform", function (d, i) { return "translate(" + xsScale(i) + ")"; });
            
            /* Bar Graph */
            var groups = series.selectAll("rect")
                .data(Object)
              .enter()
                .append("rect")
                .attr("width", function(d, i) {
                    return xsScale.rangeBand();
                    })
                .attr("height", function(d, i, j) {
                    
                    return scale_on_filter(filters[j], d.y);
                    })
                .attr("x", function(d, i) {
                    return 0; // this value is handled by the attr('transform')
                    })
                .attr("y", function(d, i, j) {
                    return height - scale_on_filter(filters[j], d.y);
                    })
                .attr("transform", function (d, i) { return "translate(" + xgScale(i) + ")"; });
                    
            var texts = series.selectAll("text")
                .data(Object)
                .enter()
                .append("text")
                .attr("font-family", "sans-serif")
                .attr("fill", "white")
                .attr("text-anchor", "middle")
                .attr("x", function(d, i) {
                    return 0;
                    })
                .text(function(d) {
                        if (d.y > 1000) {
                            return Math.round(d.y / 100) / 10 + "k";
                        } else {
                            return d.y;
                        }
                    })
                .attr("y", function(d, i, j) {
                    return height - scale_on_filter(filters[j], d.y) + 15;
                })
                .attr("transform", function (d, i) {
                    var trans = xgScale(i) + (0.5) * xsScale.rangeBand();
                    return "translate(" + trans + ")";
                });
            // now show the graph, since we're all done making it
            $("#graph").show();
        }
    });
    
}