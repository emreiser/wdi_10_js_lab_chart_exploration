window.onload = function() {

  // Set fixed height and width variables that will be used to append svg element
  var width = 960,
      height = 500;

  // Creates a new empty 'map' collection - alternative to an array
  var rateById = d3.map();

  // Defines a function "quantize" that takes a number between 0 and .15
  // and categorizes it in one of 9 'bins' based on closest value
  // The function will return a string representing the given bin, ie. "q1-9"
  var quantize = d3.scale.quantize()
      .domain([0, .15]) // Min and max data values based on TSV file
      .range(d3.range(11).map(function(i) { return "q" + i + "-9"; }));
      // Creates 9 different 'bins' within that domain

  // Defines function path
  var path = d3.geo.path();

  // Append svg element to DOM
  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);

  // Load up external data in order and do not proceed until complete
  queue()
      // Import us.json data
      .defer(d3.json, "us.json")
      // Iterate through tsv doc and populate collection rateById with id and rate of each element
      .defer(d3.tsv, "unemployment.tsv", function(d) { rateById.set(d.id, +d.rate); })
      .await(ready);

  function ready(error, us) {
    debugger
    // Append a single 'g' element as a container with class 'counties'
    svg.append("g")
        .attr("class", "counties")

      // Bind data to path elements (not yet on page)
      .selectAll("path")
        // Load feature collection for US counties (3213 elements)
        .data(topojson.feature(us, us.objects.counties).features)

      // For each county element in collection, append a path element
      .enter().append("path")

        // Get county id from each element in counties collection
        // Use the id to lookup corresponding unemployment rate in rateById collection
        // Pass unemployment rate quantize function
        // and apply a class of the of the 'bin' name returned by quantize
        .attr("class", function(d) { return quantize(rateById.get(d.id)); })
        // Set "d" attribute to the string returned by path function
        // called implicitly on 'd'
        .attr("d", path);


    // Iterate through US states collection and append a path for each state
    // Apply class "states" to each path object
    // Set "d" attribute of the state path to the state's d string (returned by path function)
    svg.append("path")
        .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
        .attr("class", "states")
        .attr("d", path);
  }

};