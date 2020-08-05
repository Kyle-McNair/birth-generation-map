function whole(){
var main = d3.select("body");
var scrolly = main.select("#scrolly");
var figure = scrolly.select("figure");
var article = scrolly.select("article");
var stepper = article.selectAll(".stepper");
const scroller = scrollama();
const stickyMapscroller = scrollama();
const stickyNatChartscroller = scrollama();
const stickyStateChartscroller = scrollama();
const staticScatter = scrollama();
var map, chart1, albers, City, city_object, BB_Cities, ML_Cities, height, width, statebars, state_data;

var figure = document.getElementById('scatterplot')
figure.style.height = screen.height - 60

function handleStepEnter(response){
    if(response.direction === 'down'){
        response.element.style.opacity = 1
    }
    else if(response.direction === 'up'){
        response.element.style.opacity = 0
    }
}
function handleStaticEnter(response){
    if(response.index == 1){
        d3.select(".randomDots")
            .remove();
        scatterplot()
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
        offset: 0.45,
    })
    .onStepEnter(handleStepEnter)
    .onStepExit(handleStepExit);
    window.addEventListener("resize", scroller.resize);

staticScatter
    .setup({
        step: '#scatter article .scatterStep',
        debug: false,
        offset: 0.85
    })
    .onStepEnter(handleStaticEnter)
}

// load proportional symbol map //
height = screen.height*0.9,
width = screen.width;

albers = d3.geoAlbers()
    .scale(width)
    .translate([width / 2, height / 2]);

//create new svg container for the map
map = d3.select("figure.prop-map")
    .append("svg")
    .attr("class","map")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("width", "100%")
    .attr("height", "100%")


//call in the projection
var path = d3.geoPath()
    .projection(albers);

//use Promise.all to parallelize asynchronous data loading
var promises = [];

promises.push(d3.json("data/topos/states_generalized.topojson"));
promises.push(d3.json("data/UA_Top_Cities.geojson"));
promises.push(d3.json("data/bg_share.json"))
promises.push(d3.json("data/state_data.json"))
promises.push(d3.json("data/cities.json"))
promises.push(d3.json("data/BB_Top_Cities.geojson"))
promises.push(d3.json("data/ML_Top_Cities.geojson"))
//list of promises goes and has the callback function be called
Promise.all(promises).then(callback);
    
