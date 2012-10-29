/**
 * Do the hard work of the graphing and such
 */
function ascending(a,b) {
    return (a-b);
}
function print_arr(arr, arrname) {
    var debug_string = "<br>" + "== " + arrname + " ==";
    for (var i=0; i < arr.length; i++) {
        debug_string += "<br> i: " + i + ", val: " + arr[i];
    }
    debug_string += "<br>======<br><br>";
    $("#debug").append(debug_string);
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
            var orig_x_array = x_array;
            x_array.sort(ascending);
            
            var xmin = Math.min.apply(Math, x_array);
            var xmax = Math.max.apply(Math, x_array);
            var xrange = Math.abs(xmax - xmin);
            
            // Build the plot.
            var plot = xkcdplot();
            var title = x_field + " vs. " + y_field + " for " + summoner_name;
            plot("#graph", x_field, y_field, title);            
            
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
            plot.plot(data, {stroke: "green"});
            
            // Render the image.
            plot.xlim([xmin - (xrange / 10), xmax + (xrange / 10)]).draw();
        }
    });
    
}