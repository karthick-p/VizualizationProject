
var width = 500;
var height = 300;
var margin = 50;
var duration = 250;

var lineOpacity = "0.5";
var lineOpacityHover = "1";
var otherLinesOpacityHover = "0.5";
var lineStroke = "1.5px";
var lineStrokeHover = "2.5px";

var circleOpacity = '0.85';
var circleOpacityOnLineHover = "0.25"
var circleRadius = 3;
var circleRadiusHover = 6;


var data = [
    {
        name: "2016",
        values: [
            {month: "01", count: "978"},
            {month: "02", count: "960"},
            {month: "03", count: "948"},
            {month: "04", count: "1001"},
            {month: "05", count: "992"},
            {month: "06", count: "1059"},
            {month: "07", count: "1070"},
            {month: "08", count: "1073"},
            {month: "09", count: "1092"},
            {month: "10", count: "1095"},
            {month: "11", count: "1079"}
        ]
    },
    {
        name: "2017",
        values: [
            {month: "01", count: "932"},
            {month: "02", count: "910"},
            {month: "03", count: "1000"},
            {month: "04", count: "988"},
            {month: "05", count: "967"},
            {month: "06", count: "1067"},
            {month: "07", count: "965"},
            {month: "08", count: "1059"},
            {month: "09", count: "982"},
            {month: "10", count: "1061"},
            {month: "11", count: "987"}
        ]
    },

    {
        name: "2018",
        values: [
            {month: "01", count: "1048"},
            {month: "02", count: "914"},
            {month: "03", count: "1446"},
            {month: "04", count: "945"},
            {month: "05", count: "1092"},
            {month: "06", count: "1013"},
            {month: "07", count: "1145"},
            {month: "08", count: "1028"},
            {month: "09", count: "1055"},
            {month: "10", count: "1076"},
            {month: "11", count: "706"}
        ]
    }


];


data.forEach(function(d) {
    d.values.forEach(function(d) {
        d.month = d.month;
        d.count = +d.count;
    });
});


/* Scale */
var xScale = d3.scaleLinear()
    .domain(d3.extent(data[0].values, d => d.month))
    .range([0, width-margin]);

var yScale = d3.scaleLinear()
    .domain([600, d3.max(data[0].values, d => d.count)])
    .range([height-margin, 0]);


var color = d3.scaleOrdinal()
    .range(["#f24143", "#ff1efd","#5375f2"]);


/* Add SVG */
var svg = d3.select("#chart").append("svg")
    .attr("width", (width+margin)+"px")
    .attr("height", (height+margin)+"px")
    .append('g')
    .attr("transform", `translate(${margin}, ${margin})`);


/* Add line into SVG */
var line = d3.line()
    .x(d => xScale(d.month))
    .y(d => yScale(d.count));

let lines = svg.append('g')
    .attr('class', 'lines');

lines.selectAll('.line-group')
    .data(data).enter()
    .append('g')
    .attr('class', 'line-group')
    .on("mouseover", function(d, i) {
        svg.append("text")
            .attr("class", "title-text")
            .style("fill", color(i))
            .text(d.name)
            .attr("text-anchor", "middle")
            .attr("x", (width-margin)/2)
            .attr("y", 5);
    })
    .on("mouseout", function(d) {
        svg.select(".title-text").remove();
    })
    .append('path')
    .attr('class', 'line')
    .attr('d', d => line(d.values))
    .style('stroke', (d, i) => color(i))
    .style('opacity', lineOpacity)
    .on("mouseover", function(d) {
        d3.selectAll('.line')
            .style('opacity', otherLinesOpacityHover);
        d3.selectAll('.circle')
            .style('opacity', circleOpacityOnLineHover);
        d3.select(this)
            .style('opacity', lineOpacityHover)
            .style("stroke-width", lineStrokeHover)
            .style("cursor", "pointer");
    })
    .on("mouseout", function(d) {
        d3.selectAll(".line")
            .style('opacity', lineOpacity);
        d3.selectAll('.circle')
            .style('opacity', circleOpacity);
        d3.select(this)
            .style("stroke-width", lineStroke)
            .style("cursor", "none");
    });


/* Add circles in the line */
lines.selectAll("circle-group")
    .data(data).enter()
    .append("g")
    .style("fill", (d, i) => color(i))
    .selectAll("circle")
    .data(d => d.values).enter()
    .append("g")
    .attr("class", "circle")
    .on("mouseover", function(d) {
        d3.select(this)
            .style("cursor", "pointer")
            .append("text")
            .attr("class", "text")
            .text(`${d.count}`)
            .attr("x", d => xScale(d.month) + 5)
            .attr("y", d => yScale(d.count) - 10);
    })
    .on("mouseout", function(d) {
        d3.select(this)
            .style("cursor", "none")
            .transition()
            .duration(duration)
            .selectAll(".text").remove();
    })
    .append("circle")
    .attr("cx", d => xScale(d.month))
    .attr("cy", d => yScale(d.count))
    .attr("r", circleRadius)
    .style('opacity', circleOpacity)
    .on("mouseover", function(d) {
        d3.select(this)
            .transition()
            .duration(duration)
            .attr("r", circleRadiusHover);
    })
    .on("mouseout", function(d) {
        d3.select(this)
            .transition()
            .duration(duration)
            .attr("r", circleRadius);
    });


/* Add Axis into SVG */
var xAxis = d3.axisBottom(xScale).ticks(11);
var yAxis = d3.axisLeft(yScale).ticks(11);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${height-margin})`)
    .call(xAxis)
    .append('text')
    .attr("x", width/2)
    .attr("y", 35)
    .attr("fill", "#f24143")
    .text("Months");
;

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append('text')
    .attr("y", -35)
    .attr("transform",  "rotate(-90)")
    .attr("fill", "#f24143")
    .text("Lower Meridion Incident Counts");

