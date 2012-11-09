/**
 * Do the hard work of the graphing and such
 */
// constants for graphing - change these up here, do NOT change values and hardcode them down there
var width = 800,
    height = 300,
    xlabel = "default x label",
    ylabel = "default y label",
    padding = width / 10;
    
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
        console.log('!champId');
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
        success: function(phpdata) {            
            var data = phpdata;
            var x_array = [];
            var y_array = [];
            
            for (var i=0; i< data.length; i++) {
                var xval = data[i].x;
                var yval_arr = [];
                for (var j=0; j < data[i].y.length; j++) {
                  yval_arr.push(data[i].y[j]);
                }
                x_array.push(xval);
                y_array.push(yval_arr);
            }
            
            /** deal with "time" being the desired x value */
            // if time is the desired x-axis (i.e. gameId)
            if (x_field == "gameId") {
                // gameIds are already sorted ascending, i.e. in time -> order, so just set
                // their values to reasonable integers
                for (var i=0; i < x_array.length; i++) {
                    // set x values to 0 through the length
                    x_array[i] = i;
                }
            }
            
            /** domain and range */
            padding = width / x_array.length;
            // set domain
            var xmin = Math.min.apply(Math, x_array);
            var xmax = Math.max.apply(Math, x_array);
            var xScale = d3.scale.linear()
                          .domain([xmin, xmax])
                          .range([0, width-padding]);
            
            /** this is the part that needs to be done separately for each filter */
            for (var idx=0; idx < y_array[0].length; idx++) {
                var cur_y_arr = y_array[0];
                console.log('cur_y_arr: ' + cur_y_arr);
                return;
                // set range
                var ymin = Math.min.apply(Math, cur_y_arr);
                var ymax = Math.max.apply(Math, cur_y_arr); 
                var yScale = d3.scale.linear()
                              .domain([ymin, ymax])
                              .range([0, height])
                
                // build the data
                data = [];
                for (var i=0; i < x_array.length; i++) {
                    data.push({'x': x_array[i], 'y': cur_y_arr[i]});
                }
                
                /* Do the graph */
                // Empty the old graph
                $("#graph").empty();
                $("#graph").hide();
                
                // Build the plot.
                var y_axis = $.parseJSON($.cookie('filters'))[idx];
                if (x_field == 'gameId') {
                    var x_axis = 'time';
                    var title = y_axis + " per game for " + summoner_name;
                } else {
                    var x_axis = x_field;
                    var title = x_axis + " vs. " + y_axis + " for " + summoner_name;
                }
                
                // Append the necessary elements
                /* Bar Graph Option */
                var svg = d3.select("#graph")
                  .append("svg")
                    .attr("width", width)
                    .attr("height", height);
                
                svg.selectAll("rect")
                    .data(data)
                    .enter()
                    .append("rect")
                    .attr("width", function(d, i) {
                        return (width / data.length) - bar_padding;
                        })
                    .attr("height", function(d) {
                        return yScale(d.y);
                        })
                    .attr("x", function(d, i) {
                        return xScale(d.x);
                        })
                    .attr("y", function(d) {
                        return height - yScale(d.y);
                        })
                    .attr("fill", function(d) {
                        return d3.hsl(249, 0.10 * idx, d.y / (ymax*2));
                        });
                    
                svg.selectAll("text")
                    .data(data)
                    .enter()
                    .append("text")
                    .attr("font-family", "sans-serif")
                    .attr("fill", "white")
                    .attr("text-anchor", "middle")
                    .attr("x", function(d, i) {
                        return xScale(d.x) + ((width / data.length) - bar_padding) / 2;
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
                    });
            
            }
            // now show the graph, since we're all done making it
            $("#graph").show();
        }
    });
    
}