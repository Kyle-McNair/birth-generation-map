function whole(){
var main = d3.select("body");
var scrolly = main.select("#scrolly");
var figure = scrolly.select("figure");
var article = scrolly.select("article");
var stepper = article.selectAll(".stepper");
const scroller = scrollama();
const stickyscroller = scrollama()
var map, chart1, albers, msa2010, msa2018, height, width;
function handleStepEnter(response){
    if(response.direction === 'down'){
        response.element.style.opacity = 1
    }
    else if(response.direction === 'up'){
        response.element.style.opacity = 0
    }
}

function handleStepExit(response){
    if(response.direction === 'up'){
        response.element.style.opacity = 0
    }
    else{
        response.element.style.opacity = 1
    }
}
function setupStickyfill() {
    d3.selectAll(".sticky").each(function() {
      Stickyfill.add(this);
    });
  }

function init(){

scroller
    .setup({
        step: '.step',
        debug: true,
        offset: 0.5,
    })
    .onStepEnter(handleStepEnter)
    .onStepExit(handleStepExit);
    window.addEventListener("resize", scroller.resize);
}

// load proportional symbol map //
height = screen.height*0.95,
width = screen.width;

 //create new svg container for the map
map = d3.select("figure.prop-map")
    .append("svg")
    .attr("class","map")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("width", "100%")
    .attr("height", "100%")
        // .style("position","absolute");

// prop = map.append("g")
//     .attr("opacity",1)

albers = d3.geoAlbers()
    .scale(width)
    .translate([width / 2, height / 2]);

    //call in the projection
var path = d3.geoPath()
    .projection(albers);

    //use Promise.all to parallelize asynchronous data loading
var promises = [];

promises.push(d3.json("data/topos/states.topojson"));
promises.push(d3.json("data/UA_TopCities.geojson"));
promises.push(d3.json("data/bg_share.json"))
    //list of promises goes and has the callback function be called
Promise.all(promises).then(callback);
    
function callback(data){
    states = data[0]
    msa2010 = data[1]
    bg_sh = data[2]
    
    setChart1(bg_sh)

    var country = topojson.feature(states, states.objects.states);

    var states_US = map.append("path")
        .datum(country)
        .attr("class", "states")
        .attr("d", path)
        .attr("stroke", "#FFFFFF")
        .attr("stroke-width", "0.25px")
        .attr("fill", "#111111");
    
    setupStickyfill();
    stickyscroller
    .setup({
        step: '#scrolly article .stepper',
        debug: true,
        offset: 0.85
    })
    .onStepEnter(updatePropSymbols)

} 
function updatePropSymbols(response){
    map.selectAll(".proportional")
    .remove()
    var index = response.index
    console.log(index)
    
        var colors = ["#7b3393","#7b3393","#c2a5cf","#c2a5cf","#d2eadb","#d2eadb","#a7d5a0","#a7d5a0","#078844","#078844","blank","blank","#c2a5cf","#a7d5a0"];
        var list = ["SG_2010","SG_2018","BB_2010","BB_2018","GZ_2010","GZ_2018","ML_2010","ML_2018","GZ_2010","GZ_2018","blank","blank","BB_ch","ML_ch"]
    
        
        console.log(min, max)
        

    if(index < 10){
        var totals = [];
        for (var i in msa2010.features) {
            var r1 = msa2010.features[i].properties.SG_2010
            var r2 = msa2010.features[i].properties.BB_2010
            var r3 = msa2010.features[i].properties.GX_2010
            var r4 = msa2010.features[i].properties.ML_2010
            var r5 = msa2010.features[i].properties.GZ_2010
            totals.push(Number(r1))
            totals.push(Number(r2))
            totals.push(Number(r3))
            totals.push(Number(r4))
            totals.push(Number(r5))
        }
        var minRadius = 1

        var min = Math.min.apply(Math, totals);
        var max = Math.max.apply(Math, totals);

        var radius = d3.scaleSqrt()
            .domain([min, max])
            .range([1, 15*(width/700)]);

        map.selectAll('.map')
            .data(msa2010.features)
            .enter()
            .append("circle")
            .attr("class","proportional")
            .attr("cx", function(d){return albers(d.geometry.coordinates)[0]})
            .attr("cy", function(d){return albers(d.geometry.coordinates)[1]})
            .transition()
            .duration(750)
                .attr("r", function(d){return radius(d.properties[list[index]])})
            .attr("fill", colors[index])
            .attr("fill-opacity", 0.6)
            .attr("stroke", colors[index])
            .attr("stroke-width", 0.2);
    } 
    else if(index > 11){
        var totals = [];
        for (var i in msa2010.features) {
            var r1 = msa2010.features[i].properties.BB_ch
            var r2 = msa2010.features[i].properties.ML_ch
            // var r3 = msa2010.features[i].properties.SG_ch
            // var r4 = msa2010.features[i].properties.GX_ch
            // var r5 = msa2010.features[i].properties.GZ_ch
            totals.push(Number(r1))
            totals.push(Number(r2))
            // totals.push(Number(r3))
            // totals.push(Number(r4))
            // totals.push(Number(r5))
        }
        var minRadius = 1

        var min = Math.min.apply(Math, totals);
        var max = Math.max.apply(Math, totals);
        
        var radius = d3.scaleSqrt()
        .domain([1, max])
        .range([1, 15*(width/700)]);

        map.selectAll('.map')
            .data(msa2010.features)
            .enter()
            .append("circle")
            .attr("class","proportional")
            .attr("cx", function(d){return albers(d.geometry.coordinates)[0]})
            .attr("cy", function(d){return albers(d.geometry.coordinates)[1]})
            .transition()
            .duration(750)
                .attr("r", function(d){return radius(d.properties[list[index]])})
            .attr("fill", colors[index])
            .attr("fill-opacity", 0.6)
            .attr("stroke", colors[index])
            .attr("stroke-width", 0.2);
            // {return 1.0083 * Math.pow(d.properties[list[index]]/min,0.5715) * minRadius})
    }
}
function setChart1(bg_sh){
    var margin = {top: 15, right: 5, bottom: 100, left: 45},
    
    leftPadding = 5,
    rightPadding = 5,
    topBottomPadding = 20,
    chartWidth = window.innerWidth * 0.65,
    chartHeight = window.innerHeight*0.5,

    translate = "translate(" + leftPadding + "," + topBottomPadding + ")";

    for(var i in bg_sh){
        console.log(bg_sh[i])
    }

    var yTick = (d => d *100 + "%")
    
    var y = d3.scaleLinear()
        .range([chartHeight, 0])
        .domain([0,0.4])
        
        
    var x = d3.scaleBand()
        .range([0, chartWidth])
        .domain(bg_sh.map(function(d) { return d.Generation; }))
        .padding(0.25);

    

    chart1 = d3.select("#chart1")
        .append("svg")
        .attr("class","chart1")
        .attr("width", chartWidth + margin.left + margin.right)
        .attr("height", chartHeight + margin.top + margin.bottom)
        .append("g")
        .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");


    var bars = chart1.selectAll(".bar")
        .data(bg_sh)
        .enter()
        .append("g")
    bars.append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.Generation); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.Value)})
        .attr("height", function(d){return chartHeight - y(d.Value)})
        .style("fill",function(d){
            return d.Color
        })
        .text(function(d){return 100*d.Value})
    bars.append("text")
        .attr("class","label")
        .attr("x", function (d) {return x(d.Generation) + x.bandwidth()/2})
        .attr("y", function(d) { return y(d.Value) - 10; })
        .text(function(d){return  d3.format(",.1%")(d.Value)})
        .attr("text-anchor","middle")

        

    var yAxis = d3.axisLeft()
        .tickFormat(yTick)
        .scale(y)

    var xAxis = d3.axisBottom()
        .scale(x)
    
    chart1.append("g")
        .attr("class", "axis") //.axis is for css
        .call(yAxis)
        
    chart1.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(1," + chartHeight + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("class","xLabels")
        .attr("transform", "translate(-10,10)rotate(-45)")
        .style("text-anchor", "end");
}

init()
}

$(document).ready(whole);