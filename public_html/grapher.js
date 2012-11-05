/**
 * Do the hard work of the graphing and such
 */
// constants for graphing - change these up here, do NOT change values and hardcode them down there
var width = 800,
    height = 300,
    xlabel = "default x label",
    ylabel = "default y label",
    padding = 50;
    
// bar graphs
var bar_padding = 1;

/**
 * a function for sort() that will arrange elements in ascending order
 */
function ascending(a,b) {
    return (a-b);
}

/**
 * Prints an array in a standard format to <div id="debug"></div>
 */
function print_arr(arr, arrname) {
    var debug_string = "<br>" + "== " + arrname + " ==";
    for (var i=0; i < arr.length; i++) {
        debug_string += "<br> i: " + i + ", val: " + arr[i];
    }
    debug_string += "<br>======<br><br>";
    //$("#debug").append(debug_string);
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
function get_graph(summoner_name, x_field, y_field) {
    // get the data from x_field and y_field from an ajax post request to phpurl
    $.ajax({
        type: "POST",
        url: "get_graph_data.php",
        data: { summonerName : summoner_name,
                x_field : x_field,
                y_field : y_field },
        success: function(phpdata) {
            //$("#debug").append('phpdata => ' + phpdata);
            //$("#debug").append(phpdata + "<br>");
            var data = phpdata;
            var x_array = [];
            var y_array = [];
            
            for (var i=0; i< data.length; i++) {
                var xval = data.x;
                var yval = data.y;
                x_array.push(xval);
                y_array.push(yval);
            }
            x_array.sort(ascending);
            
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
            // set domain
            var xmin = Math.min.apply(Math, x_array);
            var xmax = Math.max.apply(Math, x_array);
            var xScale = d3.scale.linear()
                          .domain([xmin, xmax])
                          .range([0, width - padding]);
            // set range
            var ymin = Math.min.apply(Math, y_array);
            var ymax = Math.max.apply(Math, y_array); 
            var yScale = d3.scale.linear()
                          .domain([ymin, ymax])
                          .range([height + padding, padding])
            
            // build the data
            for (var i=0; i < x_array.length; i++) {
                data.push({'x': x_array[i], 'y': y_array[i]});
            }
            
            /* Do the graph */
            // Empty the old graph
            $("#graph").empty();
            
            // Build the plot.
            var y_axis = y_field;
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
                    return height - yScale(d.y);
                    })
                .attr("x", function(d, i) {
                    return xScale(d.x);
                    })
                .attr("y", function(d) {
                    return yScale(d.y);
                    })
                .attr("fill", function(d) {
                    return d3.hsl(249, 0.85, d.y / (ymax*2));
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
                    return yScale(d.y) + 15;
                });
        }
    });
    
}