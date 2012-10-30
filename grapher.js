/**
 * Do the hard work of the graphing and such
 */

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
    $("#debug").append(debug_string);
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
    var phpurl = "get_graph_data.php";
    var dataString = "summonerName=" + summoner_name + "&x_field=" + x_field + "&y_field=" + y_field;
    $.ajax({
        type: "POST",
        url: phpurl,
        data: dataString,
        success: function(phpdata) {
            $("#debug").append(phpdata + "<br>");
            var data = [];
            var x_array = [];
            var y_array = [];
            
            var pairs = phpdata.split(",");
            for (var i=0; i< pairs.length; i++) {
                var bothvals = pairs[i].split(":");
                var xval = bothvals[0];
                var yval = bothvals[1];
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
            var xrange = Math.abs(xmax - xmin);
            // set range
            var ymin = Math.min.apply(Math, y_array);
            var ymax = Math.max.apply(Math, y_array);
            var yrange = Math.abs(ymax - ymin);
            
            // Build the plot.
            var plot = xkcdplot();
            if (x_field == 'gameId') {
                var x_axis = 'time';
            } else {
                var x_axis = x_field; 
            }
            var y_axis = y_field;
            var title = x_axis + " vs. " + y_axis + " for " + summoner_name;
            plot("#graph", x_axis, y_axis, title);            
            
            // build the data
            for (var i=0; i < x_array.length; i++) {
                data.push({'x': x_array[i], 'y': y_array[i]});
            }
            // print out the data
            var s = "<br>=== data ===";
            for (var i=0; i < data.length; i++) {
                s += "<br>i: " + i + ", x: " + data[i].x + ", y: " + data[i].y;
            }
            $("#debug").append(s);
            
            // Add the lines.
            plot.plot(data, {stroke: "blue"});
            
            // Render the image.
            plot.xlim([xmin - (xrange / 10), xmax + (xrange / 10)])
                .ylim([ymin - (yrange / 10), ymax + (yrange / 10)])
                .draw();
        }
    });
    
}