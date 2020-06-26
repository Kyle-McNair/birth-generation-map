function whole(){
var main = d3.select("body");
var scrolly = main.select("#scrolly");
var figure = scrolly.select("figure");
var article = scrolly.select("article");
var stepper = article.selectAll(".stepper");
const scroller = scrollama();
const stickyscroller = scrollama()
var map, chart1, albers, City, urbanArea, height, width;
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
        debug: false,
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
    City = data[1]
    bg_sh = data[2]
    urban = data[3]
    
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
        debug: false,
        offset: 0.85
    })
    .onStepEnter(updateMap)
} 
function updateMap(response){
    map.selectAll(".proportional")
    .remove()
    d3.select(".infolabel") //remove the htlm tag.
    .remove();

    var index = response.index
    console.log(index)
    
        var colors = ["#FFFF00","#7b3393","#7b3393","#c2a5cf","#c2a5cf","#d2eadb","#d2eadb","#a7d5a0","#a7d5a0","#078844","#078844","blank","blank","#c2a5cf","#a7d5a0"];
        var list = ["blank","SG_2010","SG_2018","BB_2010","BB_2018","GZ_2010","GZ_2018","ML_2010","ML_2018","GZ_2010","GZ_2018","blank","blank","BB_ch","ML_ch"]

        var totals = [];
        for (var i in City.features) {
            var r1 = City.features[i].properties.SG_2010
            var r2 = City.features[i].properties.BB_2010
            var r3 = City.features[i].properties.GX_2010
            var r4 = City.features[i].properties.ML_2010
            var r5 = City.features[i].properties.GZ_2010
            totals.push(Number(r1))
            totals.push(Number(r2))
            totals.push(Number(r3))
            totals.push(Number(r4))
            totals.push(Number(r5))
        }
        var minRadius = 1

        var min = Math.min.apply(Math, totals);
        var max = Math.max.apply(Math, totals);
        console.log(urbanArea)
    if(index == 0){
        map.selectAll(".map")
        .data(City.features)
        .enter()
        .append("circle")
        .sort(function(a, b){
            //this function sorts from highest to lowest values
            return b.properties[list[index]] - a.properties[list[index]]
            })
        .style("fill", colors[index])
        .style("fill-opacity", 0.5)
        .attr("class", function(d){
            return "proportional "+d.properties.Join; })
        .attr("cx", function(d){return albers(d.geometry.coordinates)[0]})
        .attr("cy", function(d){return albers(d.geometry.coordinates)[1]})
        .transition()
        .duration(750)
        .attr("r", "1.5")

        map.selectAll(".map")
        .data(City.features)
        .enter()
        .append("circle")
        .sort(function(a, b){
            //this function sorts from highest to lowest values
            return b.properties[list[index]] - a.properties[list[index]]
            })
        .style("fill", colors[index])
        .style("fill-opacity", 0.4)
        .attr("class", function(d){
            return "proportional "+d.properties.Join; })
        .attr("cx", function(d){return albers(d.geometry.coordinates)[0]})
        .attr("cy", function(d){return albers(d.geometry.coordinates)[1]})
        .transition()
        .duration(750)
        .attr("r", "3")
        

    }

    if(index < 12 && index > 0){
        var radius = d3.scaleSqrt()
            .domain([1, max])
            .range([1, 20*(width/700)]);
        
       map.selectAll('.map')
            .data(City.features)
            .enter()
            .append("circle")
            .sort(function(a, b){
                //this function sorts from highest to lowest values
                return b.properties[list[index]] - a.properties[list[index]]
                })
            .style("fill", colors[index])
            .style("fill-opacity", 1)
            .style("stroke","black")
            .style("stroke-width",0.5) 
            .attr("class", function(d){
                return "proportional "+d.properties.Join; })
            .on("mouseover", function(d){
                console.log("hover")
                highlight(d.properties,d.properties[list[index]]);})
            .on("mouseout", function(d){
                dehighlight(d.properties)
            })
             .on("mousemove", moveLabel)
            .attr("cx", function(d){return albers(d.geometry.coordinates)[0]})
            .attr("cy", function(d){return albers(d.geometry.coordinates)[1]})
            .transition()
            .duration(750)
            .attr("r", function(d){return radius(d.properties[list[index]])})
            
            map.selectAll('circle')
            .append("desc")
            .text('{"fill":'+'"'+ colors[index]+'"'+',"stroke-width": "0.5"}');
    } 
    else if(index > 12){
        var min = Math.min.apply(Math, totals);
        var max = Math.max.apply(Math, totals);
 
        var radius = d3.scaleSqrt()
            .domain([1, max])
            .range([1, 20*(width/700)]);


        map.selectAll('.map')
            .data(City.features)
            .enter()
            .append("circle")
            .sort(function(a, b){
                //this function sorts from highest to lowest values
                return b.properties[list[index]] - a.properties[list[index]]
                })
            .attr("class", function(d){
                return "proportional "+d.properties.Urban_Areas; })
            .style("fill", colors[index])
            .style("fill-opacity", 1)
            .style("stroke","black")
            .style("stroke-width",0.5) 
            .style("z-index", "99999")
            .attr("class", function(d){
                return "proportional "+d.properties.Join; })
            .on("mouseover", function(d){
                console.log("hover")
                highlight(d.properties,d.properties[list[index]]);})
            .on("mouseout", function(d){
                dehighlight(d.properties)
            })
            .on("mousemove", moveLabel)
            .attr("cx", function(d){return albers(d.geometry.coordinates)[0]})
            .attr("cy", function(d){return albers(d.geometry.coordinates)[1]})
            .transition()
            .duration(750)
            .attr("r", function(d){
                if(d.properties[list[index]] > 0){
                return radius(d.properties[list[index]])}})

            map.selectAll('circle')
            .append("desc")
            .text('{"fill":'+'"'+ colors[index]+'"'+',"stroke-width": "0.5"}');
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
function highlight(props, actual){
    //change stroke
    var selected = d3.selectAll("." + props.Join )//if the mouse is hovered over an element with .Neighborhood name, the charts and map will highlight that unit.
        .style("fill", "#6E6E6E") //color and stroke width
        .style("stroke-width", "2");
    setLabel(props, actual)//html element will popup if hovered over a unit.
};
function dehighlight(props){
    var selected = d3.selectAll("." + props.Join) //same condition as highlight, but if the mouse is not hovered over.
        .style("fill", function(){
            return getStyle(this, "fill") //getStyle is a function inside this function to restore original styles.
        })
        .style("stroke-width", function(){
            return getStyle(this, "stroke-width")
        });
    function getStyle(element, styleName){
        var styleText = d3.select(element)
            .select("desc") //the desc finds the same as the element to go back to original style.
            .text();

        var styleObject = JSON.parse(styleText);

        return styleObject[styleName];
    };
    d3.select(".infolabel") //remove the htlm tag.
        .remove();
};
function setLabel(props, actual){
    //label content
    var labelAttribute

    //percent is the label for attributes with percentages
    var urban = "<h1>Urban Area: " + props.Urban_Area +
        "</h1><br>Population: " + d3.format(",")(actual)

    labelAttribute = urban

    var infolabel = d3.select("figure.sticky")
        .append("div")
        .attr("class", "infolabel")//.inforlabel for css
        .attr("id", props.Join + "_label") //this attribute is based on the selected attribute.
        .html(labelAttribute); //.html calls up the html tag

};
function moveLabel(){
    //get width of labels
    var labelWidth = d3.select(".infolabel")
        .node()
        .getBoundingClientRect()//studies screen real estate.
        .width;

    //use coordinates of mousemove event to set label coordinates
    var x1 = d3.event.clientX + 10, //determines the html placement depending where the mouse moves.
        y1 = d3.event.clientY - 60,
        x2 = d3.event.clientX - labelWidth - 10,
        y2 = d3.event.clientY + 15;

    //x for the horizontal, avoids overlap
    var x = d3.event.clientX > window.innerWidth - labelWidth - 20 ? x2 : x1; 
    //y for the horizontal, avoids overlap
    var y = d3.event.clientY < 75 ? y2 : y1; 

    d3.select(".infolabel") //the infolabel html will now adjust based on mouse location
        .style("left", x + "px")
        .style("top", y + "px");
};
init()
}

$(document).ready(whole);