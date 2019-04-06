/* reference code : https://bl.ocks.org/alokkshukla/3d6be4be0ef9f6977ec6718b2916d168*/

/*creating a bubble chart function*/
(function bubbleChart() {

    /* Reading the json file generated*/
d3.json("csv_files/bubble.json",function(data) {

    var  dataset = data;
    var diameter = 600;

    /*Configuration for the bubble colors*/
    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var bubble = d3.pack()
        .size([diameter, diameter])
        .padding(1.5);

    var svg = d3.select("#bubbleChart")
        .append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .attr("class", "bubble");

    var nodes = d3.hierarchy(dataset)
        .sum(function(d) { return d.Count; });

    var node = svg.selectAll(".node")
        .data(bubble(nodes).descendants())
        .enter()
        .filter(function(d){
            return  !d.children
        })
        .append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

    node.append("title")
        .text(function(d) {
            return d.Name + ": " + d.Count;
        });

    /* Creating circle*/
    node.append("circle")
        .attr("r", function(d) {
            return d.r;
        })
        .style("fill", function(d,i) {
            return color(i);
        });

    /* pushing the text and number of records in the centre of the circle*/
    node.append("text")
        .attr("dy", ".2em")
        .style("text-anchor", "middle")
        .text(function(d) {
            return d.data.Name.substring(0, d.r / 3);
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", function(d){
            return d.r/5;
        })
        .attr("fill", "white");

    node.append("text")
        .attr("dy", "1.3em")
        .style("text-anchor", "middle")
        .text(function(d) {
            return d.data.Count;
        })
        .attr("font-family",  "Gill Sans", "Gill Sans MT")
        .attr("font-size", function(d){
            return d.r/5;
        })
        .attr("fill", "white");

});

}())
