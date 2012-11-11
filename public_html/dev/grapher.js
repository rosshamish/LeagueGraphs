/**
 * Do the hard work of the graphing and such
 */
// constants for graphing - change these up here, do NOT change values and hardcode them down there
var width = 800,
    height = 300,
    xlabel = "default x label",
    ylabel = "default y label",
    padding = width / 10;
    
var colorSwatch = d3.scale.category10();

// bar graphs
var bar_padding = 1;

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
    if (!champId) {
        champId = '';
        console.log('!champId, resetting cookie');
        $.cookie('champId', null);
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
            
            // Empty the old graph
            $("#graph").empty();
            
            var num_filters = data[0].y.length;
            var num_values = data.length;
            
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
             
            // SVG creation. This only happens once, and therefore should NOT be in the loop
            var svg = d3.select("#graph")
                  .append("svg")
                    .attr("width", width)
                    .attr("height", height);
            
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
                    return colorSwatch(i);
                    })
                .attr("transform", function (d, i) { return "translate(" + xsScale(i) + ")"; });
            
            // set range
            //var ymin = Math.min.apply(Math, y_arr[cur_filter]);
            //var ymax = Math.max.apply(Math, y_arr[cur_filter]); 
            var yScale = d3.scale.linear()
                          .domain([0, 20]) // change this to reflect real values
                          .range([height / 10, height * 9 / 10])
            
            /* Bar Graph */                    
            var groups = series.selectAll("rect")
                .data(Object)
              .enter()
                .append("rect")
                .attr("width", function(d, i) {
                    return xsScale.rangeBand();
                    })
                .attr("height", function(d) {
                    return yScale(d.y);
                    })
                .attr("x", function(d, i) {
                    return 0; // this value is handled by the attr('transform')
                    })
                .attr("y", function(d) {
                    return height - yScale(d.y);
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
                .attr("y", function(d) {
                    return height - yScale(d.y) + 15;
                })
                .attr("transform", function (d, i) {
                    var trans = xgScale(i) + (0.5) * xsScale.rangeBand();
                    return "translate(" + trans + ")";
                });
                
            /* Do the graph */
            //$("#graph").hide();
            
            // Build the plot.
            var y_axis = $.parseJSON($.cookie('filters'))[cur_filter];
            if (x_field == 'gameId') {
                var x_axis = 'time';
                var title = y_axis + " per game for " + summoner_name;
            } else {
                var x_axis = x_field;
                var title = x_axis + " vs. " + y_axis + " for " + summoner_name;
            }
            console.log('Graphing: ' + title);
            // now show the graph, since we're all done making it
            $("#graph").show();
        }
    });
    
}