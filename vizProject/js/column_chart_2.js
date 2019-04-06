/*reference code : http://bl.ocks.org/cse4qf/95c335c73af588ce48646ac5125416c6 */


/*creating a column chart function*/
(function columnChart() {


    d3.csv("csv_files/column_chart_fire.csv", function (data) {
        console.log(data)

        var margin = {top: 20, right: 10, bottom: 20, left: 40};
        var marginOverview = {top: 30, right: 10, bottom: 20, left: 40};
        var selectorHeight = 40;
        var width = 600 - margin.left - margin.right;
        var height = 400 - margin.top - margin.bottom - selectorHeight;
        var heightOverview = 80 - marginOverview.top - marginOverview.bottom;

        var maxLength = d3.max(data.map(function (d) {
            return d.label.length
        }))
        var barWidth = maxLength * 7;
        var numBars = Math.round(width / barWidth);
        var scrollenabled = barWidth * data.length > width;

        /*log scroll for verification purpose*/
        console.log(scrollenabled)

        var xscale = d3.scale.ordinal()
            .domain(data.slice(0, numBars).map(function (d) {
                return d.label;
            }))
            .rangeBands([0, width], .5);

        /* Configuring the range of the axis*/

        var yscale = d3.scale.linear()
            .domain([0, 15000])
            .range([height, 0]);

        var xAxis = d3.svg.axis().scale(xscale).orient("bottom");
        var yAxis = d3.svg.axis().scale(yscale).orient("left");

        var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom + selectorHeight);

        var columnChart = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        columnChart.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0, " + height + ")")
            .call(xAxis);

        columnChart.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        var bars = columnChart.append("g");

        bars.selectAll("rect")
            .data(data.slice(0, numBars), function (d) {
                return d.label;
            })
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) {
                return xscale(d.label);
            })
            .attr("y", function (d) {
                return yscale(d.value);
            })
            .attr("width", xscale.rangeBand())
            .attr("height", function (d) {
                return height - yscale(d.value);
            });


        if (scrollenabled) {
            var xOverview = d3.scale.ordinal()
                .domain(data.map(function (d) {
                    return d.label;
                }))
                .rangeBands([0, width], .2);
            ySummary = d3.scale.linear().range([heightOverview, 0]);
            ySummary.domain(yscale.domain());

            var subBars = columnChart.selectAll('.subBar')
                .data(data)

            subBars.enter().append("rect")
                .classed('subBar', true)
                .attr({
                    height: function (d) {
                        return heightOverview - ySummary(d.value);
                    },
                    width: function (d) {
                        return xOverview.rangeBand()
                    },
                    x: function (d) {

                        return xOverview(d.label);
                    },
                    y: function (d) {
                        return height + heightOverview + ySummary(d.value)
                    }
                })

            var displayed = d3.scale.quantize()
                .domain([0, width])
                .range(d3.range(data.length));

            columnChart.append("rect")
                .attr("transform", "translate(0, " + (height + margin.bottom) + ")")
                .attr("class", "mover")
                .attr("x", 0)
                .attr("y", 0)
                .attr("height", selectorHeight)
                .attr("width", Math.round(parseFloat(numBars * width) / data.length))
                .attr("pointer-events", "all")
                .attr("cursor", "ew-resize")
                .call(d3.behavior.drag().on("drag", display));
        }

        function display() {
            var x = parseInt(d3.select(this).attr("x")),
                nx = x + d3.event.dx,
                w = parseInt(d3.select(this).attr("width")),
                f, nf, new_data, rects;

            if (nx < 0 || nx + w > width) return;

            d3.select(this).attr("x", nx);

            f = displayed(x);
            nf = displayed(nx);

            if (f === nf) return;

            new_data = data.slice(nf, nf + numBars);

            xscale.domain(new_data.map(function (d) {
                return d.label;
            }));
            columnChart.select(".x.axis").call(xAxis);

            rects = bars.selectAll("rect")
                .data(new_data, function (d) {
                    return d.label;
                });

            rects.attr("x", function (d) {
                return xscale(d.label);
            });

            rects.enter().append("rect")
                .attr("class", "bar")
                .attr("x", function (d) {
                    return xscale(d.label);
                })
                .attr("y", function (d) {
                    return yscale(d.value);
                })
                .attr("width", xscale.rangeBand())
                .attr("height", function (d) {
                    return height - yscale(d.value);
                });

            rects.exit().remove();
        };
    })
}())