
/* Created stacked bar chart function*/
(function stackedBarChart() {

    var chart2 = d3.select("#barChart");
    var svg = chart2.attr("width", 800)
            .attr("height", 200),
        margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom - 10,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var y = d3.scaleBand()
        .rangeRound([0, height])
        .paddingInner(0.29)
        .align(0.1);

    var x = d3.scaleLinear()
        .rangeRound([0, width]);

    var z = d3.scaleOrdinal()
        .range(["#e9cfcf", "#aa93f2","#96d96f"]);

    d3.csv("csv_files/incidentCounts_Year.csv", function (d, i, columns) {
        for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
        d.total = t;
        return d;
    }, function (error, data) {
        if (error) throw error;
        var keys = data.columns.slice(1);


        y.domain(data.map(function (d) {
            return d.year;
        }));					// x.domain...
        x.domain([0, d3.max(data, function (d) {
            return d.total;
        })]).nice();	// y.domain...
        z.domain(keys);
        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + (height) + ")")
            .call(d3.axisBottom(x)).style("stroke", "#f2685f");

        g.append("g")
            .attr("class", "stackAxis")
            .attr("transform", "translate(0,0)")
            .call(d3.axisLeft(y)).style("stroke", "#f2685f")
            .attr("font-family", "sans-serif")
            .attr("font-size", "12px")
            .append("text")
            .attr("y", 2)
            .attr("x", x(x.ticks().pop()) + 0.5)
            .attr("dy", "0.32em")
            .attr("fill", "#6ed8e2")
            .attr("text-anchor", "start")
            .text("Total Incidents")
            .attr("transform", "translate("+ (- width/2)+ "," + (height+30) + ")")

        g.append("g")
            .selectAll("g")
            .data(d3.stack().keys(keys)(data))
            .enter().append("g")
            .attr("fill", function (d) {
                return z(d.key);
            })
            .selectAll("rect")
            .data(function (d) {
                return d;
            })
            .enter().append("rect")


            .attr("y", function (d) {
                return y(d.data.year);
            })
            .attr("x", function (d) {
                return  x(d[0]);
            })
            .attr("width", function (d) {
                return x(d[1]) - x(d[0]);
            })
            .attr("height", y.bandwidth())


            .attr("x", function(d) { return  x(d[0]); })
            .attr("width", function(d) { return x(d[1]) - x(d[0]) })



            .on("mouseover", function() { tooltip.style("display", null); })
            .on("mouseout", function() { tooltip.style("display", "none"); })
            .on("mousemove", function(d) {
                var xPosition = d3.mouse(this)[0] - 15;
                var yPosition = d3.mouse(this)[1] - 15;
                tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                tooltip.select("text").text(("Traffic:"+ d.data.Traffic + ",Fire:"+ d.data.Fire + ",EMS:"+ d.data.EMS))});

        var legend = g.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(keys.slice().reverse())
            .enter().append("g")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", width - 19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", z);

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function(d) { return d; });

        var tooltip = svg.append("g")
            .attr("class", "tooltip")
            .style("display", "none");

        tooltip.append("rect")
            .attr("width", 220)
            .attr("height", 20)
            .attr("fill", "#D2E9E9")
            .style("opacity", 0.9);

        tooltip.append("text")
            .attr("x", 15)
            .attr("dy", "1.2em")
            .style("text-anchor", "left")
            .attr("font-size", "12px")
            .attr("font-weight", "bold");

    });

}())
//reference : http://bl.ocks.org/mstanaland/6100713

