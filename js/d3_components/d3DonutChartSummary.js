// d3 component: Node Summary by State
// this element consists of a donut chart ment to display
// the total nodes by current state
var d3 = require('d3');

var d3NodeElementSummary = {};

// svgEl parameter must be an SVG element
d3NodeElementSummary.create = function (svgEl, props, state) {

    var svg = d3.select(svgEl)
    .attr("class","d3")
    .attr("width",props.width)
    .attr("height",props.height);

    return svgEl;
};

d3NodeElementSummary.update = function (svgEl, props, state) {

    var elements = [];
    var totalNodes = 0;
    var totalsBySection = props.sections.map(function (data){
        if (data.name === "total_nodes") {
            totalNodes = data.number;
        } else {
            if (data.number!==0) {
                elements.push(
                    {label:data.name,
                    value:data.number}
                );
                console.log("data",elements);
            }
        }
    });

    var color = d3.scale.ordinal()
        .range(['#2BD899','#FF5573', '#E1E1E1', '#F3D54E']);

    var svg = d3.select(svgEl);

    // create arc for given data
    var radius = props.width / 2;
    var arc = d3.svg.arc()
        .outerRadius(radius)
        .innerRadius(radius - radius / 6);

    var pie = d3.layout.pie()
        .sort(null)
        .value( function (d){ return d.value; });

    svg.append("circle")
        .attr("cx", props.width/2)
        .attr("cy", props.height/2.5)
        .attr("r", radius)
        .attr("fill", "#ffffff");

    var g = svg.selectAll(".arc")
        .data(pie(elements))
        .enter()
        .append("g")
        .attr("transform",
              "translate(" + props.width / 2 + "," + props.height / 2.5 + ")")
        .attr("class","arc");

    g.append("path")
        .attr("d", arc)
        .attr('fill', (d) => color(d.data.label));

    g.append("text")
        .attr("y", -3)
        .attr("class","frm-bold-text")
        .style({"font-size":"3em"})
        .text(totalNodes);

    g.append("text")
        .attr("y", 20)
        .style({"fill":"#969696", "font-size":"1.5em"})
        .text("Total Nodes");

    return svgEl;
};

module.exports = d3NodeElementSummary;