function callback(data){
    states = data[0]
    City = data[1]
    bg_sh = data[2]
    state_data = data[3]
    city_object = data[4]
    BB_Cities = data[5]
    ML_Cities = data[6]
    

    setNationalChart(bg_sh)
    setStateChart(state_data)

    var country = topojson.feature(states, states.objects.states);

    var states_US = map.append("path")
        .datum(country)
        .attr("class", "states")
        .attr("d", path)
        .attr("stroke", "#FFFFFF")
        .attr("stroke-width", "0.15px")
        .attr("fill", "#111111");
    if(window.innerWidth < 576){
        informUser()
    }
    setupStickyfill();
    stickyMapscroller
        .setup({
            step: '#mapScrolly article .mapStepper',
            debug: false,
            offset: 0.85
        })
        .onStepEnter(updateMap)

    stickyNatChartscroller
        .setup({
            step: '#natScrolly article .natStepper',
            debug: false,
            offset: 0.8
        })

    stickyStateChartscroller
        .setup({
            step: '#stateScrolly article .stateStepper',
            debug: false,
            offset: 0.8
        }).onStepEnter(stateInputs)
} 
function updateMap(response){
    map.selectAll(".proportional")
    .remove()
    map.selectAll('.pulse')
    .remove()
    d3.select(".infolabel") //remove the htlm tag.
    .remove();
    d3.selectAll(".propLegend").remove();
    

    var index = response.index
    
    var colors = ["#FFFF00","#722e94","#722e94","#b97cca","#b16a24","#86bf87","#23632f","blank","blank","#FFFF00","#FFFF00","#FFFF00","#FFFF00","#b97cca","#b97cca","#b16a24","#86bf87","#86bf87","#23632f","#23632f",'#FFFF00'];
    var list = ["blank","SG_2018","SG_2018","BB_2018","GX_2018","ML_2018","GZ_2018","blank","blank","blank","blank","blank","blank","BB_ch","BB_ch","GX_ch","ML_ch","ML_ch",'GZ_ch','GZ_ch','blank']

    var totals = [];
    for (var i in City.features) {
            var r1 = City.features[i].properties.SG_2018
            var r2 = City.features[i].properties.BB_2018
            var r3 = City.features[i].properties.GX_2018
            var r4 = City.features[i].properties.ML_2018
            var r5 = City.features[i].properties.GZ_2018
            totals.push(Number(r1))
            totals.push(Number(r2))
            totals.push(Number(r3))
            totals.push(Number(r4))
            totals.push(Number(r5))
        }
    var minRadius = 1

    var min = Math.min.apply(Math, totals);
    var max = Math.max.apply(Math, totals);
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
        .delay(function(d,i){ return 20*i; }) 
        .duration(100)
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
        .delay(function(d,i){ return 25*i; }) 
        .duration(100)
        .attr("r", "3")
        

    }
    else if(index < 7 && index > 0){
        createLegend()
        var radius = d3.scaleSqrt()
            .domain([1, max])
            .range([1, 20*(width/700)]);
        
        map.selectAll('circle')
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
                highlight(d.properties,d.properties[list[index]],index);})
            .on("mouseout", function(d){
                dehighlight(d.properties)
            })
             .on("mousemove", moveLabel)
            .attr("cx", function(d){return albers(d.geometry.coordinates)[0]})
            .attr("cy", function(d){return albers(d.geometry.coordinates)[1]})
            .attr("r", function(d){return radius(d.properties[list[index]])})
            
            
            
            map.selectAll('circle')
            .append("desc")
            .text('{"fill":'+'"'+ colors[index]+'"'+',"stroke-width": "0.5"}');
    } 
    else if(index == 9){
        
        createLegend()
        var min = Math.min.apply(Math, totals);
        var max = Math.max.apply(Math, totals);
 
        var radius = d3.scaleSqrt()
            .domain([1, max])
            .range([2, 20*(width/700)]);
            
        map.selectAll(".map")
        .data(City.features)
        .enter()
        .append("circle")
        .sort(function(a, b){
            //this function sorts from highest to lowest values
            return (b.properties.GZ_ch + b.properties.ML_ch + b.properties.GX_ch + b.properties.BB_ch + b.properties.SG_ch) - (a.properties.GZ_ch + a.properties.ML_ch + a.properties.GX_ch + a.properties.BB_ch + a.properties.SG_ch)
            })
        .style("fill", colors[index])
        .style("fill-opacity", 1)
        .style("stroke","black")
            .style("stroke-width",0.5)
        .attr("class", function(d){
            return "proportional "+d.properties.Join; })
        .on("mouseover", function(d){
            highlight(d.properties,(d.properties.GZ_ch + d.properties.ML_ch + d.properties.GX_ch + d.properties.BB_ch + d.properties.SG_ch),index);})
        .on("mouseout", function(d){
            dehighlight(d.properties)
        })
        .on("mousemove", moveLabel)
        .attr("cx", function(d){return albers(d.geometry.coordinates)[0]})
        .attr("cy", function(d){return albers(d.geometry.coordinates)[1]})
        .transition()
        .delay(function(d,i){ return 10*i; }) 
        .duration(500)
        .attr("r", function(d){
            if((d.properties.GZ_ch + d.properties.ML_ch + d.properties.GX_ch + d.properties.BB_ch + d.properties.SG_ch) > 0){
            return radius((d.properties.GZ_ch + d.properties.ML_ch + d.properties.GX_ch + d.properties.BB_ch + d.properties.SG_ch))}})

        map.selectAll('circle')
        .append("desc")
        .text('{"fill":'+'"'+ colors[index]+'"'+',"stroke-width": "0.5"}');
    }
    else if(index == 10){
        
        createLegend()
        var min = Math.min.apply(Math, totals);
        var max = Math.max.apply(Math, totals);
 
        var radius = d3.scaleSqrt()
            .domain([1, max])
            .range([2, 20*(width/700)]);
            
        map.selectAll(".map")
        .data(City.features)
        .enter()
        .append("circle")
        .sort(function(a, b){
            //this function sorts from highest to lowest values
            return (b.properties.GZ_ch + b.properties.ML_ch + b.properties.GX_ch + b.properties.BB_ch + b.properties.SG_ch) - (a.properties.GZ_ch + a.properties.ML_ch + a.properties.GX_ch + a.properties.BB_ch + a.properties.SG_ch)
            })
        .style("fill", colors[index])
        .style("fill-opacity", 1)
        .style("stroke","black")
            .style("stroke-width",0.5)
        .attr("class", function(d){
            return "proportional "+d.properties.Join; })
        .on("mouseover", function(d){
            highlight(d.properties,(d.properties.GZ_ch + d.properties.ML_ch + d.properties.GX_ch + d.properties.BB_ch + d.properties.SG_ch),index);})
        .on("mouseout", function(d){
            dehighlight(d.properties)
        })
        .on("mousemove", moveLabel)
        .attr("cx", function(d){return albers(d.geometry.coordinates)[0]})
        .attr("cy", function(d){return albers(d.geometry.coordinates)[1]})
        .attr("r", function(d){
            if((d.properties.GZ_ch + d.properties.ML_ch + d.properties.GX_ch + d.properties.BB_ch + d.properties.SG_ch) > 0){
            return radius((d.properties.GZ_ch + d.properties.ML_ch + d.properties.GX_ch + d.properties.BB_ch + d.properties.SG_ch))}})

        map.selectAll('circle')
        .append("desc")
        .text('{"fill":'+'"'+ colors[index]+'"'+',"stroke-width": "0.5"}');
    }
    else if(index > 10 && index < 13){
        
        createLegend()
        var min = Math.min.apply(Math, totals);
        var max = Math.max.apply(Math, totals);
 
        var radius = d3.scaleSqrt()
            .domain([1, max])
            .range([2, 20*(width/700)]);
            
        map.selectAll(".map")
        .data(City.features)
        .enter()
        .append("circle")
        .sort(function(a, b){
            //this function sorts from highest to lowest values
            return (b.properties.GZ_ch + b.properties.ML_ch + b.properties.GX_ch + b.properties.BB_ch + b.properties.SG_ch) - (a.properties.GZ_ch + a.properties.ML_ch + a.properties.GX_ch + a.properties.BB_ch + a.properties.SG_ch)
            })
        .style("fill", colors[index])
        .style("fill-opacity", 1)
        .style("stroke","black")
            .style("stroke-width",0.5)
        .attr("class", function(d){
            return "proportional "+d.properties.Join; })
        .attr("cx", function(d){return albers(d.geometry.coordinates)[0]})
        .attr("cy", function(d){return albers(d.geometry.coordinates)[1]})
        .attr("r", function(d){
            if((d.properties.GZ_ch + d.properties.ML_ch + d.properties.GX_ch + d.properties.BB_ch + d.properties.SG_ch) > 0){
            return radius((d.properties.GZ_ch + d.properties.ML_ch + d.properties.GX_ch + d.properties.BB_ch + d.properties.SG_ch))}})

    }
    else if(index == 13){
        createLegend()
        var min = Math.min.apply(Math, totals);
        var max = Math.max.apply(Math, totals);
 
        var radius = d3.scaleSqrt()
            .domain([1, max])
            .range([2, 20*(width/700)]);


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
                highlight(d.properties,d.properties[list[index]],index);})
            .on("mouseout", function(d){
                dehighlight(d.properties)
            })
            .on("mousemove", moveChartlessLabel)
            .attr("cx", function(d){return albers(d.geometry.coordinates)[0]})
            .attr("cy", function(d){return albers(d.geometry.coordinates)[1]})
            .transition()
            .delay(function(d,i){ return 50*i; }) 
            .duration(750)
            .attr("r", function(d){
                if(d.properties[list[index]] > 0){
                return radius(d.properties[list[index]])}})

            map.selectAll('circle')
            .append("desc")
            .text('{"fill":'+'"'+ colors[index]+'"'+',"stroke-width": "0.5"}');
    }
    else if(index == 14){
        createLegend()
        var min = Math.min.apply(Math, totals);
        var max = Math.max.apply(Math, totals);
 
        var radius = d3.scaleSqrt()
            .domain([1, max])
            .range([2, 20*(width/700)]);
        
        map.selectAll('.map')
            .data(BB_Cities.features)
            .enter()
            .append("circle")
            .attr("class","pulse")
            .style("stroke", "#c994c7")
            .style("z-index", "99999")
            .attr("cx", function(d){return albers(d.geometry.coordinates)[0]})
            .attr("cy", function(d){return albers(d.geometry.coordinates)[1]})
            .attr("r", function(d){
                if(d.properties[list[index]] > 0){
                return radius(d.properties[list[index]])}})
        
        var pulseCircles = map.selectAll('.pulse')
        pulse(pulseCircles);

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
                highlight(d.properties,d.properties[list[index]],index);})
            .on("mouseout", function(d){
                dehighlight(d.properties)
            })
            .on("mousemove", moveChartlessLabel)
            .attr("cx", function(d){return albers(d.geometry.coordinates)[0]})
            .attr("cy", function(d){return albers(d.geometry.coordinates)[1]})
            .attr("r", function(d){
                if(d.properties[list[index]] > 0){
                return radius(d.properties[list[index]])}})
            map.selectAll('circle')
            .append("desc")
            .text('{"fill":'+'"'+ colors[index]+'"'+',"stroke-width": "0.5"}');
    }
    else if(index == 15){
        createLegend()
        var min = Math.min.apply(Math, totals);
        var max = Math.max.apply(Math, totals);
 
        var radius = d3.scaleSqrt()
            .domain([1, max])
            .range([2, 20*(width/700)]);

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
                highlight(d.properties,d.properties[list[index]],index);})
            .on("mouseout", function(d){
                dehighlight(d.properties)
            })
            .on("mousemove", moveChartlessLabel)
            .attr("cx", function(d){return albers(d.geometry.coordinates)[0]})
            .attr("cy", function(d){return albers(d.geometry.coordinates)[1]})
            .transition()
            .delay(function(d,i){ return 50*i; })
            .duration(750)
            .attr("r", function(d){
                if(d.properties[list[index]] > 0){
                return radius(d.properties[list[index]])}})
            map.selectAll('circle')
            .append("desc")
            .text('{"fill":'+'"'+ colors[index]+'"'+',"stroke-width": "0.5"}');
    }
    else if(index == 16){
        createLegend()
        var min = Math.min.apply(Math, totals);
        var max = Math.max.apply(Math, totals);
 
        var radius = d3.scaleSqrt()
            .domain([1, max])
            .range([2, 20*(width/700)]);

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
                highlight(d.properties,d.properties[list[index]],index);})
            .on("mouseout", function(d){
                dehighlight(d.properties)
            })
            .on("mousemove", moveChartlessLabel)
            .attr("cx", function(d){return albers(d.geometry.coordinates)[0]})
            .attr("cy", function(d){return albers(d.geometry.coordinates)[1]})
            .transition()
            .delay(function(d,i){ return 30*i; })
            .duration(750)
            .attr("r", function(d){
                if(d.properties[list[index]] > 0){
                return radius(d.properties[list[index]])}})
            map.selectAll('circle')
            .append("desc")
            .text('{"fill":'+'"'+ colors[index]+'"'+',"stroke-width": "0.5"}');
    }
    else if(index == 17){
        createLegend()
        var min = Math.min.apply(Math, totals);
        var max = Math.max.apply(Math, totals);
 
        var radius = d3.scaleSqrt()
            .domain([1, max])
            .range([2, 20*(width/700)]);
        
        map.selectAll('.map')
            .data(ML_Cities.features)
            .enter()
            .append("circle")
            .attr("class","pulse")
            .style("stroke", "#86bf87")
            .style("z-index", "99999")
            .attr("cx", function(d){return albers(d.geometry.coordinates)[0]})
            .attr("cy", function(d){return albers(d.geometry.coordinates)[1]})
            .attr("r", function(d){
                if(d.properties[list[index]] > 0){
                return radius(d.properties[list[index]])}})
        
        var pulseCircles = map.selectAll('.pulse')
        pulse(pulseCircles);

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
                highlight(d.properties,d.properties[list[index]],index);})
            .on("mouseout", function(d){
                dehighlight(d.properties)
            })
            .on("mousemove", moveChartlessLabel)
            .attr("cx", function(d){return albers(d.geometry.coordinates)[0]})
            .attr("cy", function(d){return albers(d.geometry.coordinates)[1]})
            .attr("r", function(d){
                if(d.properties[list[index]] > 0){
                return radius(d.properties[list[index]])}})
            map.selectAll('circle')
            .append("desc")
            .text('{"fill":'+'"'+ colors[index]+'"'+',"stroke-width": "0.5"}');
    }
    else if(index == 18){
        createLegend()
        var min = Math.min.apply(Math, totals);
        var max = Math.max.apply(Math, totals);
 
        var radius = d3.scaleSqrt()
            .domain([1, max])
            .range([2, 20*(width/700)]);

        map.selectAll(".map")
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
            highlight(d.properties,d.properties[list[index]],index);})
        .on("mouseout", function(d){
            dehighlight(d.properties)
        })
        .on("mousemove", moveChartlessLabel)
        .attr("cx", function(d){return albers(d.geometry.coordinates)[0]})
        .attr("cy", function(d){return albers(d.geometry.coordinates)[1]})
        .transition()
        .delay(function(d,i){ return 15*i; })
        .duration(750)
        .attr("r", function(d){
            if(d.properties[list[index]] > 0){
            return radius(d.properties[list[index]])}})
        map.selectAll('circle')
        .append("desc")
        .text('{"fill":'+'"'+ colors[index]+'"'+',"stroke-width": "0.5"}');
    }
    else if(index == 19){
        createLegend()
        var min = Math.min.apply(Math, totals);
        var max = Math.max.apply(Math, totals);
 
        var radius = d3.scaleSqrt()
            .domain([1, max])
            .range([2, 20*(width/700)]);

        map.selectAll(".map")
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
            highlight(d.properties,d.properties[list[index]],index);})
        .on("mouseout", function(d){
            dehighlight(d.properties)
        })
        .on("mousemove", moveChartlessLabel)
        .attr("cx", function(d){return albers(d.geometry.coordinates)[0]})
        .attr("cy", function(d){return albers(d.geometry.coordinates)[1]})
        .attr("r", function(d){
            if(d.properties[list[index]] > 0){
            return radius(d.properties[list[index]])}})
        map.selectAll('circle')
        .append("desc")
        .text('{"fill":'+'"'+ colors[index]+'"'+',"stroke-width": "0.5"}');
    }
    else if(index == 20){
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
        .delay(function(d,i){ return 20*i; }) 
        .duration(100)
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
        .delay(function(d,i){ return 25*i; }) 
        .duration(100)
        .attr("r", "3")
        

    }
    function pulse(pulseCircles) {
        (function repeat() {
        pulseCircles
            .transition()
            .duration(500)
            .attr("stroke-width", 0)
            .attr('stroke-opacity', 0)
            .transition()
            .duration(500)
            .attr("stroke-width", 0)
            .attr('stroke-opacity', 0.45)
            .transition()
            .duration(1000)
            .attr("stroke-width", 50)
            .attr('stroke-opacity', 0)
            .ease(d3.easePolyInOut)
            .on("end", repeat);
        })();
    }
    d3.selectAll(".inform").raise()   
    d3.selectAll(".informText").raise()
}
function createLegend(){
    if(window.innerWidth < 576){
        return
    }
    var totals = [];
        for (var i in City.features) {
            var r1 = City.features[i].properties.SG_2018
            var r2 = City.features[i].properties.BB_2018
            var r3 = City.features[i].properties.GX_2018
            var r4 = City.features[i].properties.ML_2018
            var r5 = City.features[i].properties.GZ_2018
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
        .domain([1, max])
        .range([1, 20*(width/700)]);

    var LegendValues = [50000,500000,1000000]

    var LegendRange = radius.range()[1]*width/700
        console.log(LegendRange)
    var legend =  d3.select(".legend")
        .style("width", LegendRange + 100 +"px")
        .style("height", LegendRange +"px");

    var lHeight = $(".legend").height();
    var lWidth = $(".legend").width();
    console.log(lHeight, lWidth)

    var circles = legend.append("svg")
        .attr("class","propLegend")
        .attr("height",LegendRange+100)
        .attr("width","100%")
        .attr("transform","translate(40,0)")
        .style("top", "0px")
        .style("left", "0px");

    var propCircles = circles.selectAll(".legendCircles")
        .data(LegendValues)
        .enter()
        .append("circle")
        .attr("cx",LegendRange/2)
        .attr("cy", function(d){
            return LegendRange - radius(d) - 10
        })
        .attr("r", function(d){
            return radius(d)
        })
        .attr("fill","none")
        .attr("stroke","white")
        .attr("stroke-width","0.5")
    
    var lines = circles.selectAll(".propLines")
        .data(LegendValues)
        .enter()
        .append("line")
        .attr("x1", LegendRange/2)
        .attr("x2", LegendRange - 10)
        .attr("y1", function(d){ 
            return LegendRange - (radius(d)*2)-10})
        .attr("y2", function(d){ 
            return LegendRange - (radius(d)*2)-10})
        .attr("stroke","white")
        .attr("stroke-width","0.5")
    
    var legendLabels = circles.selectAll(".legendLabels")
        .data(LegendValues)
        .enter()
        .append("text")
        .attr("class", "legendShadow")
        .text(function(d){
            return d3.format(",")(d)})
        .attr("x", function(d){
            if(d == 50000){
                return(LegendRange-8)}
             
            if(d == 500000){
                return(LegendRange-15)
            }
            return LegendRange-27})
        .attr("y",function(d){
            if(d ==1000000){
                return LegendRange-(radius(d)*2)-14
            }
            if(d ==500000){
                return LegendRange-(radius(d)*2)-9
            }
            return LegendRange - (radius(d)*2)-10
        })
        .attr('alignment-baseline', 'middle')

    legendLabels = circles.selectAll(".legendLabels")
        .data(LegendValues)
        .enter()
        .append("text")
        .attr("class","propLabels")
        .text(function(d){
            return d3.format(",")(d)})
        .attr("x", function(d){
            if(d == 50000){
                return(LegendRange-8)}
             
            if(d == 500000){
                return(LegendRange-15)
            }
            return LegendRange-27})
        .attr("y",function(d){
            if(d ==1000000){
                return LegendRange-(radius(d)*2)-14
            }
            if(d ==500000){
                return LegendRange-(radius(d)*2)-9
            }
            return LegendRange - (radius(d)*2)-10
        })
        .attr('alignment-baseline', 'middle')
    
    var legendTitle = legend.selectAll('.propLegend')
        .append("text")
        .attr("class", "legendTitle")
        .attr("x", 0)
        .attr("y",0)
        .attr("transform",function(){
            if(lHeight > 100){return "translate("+20+","+lHeight*0.35+")"}
            else if(lHeight < 100 && lHeight > 50){"translate("+0+","+lHeight*0.2+")"}
            else if(lHeight < 50){"translate("+0+","+lHeight*0.2+")"}
            })
        .text("Approximate Population");
}
function setNationalChart(bg_sh){
    var margin = {top: 15, right: 5, bottom: 100, left: 45},
    
    leftPadding = 5,
    rightPadding = 5,
    topBottomPadding = 20,
    chartWidth = window.innerWidth * 0.65,
    chartHeight = window.innerHeight*0.5,

    translate = "translate(" + leftPadding + "," + topBottomPadding + ")";

    var yTick = (d => d *100 + "%")
    
    var y = d3.scaleLinear()
        .range([chartHeight, 0])
        .domain([0,0.3])
        
        
    var x = d3.scaleBand()
        .range([0, chartWidth])
        .domain(bg_sh.map(function(d) { return d.Generation; }))
        .padding(0.25);

    

    chart1 = d3.select("figure.natChart")
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
        .ticks(5)
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
function setStateChart(state_data){
    var margin = {top: 15, right: 15, bottom: 100, left: 45},
    
    leftPadding = 50,
    topBottomPadding = 20,
    chartWidth = window.innerWidth * 0.65,
    
    translate = "translate(" + leftPadding + "," + topBottomPadding + ")";
    var chartHeight;
    if(window.innerWidth > 576){
        chartHeight = window.innerHeight*0.5
    }
    else if(window.innerWidth < 576 && window.innerWidth > 375){
        chartHeight = 400
    }
    else if(window.innerWidth < 375){
        chartHeight = 300
    }

    var select = state_data.WI
    var yTick = (d => d *100 + "%")
    
    var y = d3.scaleLinear()
        .range([chartHeight, 0])
        .domain([0,0.4])

    var x = d3.scaleBand()
        .range([0, chartWidth])
        .domain(select.map(function(d) { return d.Generation; }))
        .padding(0.25);  

    chart2 = d3.select("figure.stateChart")
        .append("svg")
        .attr("class","state-Chart")
        // .attr('viewBox', `0 0 ${chartWidth*1.5} ${chartHeight*1.5}`)
        .attr("width", chartWidth + margin.left + margin.right)
        .attr("height", chartHeight + margin.top + margin.bottom)
        .append("g")
        .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");


    statebars = chart2.selectAll(".bar")
        .data(select)
        .enter()
        .append("g")

    statebars.append("rect")
        .attr("class", "statebar")
        .attr("x", function(d) { return x(d.Generation); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.Value)})
        .attr("height", function(d){return chartHeight - y(d.Value)})
        .style("fill",function(d){
            return d.Color
        })
        .text(function(d){return 100*d.total})
    statebars.append("text")
        .attr("class","label")
        .attr("x", function (d) {return x(d.Generation) + x.bandwidth()/2})
        .attr("y", function(d) { return y(d.Value) - 10; })
        .text(function(d){return  d3.format(",.1%")(d.Value)})
        .attr("text-anchor","middle")
    
    var yAxis = d3.axisLeft()
        .tickFormat(yTick)
        .ticks(5)
        .scale(y)

    var xAxis = d3.axisBottom()
        .scale(x)
    
    var axis = chart2.append("g")
        .attr("class", "axis") //.axis is for css
        .call(yAxis)
        
    chart2.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(1," + chartHeight + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("class","xLabels")
        .attr("transform", "translate(-10,10)rotate(-45)")
        .style("text-anchor", "end");

    var chartTitle = d3.select(".stateTitle")
    // chart title is updated based on selected attribute. 
        .text("Population Share of Wisconsin - 2018");
    createDropdown(statebars, state_data, chartWidth, chartHeight)
}
function stateInputs(response){
    var chartWidth = window.innerWidth * 0.65;

    var chartHeight;

    if(window.innerWidth > 576){
        chartHeight = window.innerHeight*0.5
    }
    else if(window.innerWidth < 576 && window.innerWidth > 375){
        chartHeight = 400
    }
    else if(window.innerWidth < 375){
        chartHeight = 300
    }

    var abvList = {"Alabama":"AL","Alaska":"AK","Arizona":"AZ","Arkansas":"AR","California":"CA",
    "Colorado":"CO","Connecticut":"CT","Delaware":"DE","Florida":"FL", "Georgia":"GA","Hawaii":"HI","Idaho":"ID",
    "Illinois":"IL","Indiana":"IN","Iowa":"IA","Kansas":"KS","Kentucky":"KY","Louisiana":"LA","Maine":"ME",
    "Maryland":"MD","Massachusetts":"MA","Michigan":"MI","Minnesota":"MN","Mississippi":"MS","Missouri":"MO","Montana":"MT",
    "Nebraska":"NE","Nevada":"NV","New Hampshire":"NH","New Jersey":"NJ","New Mexico":"NM","New York":"NY","North Carolina":"NC","North Dakota":"ND",
    "Ohio":"OH","Oklahoma":"OK","Oregon":"OR","Pennsylvania":"PA","Rhode Island":"RI","South Carolina":"SC","South Dakota":"SD","Tennessee":"TN",
    "Texas":"TX","Utah":"UT","Vermont":"VT","Virginia":"VA","Washington":"WA","West Virginia":"WV","Wisconsin":"WI","Wyoming":"WY"}
    
    var dropdown = document.getElementById('dropdown')
    var index = response.index
    var stateList = ['Wisconsin','Wisconsin','Utah','California','Florida','Maine','Vermont','Texas','New York','blank']
    if(index < (stateList.length - 1)){
        dropdown.style.opacity = 0
        updateChart(statebars, stateList[index], state_data, chartWidth, chartHeight, abvList)
    }
    if(index == (stateList.length - 1)){
        dropdown.style.opacity = 1
    }
}
function createDropdown(statebars, state_data, chartWidth, chartHeight){
    //add select element
    var abvList = {"Alabama":"AL","Alaska":"AK","Arizona":"AZ","Arkansas":"AR","California":"CA",
    "Colorado":"CO","Connecticut":"CT","Delaware":"DE","Florida":"FL", "Georgia":"GA","Hawaii":"HI","Idaho":"ID",
    "Illinois":"IL","Indiana":"IN","Iowa":"IA","Kansas":"KS","Kentucky":"KY","Louisiana":"LA","Maine":"ME",
    "Maryland":"MD","Massachusetts":"MA","Michigan":"MI","Minnesota":"MN","Mississippi":"MS","Missouri":"MO","Montana":"MT",
    "Nebraska":"NE","Nevada":"NV","New Hampshire":"NH","New Jersey":"NJ","New Mexico":"NM","New York":"NY","North Carolina":"NC","North Dakota":"ND",
    "Ohio":"OH","Oklahoma":"OK","Oregon":"OR","Pennsylvania":"PA","Rhode Island":"RI","South Carolina":"SC","South Dakota":"SD","Tennessee":"TN",
    "Texas":"TX","Utah":"UT","Vermont":"VT","Virginia":"VA","Washington":"WA","West Virginia":"WV","Wisconsin":"WI","Wyoming":"WY"}

    var dropdown = d3.select(".dropdownDiv")
        .append("select")
        .attr("class", "dropdown")//.dropwdown is for css, this will also determine the placement on the screen
        .attr("id","dropdown")
        .on("change", function(){
            updateChart(statebars, this.value, state_data, chartWidth, chartHeight, abvList)// when attribute is changed, the changeAttribute function is called to update.
        });

    //add initial option
    var titleOption = dropdown.append("option")
        .attr("class", "titleOption") //.titleOption for css
        .attr("disabled", "true")
        .text("Select Any State..."); // initial text when opening the page

    //add attribute name options
    var attrOptions = dropdown.selectAll("attrOptions")
        .data(Object.keys(abvList)) //the list of data inside the dropdown menu
        .enter()
        .append("option")
        .attr("value", function(d){ return d })
        .text(function(d){ return d });
};
function updateChart(statebars,state_value, state_data, chartWidth, chartHeight, abvList){
    var margin = {top: 15, right: 15, bottom: 100, left: 45};

    var select;

    for(var i in abvList){
        if(i == state_value){
            select = "state_data."+String(abvList[i])
        }
    };

    select = eval(select)

    var yTick = (d => d + "%");

    var y = d3.scaleLinear()
        .range([chartHeight, 0])
        .domain([0,0.4])

    var x = d3.scaleBand()
        .range([0, chartWidth])
        .domain(select.map(function(d) { return d.Generation; }))
        .padding(0.25); 
    
        //position bars
    var svg = d3.select("figure.stateChart")

    var u = svg.selectAll("rect")
        .data(select)

    u.enter()
    .append("rect")
    .merge(u)
    .transition()
    .duration(1500)
    .attr("x", function(d) { return x(d.Generation); })
    .attr("width", x.bandwidth())
    .attr("y", function(d) { return y(d.Value)})
    .attr("height", function(d){return chartHeight - y(d.Value)})
    .style("fill",function(d){
        return d.Color
    })
    .text(function(d){return 100*d.total})

    var t = svg.selectAll('.label')

    t.data(select)
    t.enter()
    .append("text")
    .merge(t)
    .transition()
    .duration(1500)
    .attr("x", function (d) {return x(d.Generation) + x.bandwidth()/2})
    .attr("y", function(d) { return y(d.Value) - 10; })
    .text(function(d){return  d3.format(",.1%")(d.Value)})
    .attr("text-anchor","middle")
    
    var chartTitle = d3.select(".stateTitle")
    // chart title is updated based on selected attribute. 
        .text("Population Share of " + state_value +" - 2018 ");
};
function highlight(props, actual, index){
    //change stroke
    var selected = d3.selectAll("." + props.Join )//if the mouse is hovered over an element with .Neighborhood name, the charts and map will highlight that unit.
        .style("fill", "#6E6E6E") //color and stroke width
        .style("stroke-width", "2");
    setLabel(props, actual, index)//html element will popup if hovered over a unit.
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
function setLabel(props, actual, index){
    var labelAttribute;
    var match = city_object.Feature
    var assign;

    for(var m in match){
        if(match[m].Urban_Area.City == props.Urban_Area){
            assign = match[m].Urban_Area
        }
    }

    var gen;

    if(index == 1){
        gen = "Silent Generation"
    }
    if(index == 2){
        gen = "Silent Generation"
    }
    else if(index == 3){
        gen = "Baby Boomer"
    }
    else if(index ==4){
        gen = "Generation X"
    }
    else if(index == 5){
        gen = "Millennial"
    }
    else if(index == 6){
        gen = "Generation Z"
    }
    else if(index == 13){
        gen = "Baby Boomer"
    }
    else if(index == 14){
        gen = "Baby Boomer"
    }
    else if(index == 15){
        gen = "Generation X"
    }
    else if(index == 16){
        gen = "Millennial"
    }
    else if(index == 17){
        gen = "Millennial"
    }
    else if(index == 18){
        gen = "Generation Z"
    }
    else if(index == 19){
        gen = "Generation Z"
    }
    if(index < 7){
        var urban = "<h1>" +props.Urban_Area +
            "</h1><br>"+gen+" Population: " + d3.format(",")(actual)+"<br>"
    }
    if(index > 8 && index < 13){
        var urban = "<h1>" +props.Urban_Area +
            "</h1><br>Total Population Increase: " + "<div style = 'display:inline; color:#FFFF00;'>"+d3.format(",")(actual)+"</div><br>"
    }
    else if(index > 12 && index < 20){
        var urban = "<h1>" +props.Urban_Area +
        "</h1><br>"+gen+" Population Increase: " + d3.format(",")(actual)+"<br>" 
    }

    labelAttribute = urban

    var infolabel = d3.select("figure.prop-map")
        .append("div")
        .attr("class", "infolabel")//.inforlabel for css
        .attr("id", props.Join + "_label") //this attribute is based on the selected attribute.
        .html(labelAttribute); //.html calls up the html tag

    if(index < 7){
        setMiniChart(assign)
    }
    else if(index > 8 && index < 11){
        setMiniChartChange(assign)
    }
    
};
function moveLabel(){
    //get width of labels
    var labelWidth = d3.select(".infolabel")
        .node()
        .getBoundingClientRect()//studies screen real estate.
        .width;

    //use coordinates of mousemove event to set label coordinates
    var x1 = d3.event.clientX + 10, //determines the html placement depending where the mouse moves.
        y1 = d3.event.clientY - 180,
        x2 = d3.event.clientX - labelWidth - 10,
        y2 = d3.event.clientY + 15;
  
    //x for the horizontal, avoids overlap
    var x = d3.event.clientX > window.innerWidth - labelWidth - 20 ? x2 : x1; 
    //y for the horizontal, avoids overlap
    var y = d3.event.clientY < window.innerHeight - 225 ? y2 : y1; 

    d3.select(".infolabel") //the infolabel html will now adjust based on mouse location
        .style("left", x + "px")
        .style("top", y + "px");
};
function moveChartlessLabel(){
    //get width of labels
    var labelWidth = d3.select(".infolabel")
        .node()
        .getBoundingClientRect()//studies screen real estate.
        .width;

    //use coordinates of mousemove event to set label coordinates
    var x1 = d3.event.clientX + 10, //determines the html placement depending where the mouse moves.
        y1 = d3.event.clientY - 10,
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
function setMiniChart(assign){
    var margin = {top: 30, right: 5, bottom: 10, left: 45},
        chartWidth = 200,
        chartHeight = 100;

    var y = d3.scaleLinear()
        .range([chartHeight, 0])
        .domain([0,0.5])

    var yTick = (d => d *100+ "%");

    var x = d3.scaleBand()
        .range([0, chartWidth])
        .domain(assign.yr2018.map(function(d) { return d.Generation; })) 

    var miniChart = d3.select('.infolabel')
        .append("svg")
        .attr("class","minichart")
        .attr("width", chartWidth + margin.left + margin.right)
        .attr("height", chartHeight + margin.top + margin.bottom)
        .append("g")
        .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

    var miniBars = miniChart.selectAll(".bar")
        .data(assign.yr2018)
        .enter()
        .append("g")

    miniBars.append("rect")
        .attr("class", "statebar")
        .attr("x", function(d) { return x(d.Generation); })
        .attr("width",chartWidth/6)
        .attr("y", function(d) { return y(d.Value)})
        .attr("height", function(d){return 100 - y(d.Value)})
        .style("fill",function(d){
            return d.Color
        })
    miniBars.append("text")
        .attr("class","miniBarLabel")
        .attr("x", function (d) {return x(d.Generation) + x.bandwidth()/2})
        .attr("y", function(d) { return y(d.Value) - 5; })
        .text(function(d){return  d3.format(",.0%")(d.Value)})
        .attr("text-anchor","middle")
        .attr("color","white")
        
    var yAxis = d3.axisLeft()
        .tickFormat(yTick)
        .ticks(5)
        .scale(y)
        
    var xAxis = d3.axisBottom()
        .tickValues([])
        .scale(x)

    var axis = miniChart.append("g")
        .attr("class", "miniYaxis") //.axis is for css
        .call(yAxis)
    
    miniChart.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(1," + chartHeight + ")")
        .call(xAxis)
    var chartTitle = miniChart.append("text")
        .attr("x", 40)
        .attr("y", -10)
        .attr("class", "miniTitleText") // .titleText is for css
        .text("Pop. Share - 2018"); // expressed is the attribute name.
}
function setMiniChartChange(assign){
    var margin = {top: 30, right: 15, bottom: 20, left: 15},
        chartWidth = 260,
        chartHeight = 100;

    var x = d3.scaleLinear()
        .range([0, chartWidth])
        .domain([-1,1])

    var xTick = (d => d *100+ "%");

    var y = d3.scaleBand()
        .range([0, chartHeight])
        .domain(assign.change.map(function(d) { return d.Generation; })) 

    var miniChartChange = d3.select('.infolabel')
        .append("svg")
        .attr("class","miniPlot")
        .attr("width", chartWidth + margin.left + margin.right)
        .attr("height", chartHeight + margin.top + margin.bottom)
        .append("g")
        .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");


    var miniBars = miniChartChange.selectAll(".bar")
        .data(assign.change)
        .enter()
        .append("g")

    miniBars.append("rect")
        .attr("class", "statebar")
        .attr("x", function(d) { return x(Math.min(0, d.Value/d.Gen2013)); })
        .attr("width", function(d){ return Math.abs(x(d.Value/d.Gen2013)-x(0))})
        .attr("y", function(d) { return y(d.Generation)})
        .attr("height", function(d){return y.bandwidth()})
        .style("fill",function(d){
            return d.Color
        })
        .text(function(d){return 100*d.Value})
    miniBars.append("text")
        .attr("class","miniBarLabel")
        .attr("y", function (d) {return y(d.Generation) + y.bandwidth()/1.5})
        .attr("x", function(d) { 
            if((d.Value/d.Gen2013) > 0){
                return x(d.Value/d.Gen2013) + 20}
            else{
                return x(d.Value/d.Gen2013) - 20}
        })
        .text(function(d){return  d3.format(",.1%")(d.Value/d.Gen2013)})
        .attr("text-anchor","middle")
        .attr("color","white")
        
    var xAxis = d3.axisBottom()
        .tickFormat(xTick)
        .ticks(5)
        .scale(x)
        
    
    var YAxis = d3.axisLeft()
        .tickValues([])
        .scale(y)

    var axis = miniChartChange.append("g")
        .attr("class", "miniYaxis") //.axis is for css
        .attr("transform", "translate(0," + chartHeight + ")")
        .call(xAxis)
    
    miniChartChange.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + x(0) + ",0)")
        .call(YAxis)
    var chartTitle = miniChartChange.append("text")
        .attr("x", 15)
        .attr("y", -10)
        .attr("class", "miniTitleText") // .titleText is for css
        .text("Pop. Change by Generation: 2013 - 2018"); // expressed is the attribute name.
}
function scatterplot(){
    var colorSet = ["#722e94","#b97cca","#b16a24","#86bf87","#23632f"];

    var margin = {top: 20, right: 20, bottom: 20, left: 20}

    var height = screen.height - 60
    var width = window.innerWidth*.98

    var x = d3.scaleLinear()
        .range([0,width])
    var y = d3.scaleLinear()
        .range([height,0])

    var fakedata = function(){
        var dataset = []
        for(var i = 0; i < 2000; i++){
            var x = d3.randomUniform(0,2000)();
            var y = d3.randomUniform(0,2000)();
            var c = colorSet[Math.floor(Math.random()*colorSet.length)]
            dataset.push({"x": x,"y": y, "color":c});
        }
        return dataset
    }
    var data = fakedata()

    x.domain([0,2000])
    y.domain([0,2000])

    var scatter = d3.select('.scatterplot')
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class","randomDots")
        .append("g")
    
    scatter.append("g")
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("fill", function(d){return d.color})
        .attr("cx", function(d) { return x(d.x); })
        .attr("cy", function(d) { return y(d.y); })
        .transition()
        .delay(function(d,i){ return 25*i; }) 
        .duration(25)
        .attr("r", 2);
}
function informUser(){
    var h = screen.height;
    var w = screen.width;
    var inform = "<div>This portion of the <br>page is best<br> viewed on desktop</div>"

    var informData = d3.selectAll(".map")
        .append("rect")
        .attr("class","inform")
        .attr("viewBox", `0 0 ${w} ${h}`)
        .attr('width', "100%")
        .attr('height', "50%")
        .attr('transform','translate(0,150)')
        .raise()

    var text = d3.selectAll(".map")
        .append("text")
        .attr("class","informText")
        .attr('transform','translate('+w/2+','+h/2.25+')')
        .text("Best viewed on a larger device")
        .attr("text-anchor","middle")
        .raise()   
}
init()
}

$(document).ready(whole);