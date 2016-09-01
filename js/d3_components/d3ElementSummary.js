// d3 component: Element Summary
// this element consists of a donut chart ment to display
// the current usage of a determined resource vs it's quota

var d3 = require('d3');
var d3Complement = require('d3-scale');

var d3ElementSummary = {};

// svgEl parameter must be an SVG element
d3ElementSummary.create = function (svgEl, props, state) {

    var svg = d3.select(svgEl)
    .attr("class","d3")
    .attr("width",props.width)
    .attr("height",props.height);

    return svgEl;
};

// returns color function based on props
d3ElementSummary.color = function (props) {
    if(props.id) {
        return d3Complement.scaleQuantize()
            .domain([props.quota / 2, props.quota / 1.5, props.quota])
            .range(["#ff5573","#f3d54e","#52f3a4"]);
    } else {
        return d3Complement.scaleQuantize()
            .domain([props.quota / 2, props.quota / 1.5, props.quota])
            .range(["#52f3a4","#f3d54e" ,"#ff5573"]);
    }
};

d3ElementSummary.update = function (svgEl, props, state) {

    var svg = d3.select(svgEl);
    var angle = (Math.PI * 2) * (props.value / props.quota);
    var angleFull = (Math.PI * 2);
    var sizeX;
    var complementLabel, title;

    // getting size for quotas
    if (((Math.round(props.value * 100 / props.quota)).toString()).length > 2) {
        sizeX = 35;
    } else {
        sizeX = 25;
    }

    // Getting labels for chart
    if (props.id) {
        complementLabel = " Running";
    } else {
        complementLabel = "";
    }

    // create arc for given data
    var radius = props.width / 2;
    var arc = d3.svg.arc()
        .outerRadius(radius)
        .innerRadius(radius - radius / 6)
        .startAngle(0)
        .endAngle(angle);

    var pie = d3.layout.pie()
        .sort(null)
        .value( (d) => d.value );

    svg.append("circle")
        .attr("cx", props.width/2)
        .attr("cy", props.height/2.5)
        .attr("r", radius)
        .attr("fill", "#ffffff");

    // create arc for shadow
    var arcFull = d3.svg.arc()
        .outerRadius(radius)
        .innerRadius(radius - radius / 6)
        .startAngle(0)
        .endAngle(angleFull);

    var g = svg.selectAll(".arc")
        .data(pie([props]))
        .enter().append("g")
        .attr("transform",
              "translate(" + props.width / 2 + "," + props.height / 2.5 + ")")
        .attr("class","arc") ;

    g.append("path")
        .attr("d", arcFull)
        .style("fill", "#e1e1e1");

    g.append("path")
        .attr("d", arc)
        .style("fill", (d) => this.color(props)(d.value));

    g.append("text")
        .attr("y", 8)
        .attr("class","frm-bold-text")
        .style({"font-size":"2em"})
        .text( function (d) {
            if(!d.value) {
                return "0";
            } else {
                return Math.round(d.value * 100 / props.quota);
            }
        });

    g.append("text")
        .attr("y", -2)
        .attr("x", sizeX)
        .attr("class","frm-bold-text")
        .style({"font-size":"smaller"})
        .text("%");

    g.append("text")
        .attr("y",props.width / 1.5)
        .attr("class","frm-bold-text")
        .text( (d) => props.name);

    g.append("text")
        .attr("y", 15 + props.width / 1.5)
        .style({"fill":"#969696", "font-size":"12px"})
        .text( (d) => {
            return props.value + " of " + props.quota + complementLabel;});

    return svgEl;
};

module.exports = d3ElementSummary;
