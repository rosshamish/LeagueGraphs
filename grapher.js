/**
 * Do the hard work of the graphing and such
 */
// Generate some data.
// TODO allow more than one set of y-values on a range of x-values
function get_graph(summoner_name, x_field, y_field) {
    // get the data from x_field and y_field from an ajax post request to phpurl
    var phpurl = "get_graph_data.php";
    var dataString = "summonerName=" + summoner_name + "&x_field=" + x_field + "&y_field=" + y_field;
    $.ajax({
        type: "POST",
        url: phpurl,
        data: dataString,
        success: function(phpdata) {
            
            var x_array = new Array();
            var y_array = new Array();
            var assoc = new Object();
            
            var pairs = phpdata.split(",");
            for (var i=0; i< pairs.length; i++) {
                var bothvals = pairs[i].split(":");
                var x = bothvals[0];
                var y = bothvals[1];
                assoc[x] = y;
                x_array.push(x);
            }
            x_array.sort(function(a,b) {return (a-b);});
            for (var i=0; i < x_array.length; i++) {
                y_array.push(assoc[x_array[i]]);
            }

            var xmin = Math.min.apply(Math, x_array);
            var xmax = Math.max.apply(Math, x_array);
            var xrange = Math.abs(xmax - xmin);
            
            // Build the plot.
            var plot = xkcdplot();
            plot("#graph", "New x label", "New y label", "Fancy Title");
            
            var data = x_array.map(function (x_val) {
                        var index = $.inArray(x_val, x_array);
                        return {x: x_val, y: y_array[index]};
                    });
            // Add the lines.
            plot.plot(data, {stroke: "green"});
            
            // Render the image.
            plot.xlim([xmin - (xrange / 10), xmax + (xrange / 10)]).draw();
        }
    });
    
}