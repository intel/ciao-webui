// d3 component: LineChart Detail
// this element consists of a linechart that will be filled
// with the current "diagnostic" of an object

var d3 = require('d3');

var d3LineChartDetail = {};

var lineChart = function (svgEl, bundle, state) {
    this.svgEl = svgEl;
    this.props = bundle.props;
    this.state = state;

    this.width = (bundle.dimensions.width)?
        bundle.dimensions.width: this.props.width;
    this.height = (bundle.dimensions.height)?
        bundle.dimensions.height: this.props.height;

    this.margin = {top: 10,
                  right: this.width * 0.05,
                  bottom: 0,
                  left: this.width * 0.1};

    var from = state.timeFrom;
    var to = state.timeTo;

    this.computeData = this.props.data.filter((d) => {
        return (from.getTime() <= d.x.getTime())
            &&
            (to.getTime() >= d.x.getTime());
    });

    // setup multipliers for height and width
    this.hmult = bundle.hmult;
    this.wmult = bundle.wmult;

    this.computeX = this.x();
    this.computeY = this.y();

    //set domain based on the data
    this.updateDomain();

};

lineChart.prototype.y = function (mult) {
    var h = (mult != undefined) ? this.height * mult: this.height * this.hmult;
    return d3.scale.linear()
        .range([h,0]);
};

lineChart.prototype.x = function (mult) {
    var w = (mult != undefined) ? this.width * mult: this.width * this.wmult;
    return d3.time.scale()
        .range([0, w - this.margin.left - this.margin.right]);
};

lineChart.prototype.setState = function (state) {
    this.state = state;
    var from = state.timeFrom;
    var to = state.timeTo;
        this.computeData = this.props.data.filter((d) => {
        return (from.getTime() <= d.x.getTime())
            &&
            (to.getTime() >= d.x.getTime());
    });

    this.updateDomain();
};

lineChart.prototype.updateDomain  = function () {

    this.computeX
        // .domain(d3.extent(this.computeData, function(d) {
        //     return d.x;}));
        .domain([
            this.state.timeFrom,this.state.timeTo
        ]);

    // var timeFrom = this.state.timeFrom;
    // var timeTo = this.state.timeTo;

    this.computeY
        .domain(d3.extent(this.computeData, function(d) {
            return d.y;}));

    // this bends Y domain
    // this.computeY
    //     .domain(d3.extent(this.props.data, function(d) {
    //         if((d.x.getTime() >= timeFrom.getTime()) &&
    //            (d.x.getTime() <= timeTo.getTime())) {
    //         return d.y;
    //         }
    //     }));

    //re-compute line, x and y axis functions
    this.line = d3.svg.line()
        .x((d) => this.computeX(d.x))
        .y((d) => this.computeY(d.y));

    this.xAxis = d3.svg.axis()
        .scale(this.computeX)
        .orient("bottom")
        .ticks(5)
        .tickFormat(d3.time.format("%d/%m/%Y"));

    this.yAxis = d3.svg.axis()
        .scale(this.computeY)
        .orient("left");
};

lineChart.prototype.setData = function (data) {
    this.props.data = data;
    this.updateDomain();
};

lineChart.prototype.render = function () {
    //remove all childs of parent node for new drawing
    d3.select(this.svgEl).selectAll("*").remove();

    // select parent and create a canvas to add all components on the chart
    var svg = d3.select(this.svgEl)
        .attr("class", "d3")
        .attr("width", this.width)
        .attr("height",this. height)
        .append("g")
        .attr("transform", "translate(" +
              this.margin.left + "," +
              this.margin.top + ")");


    // Draw line passing data and using the line function
    svg.append("path")
        .datum(this.computeData)
        .attr("class", "line data-line")
        .attr("d", this.line);
        //.attr("transform", "translate(-100,0)");

    // Axis drawing
    //draw xAxis
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + (this.height*this.hmult) + ")")
      .call(this.xAxis);

    //select all individual xAxis text
    svg.selectAll(".x-axis text")
        .attr("transform", "translate(0,15)rotate(-20)");

    svg.append("g")
        .attr("class", "y-axis")
        .call(this.yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("");

    return this.svgEl;
};
// svgEl parameter must be an SVG element
d3LineChartDetail.create = function (svgEl, bundle, state) {

    //Note:multiplier might come in bundle
    bundle.wmult = 0.8;
    bundle.hmult = 0.8;
    var chart = new lineChart(svgEl, bundle, state);

    return chart;
};


module.exports = d3LineChartDetail;
