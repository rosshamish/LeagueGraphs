  /**
 * Makes two pie charts in #pie.
 *     the chart on the LEFT represents the frequency with which each champ is played.
 *     the chart on the RIGHT represents the total wins with each champ.
 *  @param {Array} freq_arr freq_arr[i].label is the champ name, freq_arr[i].value is the games played
 *  @param {Array} wins_arr wins_arr[i].label is the champ name, wins_arr[i].value is the relative winrate
 */
function getPie(freq_arr, wins_arr) {
    
  r = getGraphWidth() / 7,   //radius
  color = d3.scale.category20c();     //builtin range of colors
  
  /**
   * Champ Frequency
   *     games with champ x / total games played
   */  
  var vis = d3.select("#pie svg")            //create the SVG element inside the <body>
      .data([freq_arr])
      .append("svg:g") //make a group to hold our pie chart
          .attr('id', 'champ_freq') 
          .attr("transform", "translate(" + r + "," + r*8/7 + ")")    //move the center of the pie chart from 0, 0 to radius, radius

  var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
      .outerRadius(r);
  
  var pie = d3.layout.pie()           //this will create arc data for us given a list of values
      .value(function(d) { return d.value; });    //we must tell it out to access the value of each element in our data array
  
  var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
      .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
      .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
          .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
              .attr("class", "slice");    //allow us to style things in the slices (like text)
  
  arcs.append("svg:path")
          .attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
          .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function

  arcs.append("svg:text")                                     //add a label to each slice
          .attr("transform", function(d) {                    //set the label's origin to the center of the arc
          //we have to make sure to set these before calling arc.centroid
          d.innerRadius = 0;
          d.outerRadius = r;
          return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
      })
      .attr("text-anchor", "middle")                          //center the text on it's origin
      .text(function(d, i) {
        var arcangle = Math.abs(d.endAngle - d.startAngle);
        if (arcangle > 0.15) {
            ret = freq_arr[i].label;
        } else {
            ret = '';
        }
        return ret;
        });        //get the label from our original data array
      
  /**
   * Champ Total Wins
   *     wins with champ x / total wins overall
  **/
  /*
  var vis = d3.select("#pie svg")            //create the SVG element inside the <body>
      .data([wins_arr])
      .append("svg:g") //make a group to hold our pie chart
          .attr('id', 'champ_freq') 
          .attr("transform", "translate(" + r*4 + "," + r + ")")    //move the center of the pie chart from 0, 0 to radius, radius

  var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
      .outerRadius(r);
  
  var pie = d3.layout.pie()           //this will create arc data for us given a list of values
      .value(function(d) { return d.value; });    //we must tell it out to access the value of each element in our data array
  
  var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
      .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
      .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
          .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
              .attr("class", "slice");    //allow us to style things in the slices (like text)
  
  arcs.append("svg:path")
          .attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
          .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function

  arcs.append("svg:text")                                     //add a label to each slice
          .attr("transform", function(d) {                    //set the label's origin to the center of the arc
          //we have to make sure to set these before calling arc.centroid
          d.innerRadius = 0;
          d.outerRadius = r;
          return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
      })
      .attr("text-anchor", "middle")                          //center the text on it's origin
      .text(function(d, i) { return wins_arr[i].label; });        //get the label from our original data array
      
  */
}