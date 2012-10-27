/**
 * Do the hard work of the graphing and such
 */
// Generate some data.
// TODO allow more than one set of y-values on a range of x-values
function get_graph(x_array, y_array) {
    //function f1 (x) {
    //    return Math.pow(2, x);
    //}
    // TODO - use php to get actual values here instead of these stand in values
    //var xmin = -1.0,
    //    xmax = 7,
    //    N = 100,
    //    data = d3.range(xmin, xmax, (xmax - xmin) / N).map(function (d) {
    //        return {x: d, y: f1(d)};
    //    });
    var xmin = Math.min.apply(Math, x_array);
    var xmax = Math.max.apply(Math, x_array);
    var xrange = Math.abs(xmax - xmin);
    
    // Build the plot.
    var plot = xkcdplot();
    plot("#graph");
    
    var data = x_array.map(function (x_val) {
                var index = $.inArray(x_val, x_array);
                return {x: x_val, y: y_array[index]};
            });
    // Add the lines.
    plot.plot(data, {stroke: "green"});
    
    // Render the image.
    plot.xlim([xmin - (xrange / 10), xmax + (xrange / 10)]).draw();
}