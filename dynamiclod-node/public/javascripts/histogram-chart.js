var makeHistogram = function (data) {

        data.forEach(function (d) {
             d.value = parseInt(d.value);
        });

        var margin = { top: 20, right: 10, bottom: 20, left: 40 },
    selectorHeight = 20
  width = 400 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom - selectorHeight,
  barWidth = 45;

        var numBars = Math.round(width / barWidth);

        var xscale = d3.scale.ordinal()
                .domain(data.slice(0, numBars).map(function (d) { return d.label; }))
                .rangeBands([0, width]),
    yscale = d3.scale.linear()
      .domain([0, d3.max(data, function (d) { return d.value; })])
      .range([height, 0]);

        var xAxis = d3.svg.axis().scale(xscale).orient("bottom"),
    yAxis = d3.svg.axis().scale(yscale).orient("left");

        var svg = d3.select("#histogram").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom + selectorHeight);

        var diagram = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        diagram.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0, " + height + ")")
                .call(xAxis);

        diagram.append("g")
                .attr("class", "y axis")
                .call(yAxis);

        var bars = diagram.append("g");

        bars.selectAll("rect")
    .data(data.slice(0, numBars), function (d) { return d.label; })
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function (d) { return xscale(d.label); })
    .attr("y", function (d) { return yscale(d.value); })
    .attr("width", xscale.rangeBand())
    .attr("height", function (d) { return height - yscale(d.value); });

        var displayed = d3.scale.quantize()
    .domain([0, width])
    .range(d3.range(data.length));

        diagram.append("rect")
    .attr("transform", "translate(0, " + (height + margin.bottom) + ")")
    .attr("class", "mover")
    .attr("x", 0)
    .attr("y", 0)
    .attr("height", selectorHeight)
    .attr("width", Math.round(parseFloat(numBars * width) / data.length))
    .attr("pointer-events", "all")
    .attr("cursor", "ew-resize")
    .call(d3.behavior.drag().on("drag", display));

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

    xscale.domain(new_data.map(function (d) { return d.label; }));
    diagram.select(".x.axis").call(xAxis);

    rects = bars.selectAll("rect")
      .data(new_data, function (d) { return d.label; });

    rects.attr("x", function (d) { return xscale(d.label); });

    rects.enter().append("rect")
      .attr("class", "bar")
      .attr("x", function (d) { return xscale(d.label); })
      .attr("y", function (d) { return yscale(d.value); })
      .attr("width", xscale.rangeBand())
      .attr("height", function (d) { return height - yscale(d.value); });

    rects.exit().remove();
        };
};