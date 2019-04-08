
/* Heat maps for observing time series dataset*/
(function heatMapChart() {

    const margin = { top: 50, right: 0, bottom: 100, left: 0 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        gridSize = width / 36,
        legendElementWidth = gridSize*2,

        /*Configured colors for the range of values*/
        colors = ["#fffafa","#f8e1e7","#e9d6d0","#cd9797","#c4948c","#c07874","#a85d58","#943639","#581315"],
        months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug","Sep","Oct","Nov","Dec"],
        times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p"];
    datasets = ["csv_files/data_2016.csv","csv_files/data_2017.csv","csv_files/data_2018.csv"];

    const svg = d3.select("#heatMapChart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.selectAll()
        .data(months)
        .enter().append("text")
        .text(function (d) { return d; })
        .attr("x", 0)
        .attr("y", (d, i) => i * gridSize)
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
    svg.selectAll()
        .data(times)
        .enter().append("text")
        .text((d) => d)
        .attr("x", (d, i) => i * gridSize)
        .attr("y", 0)
        .style("text-anchor", "middle")
        .attr("transform", "translate(" + gridSize / 2 + ", -6)")

    const type = (d) => {
        return {
            month: +d.month,
            hour: +d.hour,
            value: +d.value
        };
    };

    const heatmapChart = function(csvFile) {
        d3.csv(csvFile, type, (error, data) => {
            const colorScale = d3.scaleQuantile()
                .domain([0, 8, d3.max(data, (d) => d.value)])
                .range(colors);

            const cards = svg.selectAll(".hour")
                .data(data, (d) => d.month+':'+d.hour);

            cards.append("title");

            cards.enter().append("rect")
                .attr("x", (d) => (d.hour - 1) * gridSize)
                .attr("y", (d) => (d.month - 1) * gridSize)
                .attr("rx", 3)
                .attr("ry", 3)
                .attr("class", "hour bordered")
                .attr("width", gridSize)
                .attr("height", gridSize)
                .style("fill", colors[0])
                .merge(cards)
                .transition()
                .duration(1000)
                .style("fill", (d) => colorScale(d.value));

            cards.select("title").text((d) => d.value);

            cards.exit().remove();

            const legend = svg.selectAll(".legend")
                .data([0].concat(colorScale.quantiles()), (d) => d);

            const legend_g = legend.enter().append("g")
                .attr("class", "legend");

            legend_g.append("rect")
                .attr("x", (d, i) => legendElementWidth * i)
                .attr("y", height)
                .attr("width", legendElementWidth)
                .attr("height", gridSize / 2)
                .style("fill", (d, i) => colors[i]);

            legend_g.append("text")
                .attr("class", "schema")
                .text((d) => "≥ " + Math.round(d))
                .attr("x", (d, i) => legendElementWidth * i)
                .attr("y", height + gridSize);

            legend.exit().remove();
        });
    };

    heatmapChart(datasets[0]);

    /* number pattern for the extraction of name*/
    const numberPattern = /\d+/g;

    /*button grid to switch over the dataset*/
    const buttonGrid = d3.select("#button_grid")
        .selectAll(".dataset-button")
        .data(datasets);

    /* used bootstrap buttons*/
    buttonGrid.enter()
        .append("input")
        .attr("value", (d) => "Year " + d.match(numberPattern))
        .attr("type","button")
        .attr("class", "btn btn-primary")
        .style("margin-right", "2em")
        .on("click", (d) => heatmapChart(d));
}())
/*reference code : http://bl.ocks.org/tjdecke/5558084 */
