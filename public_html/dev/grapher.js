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
            //console.log('---');
            //console.log(phpdata);
            //console.log('---');
            
            var data = phpdata;
            var x_array = [];
            var y_array = [];
            /* format: [{"x":"178992375","y":["2","2"]},{"x":"179015423","y":["15","1"]}] */
            // we'll have to build more than one y_array (y_array will be an array of arrays)
            for (var y_coord=0; y_coord< data[0].y.length; y_coord++) {
                var yval_arr = []; // clear the y values array
                var xval_arr = [];
                for (var x_coord=0; x_coord< data.length; x_coord++) {
                    var xval = data[x_coord].x;
                    
                    yval_arr.push(data[x_coord].y[y_coord]);
                    xval_arr.push(data[x_coord].x);
                }
                y_array.push(yval_arr); // push the y values array, then clear it ^^ up there
                x_array.push(xval_arr); // push the x values array, then clear it ^^ up there
            }
            //console.log('===');
            //for (var i=0; i<y_array.length; i++) {
            //    console.log("at finish, x_array[" + i + "]: " + x_array[i]);
            //    console.log("at finish, y_array[" + i + "]: " + y_array[i]);
            //    console.log('--');
            //}
            //console.log('===');
            
            /** deal with "time" being the desired x value */
            // if time is the desired x-axis (i.e. gameId)
            if (x_field == "gameId") {
                // gameIds are already sorted ascending, i.e. in time -> order, so just set
                // their values to reasonable integers
                for (var i=0; i < x_array.length; i++) {
                    // set x values to 0 through the length
                    for (var j=0; j < x_array[i].length; j++) {
                        x_array[i][j]= j;
                    }  
                }
            }
            console.log('===');
            for (var i=0; i < x_array.length; i++) {
                for (var j=0; j < x_array[i].length; j++) {
                    console.log('x_array[' + i + '][' + j + ']: ' + x_array[i][j]);
                }
            }
            console.log('===');
            console.log('===');
            for (var i=0; i < y_array.length; i++) {
                for (var j=0; j < y_array[i].length; j++) {
                    console.log('y_array[' + i + '][' + j + ']: ' + y_array[i][j]);
                }
                console.log('y_array['+i+'].length: ' + y_array[i].length);
            }
            console.log('===');
            var data_length = y_array[0].length;
            console.log('data_length: ' + data_length);
            
            /** domain and range */
            padding = width / x_array.length;
            // set domain
            var xmin = Math.min.apply(Math, x_array[0]);
            var xmax = Math.max.apply(Math, x_array[0]);
            var xScale = d3.scale.linear()
                          .domain([xmin, xmax])
                          .range([0, width-padding]);
            
            /** this is the part that needs to be done separately for each filter */
            for (var cur_field=0; cur_field < data_length; cur_field++) { // fix this TODO
                // set range
                var ymin = Math.min.apply(Math, y_array[cur_field]);
                var ymax = Math.max.apply(Math, y_array[cur_field]); 
                var yScale = d3.scale.linear()
                              .domain([ymin, ymax])
                              .range([0, height])
                
                // build the data
                data = [];
                for (var idx=0; idx < data_length; idx++) {
                    data.push({'x': x_array[cur_field][idx], 'y': y_array[cur_field][idx]});
                }
                
                /* Do the graph */
                // Empty the old graph
                $("#graph").empty();
                //$("#graph").hide();
                
                // Build the plot.
                var y_axis = $.parseJSON($.cookie('filters'))[cur_field];
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
                        return d3.hsl(100 * cur_field, 0.85, d.y / (ymax*2));
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