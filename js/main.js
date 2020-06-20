
setMap()
const scroller = scrollama();
const stickyscroller = scrollama()
function handleStepEnter(response){
    if(response.direction === 'down'){
        response.element.style.opacity = 1
    }
    else if(response.direction === 'up'){
        response.element.style.opacity = 0
    }
}
function handleStickyEnter(response){
    console.log(response)
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
    var main = d3.select("body");
    var scrolly = main.select("#scrolly");
    var figure = scrolly.select("figure");
    var article = scrolly.select("article");
    var stepper = article.selectAll(".stepper");
    setupStickyfill();
stickyscroller
    .setup({
        step: '#scrolly article .stepper',
        debug: true,
        offset: 0.33
    })
    .onStepEnter(handleStickyEnter)
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
init();
// load proportional symbol map //
function setMap(){
    var height = screen.height,
    width = screen.width;

    //create new svg container for the map
    var map = d3.select(".prop-map")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("width", "100%")
        .attr("height", "100%")
        .style("position","absolute");

    //create Albers equal area conic projection centered on Chicago
    var albers = d3.geoAlbers()
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

        var country = topojson.feature(states, states.objects.states);
        // var msa_2018 = topojson.feature(msa2018, msa2018.objects.msa_2018_geojson)
        
        console.log(country)
        console.log(msa2018)
        var states_US = map.append("path")
            //calls the stateRegions from above
            .datum(country)
            //states class used to change color in css
            .attr("class", "states")
            .attr("d", path)
            .attr("stroke", "#FFFFFF")
            .attr("stroke-width", "0.25px")
            .attr("fill", "#111111")
            .transition()
                .duration(2500)
                .ease(d3.easeLinear);


        var totals = [];
        for (var i in msa2018.features) {
            var ratio = msa2018.features[i].properties.Millennials_Density;
            totals.push(Number(ratio));
        }
        
        var min = Math.min.apply(Math, totals);
        var max = Math.max.apply(Math, totals);

        console.log(min, max)
        var radius = d3.scaleSqrt()
            .domain([0, max])
            .range([1, 10*(width/700)]);


        var props = map.append("g")
            .attr("class","proportionalSymbols")
            .selectAll(".proportional")
            .data(msa2018.features)
            .enter()
            .append("circle")
                .attr("class","proportional")
                .attr("cx", function(d){return albers(d.geometry.coordinates)[0]})
                .attr("cy", function(d){return albers(d.geometry.coordinates)[1]})
                .attr("r", function(d){return radius(d.properties.Millennials_Density)})
                .attr("fill", "#a7d5a0")
                .attr("fill-opacity", 0.6)
                .attr("stroke", "#a7d5a0")
                .attr("stroke-width", 0.2);
 
    }
}