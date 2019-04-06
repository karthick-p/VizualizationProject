var margin = { top: 50, right: 0, bottom: 100, left: 30 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    gridSize = width / 36,
    legendElementWidth = gridSize*2,
    colors = ["#fffafa","#f8e1e7","#e9d6d0","#cd9797","#c4948c","#c07874","#a85d58","#943639","#581315"],
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug","Sep","Oct","Nov","Dec"],
    times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p"];
datasets = ["../csv_files/data_2016.csv","../csv_files/data_2017.csv","../csv_files/data_2018.csv"];

var svg = d3.select("#heatMapChart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.selectAll(".dayLabel")
    .data(months)
    .enter().append("text")
    .text(function (d) { return d; })
    .attr("x", 0)
    .attr("y", function (d, i) { return i * gridSize; })
    .style("text-anchor", "end")
    .style('font-size', '0.8em')
    .attr("transform", "translate(-6," + gridSize / 1.5 + ")")

svg.selectAll(".timeLabel")
    .data(times)
    .enter().append("text")
    .text(function(d) { return d; })
    .attr("x", function(d, i) { return i * gridSize; })
    .attr("y", 0)
    .style("text-anchor", "middle")
    .style('font-size', '0.8em')
    .attr("transform", "translate(" + gridSize / 2 + ", -6)");

var heatmapChart = function(csvFile) {
    d3.csv(csvFile,
        function(d) {
            return {
                month: +d.month,
                hour: +d.hour,
                value: +d.value
            };
        },
        function(error, data) {
            var colorScale = d3.scale.quantile()
                .domain([0, 8, d3.max(data, function (d) { return d.value; })])
                .range(colors);

            var cards = svg.selectAll(".hour")
                .data(data, function(d) {return d.month+':'+d.hour;});

            cards.append("title");

            cards.enter().append("rect")
                .attr("x", function(d) { return (d.hour - 1) * gridSize; })
                .attr("y", function(d) { return (d.month - 1) * gridSize; })
                .attr("rx", 1)
                .attr("ry", 1)
                .attr("class", "hour bordered")
                .attr("width", gridSize)
                .attr("height", gridSize)
                .style("fill", colors[0]);

            cards.transition().duration(1000)
                .style("fill", function(d) { return colorScale(d.value); });

            cards.select("title").text(function(d) { return d.value; });

            cards.exit().remove();

            var legend = svg.selectAll(".legend")
                .data([0].concat(colorScale.quantiles()), function(d) { return d; });

            legend.enter().append("g")
                .attr("class", "legend");

            legend.append("rect")
                .attr("x", function(d, i) { return legendElementWidth * i; })
                .attr("y", height)
                .attr("width", legendElementWidth)
                .attr("height", gridSize / 2)
                .style("fill", function(d, i) { return colors[i]; });

            legend.append("text")
                .attr("class", "mono")
                .text(function(d) { return "≥ " + Math.round(d); })
                .attr("x", function(d, i) { return legendElementWidth * i; })
                .attr("y", height + gridSize);

            legend.exit().remove();

        });
};

heatmapChart(datasets[0]);



var numberPattern = /\d+/g;

var button = d3.select("#button_grid").selectAll()
    .data(datasets);

var buttonColor = ["#70ff75","#5375f2", "#f23034"]
button.enter()
    .append("input")
    .attr("value", function(d){ return "Dataset " + d.match(numberPattern) })
    .attr("type", "button")
    .attr("class", "btn btn-secondary dropdown-toggle")
    .attr("data-toggle","dropdown")
    .style("margin-right", "2em")
    .style("backgroundcolor", function (i) { return buttonColor[i];
        console.log(i)
    })
    .on("click", function(d) {
        heatmapChart(d);
    });