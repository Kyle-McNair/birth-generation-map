function whole(){
var main = d3.select("body");
var scrolly = main.select("#scrolly");
var figure = scrolly.select("figure");
var article = scrolly.select("article");
var stepper = article.selectAll(".stepper");
const scroller = scrollama();
const stickyscroller = scrollama()
var map, albers, msa2018, height, width;
console.log(map)
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
height = screen.height*0.9,
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

console.log(map)
albers = d3.geoAlbers()
    .scale(width)
    .translate([width / 2, height / 2]);

    //call in the projection
var path = d3.geoPath()
    .projection(albers);

    //use Promise.all to parallelize asynchronous data loading
var promises = [];

promises.push(d3.json("data/topos/states.topojson"));
promises.push(d3.json("data/msa_2018_geojson.json"));
    //list of promises goes and has the callback function be called
Promise.all(promises).then(callback);
    
function callback(data){
    states = data[0]
    msa2018 = data[1]
    console.log(msa2018)
    var country = topojson.feature(states, states.objects.states);
    console.log(map)
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
    var colors = ["#7b3393","#c2a5cf","#d2eadb","#a7d5a0","#078844"];
    var gen = ["SilentG","BabyBoomer","GenX","Millennials","GenZ"];
    var density = ["SilentG_Density","BabyBoomers_Density","GenX_Density","Millennials_Density","GenZ_Density"]

    var index = response.index
    var totals = [];
    for (var i in msa2018.features) {
        var r1 = msa2018.features[i].properties.SilentG_Density
        var r2 = msa2018.features[i].properties.BabyBoomers_Density
        var r3 = msa2018.features[i].properties.GenX_Density
        var r4 = msa2018.features[i].properties.Millennials_Density
        var r5 = msa2018.features[i].properties.GenZ_Density
        totals.push(Number(r1))
        totals.push(Number(r2))
        totals.push(Number(r3))
        totals.push(Number(r4))
        totals.push(Number(r5))
    }
    
    var minRadius = 0.25
        
    var min = Math.min.apply(Math, totals);
    var max = Math.max.apply(Math, totals);
    console.log(max)
    var radius = d3.scaleSqrt()
        .domain([min, max])
        .range([1, 15*(width/700)]);

    map
    .selectAll('.map')
    .data(msa2018.features)
    .enter()
    .append("circle")
        .attr("class","proportional")
        .attr("cx", function(d){return albers(d.geometry.coordinates)[0]})
        .attr("cy", function(d){return albers(d.geometry.coordinates)[1]})
        .transition()
        .duration(750)
            .attr("r", function(d){return 1.0083 * Math.pow(d.properties[density[index]]/min,0.5715) * minRadius})
        .attr("fill", colors[index])
        .attr("fill-opacity", 0.6)
        .attr("stroke", colors[index])
        .attr("stroke-width", 0.2);
    
}
init()
}
$(document).ready(whole);