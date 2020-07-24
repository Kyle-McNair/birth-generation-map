var map

// var collection = {"SG":{"Opacity": 1, "Color": "#750d87"},"BB":{"Opacity": 1, "Color": "#b28dc4"},"GX":{"Opacity": 1, "Color": "#af6e23"},
//         "ML":{"Opacity": 1, "Color": "#a7d5a0"},"GZ":{"Opacity": 1, "Color": "#0062a"}};

var collections = {"SG":{"Opacity": 1, "Color": "#93003a"},
    "BB":{"Opacity": 1, "Color": "#c95293"},
    "GX":{"Opacity": 1, "Color": "#ffb94f"},
    "ML":{"Opacity": 1, "Color": "#7fac79"},
    "GZ":{"Opacity": 1, "Color": "#176b2a"}};

var collection = {"SG":{"Opacity": 1, "Color": "#652187"},
    "BB":{"Opacity": 1, "Color": "#9463ab"},
    "GX":{"Opacity": 1, "Color": "#fdcf79"},
    "ML":{"Opacity": 1, "Color": "#558c58"},
    "GZ":{"Opacity": 1, "Color": "#003d13"}};

    var collection4 = {"SG":{"Opacity": 1, "Color": "#882255"},
    "BB":{"Opacity": 1, "Color": "#CC6677"},
    "GX":{"Opacity": 1, "Color": "#DDCC77"},
    "ML":{"Opacity": 1, "Color": "#44AA99"},
    "GZ":{"Opacity": 1, "Color": "#117733"}};


cities = [[-87.65, 41.88],[-112.09, 33.53],[-74.01, 40.71],[-71.06, 42.36],[-82.51, 27.89],[-97.74, 30.26],[-104.98, 39.74],[-93.27, 44.98],[-122.40, 37.73]];

var firstSymbolId;

randomCity = cities[Math.floor(Math.random()*cities.length)]

function setMap(){
    
    mapboxgl.accessToken = "pk.eyJ1IjoibWNuYWlyazk0IiwiYSI6ImNrNmpxdDI1eDAwZjUzbG15OGFnZGxyd2EifQ.7XQ2utbtmE1Vqu4LbrcXyw"

    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mcnairk94/ckbr1y01s0y7x1ik6etmyzu3v',
        center: randomCity, // starting position [lng, lat]
        zoom: 9, // starting zoom
        minZoom: 2,
        maxZoom: 12
        });

    if(window.innerWidth < 576){
            mobileToggle()
    }
    map.dragRotate.disable();
    
    map.on('load', function () {
        var styles = map.getStyle().layers
        
        for (var i = 0; i < styles.length; i++) {
            if (styles[i].type === 'symbol') {
            firstSymbolId = styles[i].id;
            break;
            }
        }
        
        map.addSource('Birth-Generations', {
            type: 'vector',
            url: 'mapbox://mcnairk94.amuexkf6'
        });
        map.addSource('Birth-Generations-2013', {
            type: 'vector',
            url: 'mapbox://mcnairk94.7zri5lts'
        });
        map.addSource('Population-Change',{
            type: 'vector',
            url: 'mapbox://mcnairk94.7wkkk77t'
        })
        addMainDots() 
    
        var gain = document.getElementById('gained')
        gain.addEventListener('change',function(){
        if(this.checked){
            var fade = document.getElementById('lost_box')
            fade.style.opacity = 0.25
            fade.style.pointerEvents = 'none'
            map.removeLayer('dots_2018')
            addGained()
      
        }
        else{
            var fade = document.getElementById('lost_box')
            fade.style.opacity = 0.9
            fade.style.pointerEvents = 'auto'
            map.removeLayer('gained_dots')
            addMainDots() 
        }
   
        })
        var lost = document.getElementById('lost')
        lost.addEventListener('change',function(){
        if(this.checked){
            var fade = document.getElementById('gained_box')
            fade.style.opacity = 0.25
            fade.style.pointerEvents = 'none'
            map.removeLayer('dots_2018')
            addLost()
        }
        else{
            var fade = document.getElementById('gained_box')
            fade.style.opacity = 0.9
            fade.style.pointerEvents = 'auto'
            map.removeLayer('lost_dots')
            addMainDots()
            }
        })
        var layer
        layer = "dots_2018"
        $($('.year')).on({
            click: function(e){

                var click = e.target.id
                if(click == '2018' && e.target.classList.contains('active')){
                    return
                }
                if(click == '2013' && e.target.classList.contains('active')){
                    return
                }
                if(click == '2013'){
                    layer = 'dots_2013'
                    layers = map.getStyle().layers; 
                    var layer_Ids = layers.map(function (layer) {
                        return(layer.id);
                    });
                    if(layer_Ids.includes('gained_dots')){
                        map.removeLayer('gained_dots')
                        var gBox = document.getElementById('gained')
                        gBox.checked = false;
                    }
                    if(layer_Ids.includes('lost_dots')){
                        map.removeLayer('lost_dots')
                        var lBox = document.getElementById('lost')
                        lBox.checked = false;
                    }
                    $('.year').each(function(){
                        if($(this).hasClass('active')){
                            $(this).removeClass('active')
                        }})
                    if(layer_Ids.includes('dots_2018')){
                        map.removeLayer('dots_2018')
                    }
                    e.target.classList.add('active')
                    // map.removeLayer('dots_2018')
                    add2013Dots()
                    var gBox = document.getElementById('gained_box')
                    gBox.style.opacity = 0.25
                    gBox.style.pointerEvents = 'none'

                    var lBox = document.getElementById('lost_box')
                    lBox.style.opacity = 0.25
                    lBox.style.pointerEvents = 'none'
                }
                if(click == '2018'){
                    layer = 'dots_2018'
                    $('.year').each(function(){
                        if($(this).hasClass('active')){
                            $(this).removeClass('active')
                        }})
                    e.target.classList.add('active')
                    map.removeLayer('dots_2013')
                    addMainDots()
                    
                    var gBox = document.getElementById('gained_box')
                    gBox.style.opacity = 0.9
                    gBox.style.pointerEvents = 'auto'

                    var lBox = document.getElementById('lost_box')
                    lBox.style.opacity = 0.9
                    lBox.style.pointerEvents = 'auto'
                }console.log(layer)
            }
            
        });
        
        var gen = document.getElementById('generations')    
        gen.addEventListener('click',function(e){
            console.log(layer)
            if(document.getElementById('gained').checked == true){
                layer = 'gained_dots'
            }
            else if(document.getElementById('lost').checked == true){
                layer = 'lost_dots'
            }
            else if(document.getElementById('lost').checked == false && document.getElementById('gained').checked == false){
                $('.year').each(function(){
                    if($(this).hasClass('active')){
                        layer = "dots_"+this.id
                    }})
                    console.log(layer)
            }
            var layerID = e.target.id
            var opacityCheck = document.getElementById(layerID)
            if(opacityCheck.style.opacity == 0.25){
                opacityCheck.style.opacity = 0.9
                for(var c in collection){
                    if(layerID == c){
                        collection[c].Opacity = 1
                    }
                }
                map.setPaintProperty(layer,'circle-opacity',[
                    'match',
                    ['get','Generation'],
                    'SG',collection.SG.Opacity,
                    'BB',collection.BB.Opacity,
                    'GX',collection.GX.Opacity,
                    'ML',collection.ML.Opacity,
                    'GZ',collection.GZ.Opacity,
                    1
            ])
            }
            else{
                opacityCheck.style.opacity = 0.25
                for(var c in collection){
                    if(layerID == c){
                        collection[c].Opacity = 0
                    }
                }
                map.setPaintProperty(layer,'circle-opacity',[
                    'match',
                    ['get','Generation'],
                    'SG',collection.SG.Opacity,
                    'BB',collection.BB.Opacity,
                    'GX',collection.GX.Opacity,
                    'ML',collection.ML.Opacity,
                    'GZ',collection.GZ.Opacity,
                    1
                ])
                }
        })
        
    })
    
    
    map.on('render',function(){
        var dotInfo = $('.dotText')
        dotInfo.text(dotScale())
    })
    if(window.innerWidth > 576){
        legendHover()
    }
    hideLabels()
}
function hideLabels(){
    var toggle = document.getElementById('labels')
    toggle.addEventListener('change',function(){
        if(this.checked){
            map.setLayoutProperty("City Labels", 'visibility', 'none') 
            map.setLayoutProperty("State Labels", 'visibility', 'none') 
        }
        else{
            map.setLayoutProperty("City Labels", 'visibility', 'visible')   
            map.setLayoutProperty("State Labels", 'visibility', 'visible')
        }
    })
}
function addMainDots(){
    if(window.innerWidth > 576){
        map.addLayer({
            'id':'dots_2018',
            'type':'circle',
            'source':'Birth-Generations',
            'source-layer':'2018_BG_Scale25',
            'paint':{
                'circle-radius': {
                    'stops':[
                        [5,1],
                        [6, 1],
                        [7,1.1],
                        [8,1.2],
                        [9,1.2],
                        [10, 1.2],
                        [10.5,1.35],
                        [11, 1.5]
                    ]
                },
                'circle-color':[
                    'match',
                    ['get','Generation'],
                    'SG',collection.SG.Color,
                    'BB',collection.BB.Color,
                    'GX',collection.GX.Color,
                    'ML',collection.ML.Color,
                    'GZ',collection.GZ.Color,
                    /* other */ '#ccc'
                ]
            }
        },firstSymbolId);
    }
    else{
        map.addLayer({
            'id':'dots_2018',
            'type':'circle',
            'source':'Birth-Generations',
            'source-layer':'2018_BG_Scale25',
            'paint':{
                'circle-radius': {
                    'stops':[
                        [5,0.65],
                        [6, 0.75],
                        [7,0.85],
                        [8,0.95],
                        [9,0.95],
                        [10, 0.95],
                        [10.5,0.95],
                        [11, 0.95],
                        [12,1.5]
                    ]
                },
                'circle-color':[
                    'match',
                    ['get','Generation'],
                    'SG',collection.SG.Color,
                    'BB',collection.BB.Color,
                    'GX',collection.GX.Color,
                    'ML',collection.ML.Color,
                    'GZ',collection.GZ.Color,
                    /* other */ '#ccc'
                ]
            }
        },firstSymbolId);
    };
}
function add2013Dots(){
    if(window.innerWidth > 576){
        map.addLayer({
            'id':'dots_2013',
            'type':'circle',
            'source':'Birth-Generations-2013',
            'source-layer':'2013_BG_Scale25',
            'paint':{
                'circle-radius': {
                    'stops':[
                        [5,1],
                        [6, 1],
                        [7,1.1],
                        [8,1.2],
                        [9,1.2],
                        [10, 1.2],
                        [10.5,1.35],
                        [11, 1.5]
                    ]
                },
                'circle-color':[
                    'match',
                    ['get','Generation'],
                    'SG',collection.SG.Color,
                    'BB',collection.BB.Color,
                    'GX',collection.GX.Color,
                    'ML',collection.ML.Color,
                    'GZ',collection.GZ.Color,
                    /* other */ '#ccc'
                ]
            }
        },firstSymbolId);
    }
    else{
        map.addLayer({
            'id':'dots_2013',
            'type':'circle',
            'source':'Birth-Generations-2013',
            'source-layer':'2013_BG_Scale25',
            'paint':{
                'circle-radius': {
                    'stops':[
                        [5,0.65],
                        [6, 0.75],
                        [7,0.85],
                        [8,0.95],
                        [9,0.95],
                        [10, 0.95],
                        [10.5,0.95],
                        [11, 0.95],
                        [12,1.5]
                    ]
                },
                'circle-color':[
                    'match',
                    ['get','Generation'],
                    'SG',collection.SG.Color,
                    'BB',collection.BB.Color,
                    'GX',collection.GX.Color,
                    'ML',collection.ML.Color,
                    'GZ',collection.GZ.Color,
                    /* other */ '#ccc'
                ]
            }
        },firstSymbolId);
    };
}
function addGained(){
    if(window.innerWidth > 576){
        map.addLayer({
            'id':'gained_dots',
            'type':'circle',
            'source':'Population-Change',
            'source-layer':'Population_Change',
            'filter':['==','Type','pos'],
            'paint':{
                'circle-radius': {
                    'stops':[
                        [5,1],
                        [6, 1],
                        [7,1.1],
                        [8,1.2],
                        [9,1.2],
                        [10, 1.2],
                        [10.5,1.35],
                        [11, 1.5]
                    ]
                },
                'circle-color':[
                    'match',
                    ['get','Generation'],
                    'SG',collection.SG.Color,
                    'BB',collection.BB.Color,
                    'GX',collection.GX.Color,
                    'ML',collection.ML.Color,
                    'GZ',collection.GZ.Color,
                    /* other */ '#ccc'
                ],
                'circle-opacity':[
                    'match',
                    ['get','Generation'],
                    'SG',collection.SG.Opacity,
                    'BB',collection.BB.Opacity,
                    'GX',collection.GX.Opacity,
                    'ML',collection.ML.Opacity,
                    'GZ',collection.GZ.Opacity,
                    1
                ]
            }
        },firstSymbolId);
    }
    else{
        map.addLayer({
            'id':'gained_dots',
            'type':'circle',
            'source':'Population-Change',
            'source-layer':'Population_Change',
            'filter':['==','Type','pos'],
            'paint':{
                'circle-radius': {
                    'stops':[
                        [5,0.65],
                        [6, 0.75],
                        [7,0.85],
                        [8,0.95],
                        [9,0.95],
                        [10, 0.95],
                        [10.5,0.95],
                        [11, 0.95],
                        [12,1.5]
                    ]
                },
                'circle-color':[
                    'match',
                    ['get','Generation'],
                    'SG',collection.SG.Color,
                    'BB',collection.BB.Color,
                    'GX',collection.GX.Color,
                    'ML',collection.ML.Color,
                    'GZ',collection.GZ.Color,
                    /* other */ '#ccc'
                ],
                'circle-opacity':[
                    'match',
                    ['get','Generation'],
                    'SG',collection.SG.Opacity,
                    'BB',collection.BB.Opacity,
                    'GX',collection.GX.Opacity,
                    'ML',collection.ML.Opacity,
                    'GZ',collection.GZ.Opacity,
                    1
                ]
            }
        },firstSymbolId);
    }
}
function addLost(){
    if(window.innerWidth > 576){
        map.addLayer({
            'id':'lost_dots',
            'type':'circle',
            'source':'Population-Change',
            'source-layer':'Population_Change',
            'filter':['==','Type','neg'],
            'paint':{
                'circle-radius': {
                    'stops':[
                        [5,1],
                        [6, 1],
                        [7,1.1],
                        [8,1.2],
                        [9,1.2],
                        [10, 1.2],
                        [10.5,1.35],
                        [11, 1.5]
                    ]
                },
                'circle-color':[
                    'match',
                    ['get','Generation'],
                    'SG',collection.SG.Color,
                    'BB',collection.BB.Color,
                    'GX',collection.GX.Color,
                    'ML',collection.ML.Color,
                    'GZ',collection.GZ.Color,
                    /* other */ '#ccc'
                ],
                'circle-opacity':[
                    'match',
                    ['get','Generation'],
                    'SG',collection.SG.Opacity,
                    'BB',collection.BB.Opacity,
                    'GX',collection.GX.Opacity,
                    'ML',collection.ML.Opacity,
                    'GZ',collection.GZ.Opacity,
                    1
                ]
            }
        },firstSymbolId);
    }
    else{
        map.addLayer({
            'id':'lost_dots',
            'type':'circle',
            'source':'Population-Change',
            'source-layer':'Population_Change',
            'filter':['==','Type','neg'],
            'paint':{
                'circle-radius': {
                    'stops':[
                        [5,0.65],
                        [6, 0.75],
                        [7,0.85],
                        [8,0.95],
                        [9,0.95],
                        [10, 0.95],
                        [10.5,0.95],
                        [11, 0.95],
                        [12,1.5]
                    ]
                },
                'circle-color':[
                    'match',
                    ['get','Generation'],
                    'SG',collection.SG.Color,
                    'BB',collection.BB.Color,
                    'GX',collection.GX.Color,
                    'ML',collection.ML.Color,
                    'GZ',collection.GZ.Color,
                    /* other */ '#ccc'
                ],
                'circle-opacity':[
                    'match',
                    ['get','Generation'],
                    'SG',collection.SG.Opacity,
                    'BB',collection.BB.Opacity,
                    'GX',collection.GX.Opacity,
                    'ML',collection.ML.Opacity,
                    'GZ',collection.GZ.Opacity,
                    1
                ]
            }
        },firstSymbolId);    
    }
}
function dotScale(){
    var scale = 25
    var zoom = map.getZoom();
    if(zoom >=10){
        return "1 Dot = "+String(scale)+" People"
    }
    else if(zoom < 10 && zoom >= 9){
        return "1 Dot = "+String(scale*2)+" People"
    }
    else if(zoom < 9 && zoom >= 8){
        return "1 Dot = "+String(scale*4)+" People"
    }
    else if(zoom < 8 && zoom >=7){
        return "1 Dot = "+String(scale*8)+" People"
    }
    else if(zoom < 7 && zoom >= 6){
        return "1 Dot = "+String(scale*16)+" People"
    }
    else if(zoom < 6 && zoom >= 5){
        return "1 Dot = "+String(scale*32)+" People"
    }
    else if(zoom < 5 && zoom >= 4){
        return "1 Dot = "+String(scale*64)+" People"
    }
    else if(zoom < 4 && zoom >= 1){
        return "1 Dot = "+String(scale*128)+" People"
    }
}
function legendHover(){
    $('.item1').hover(function(){
        $(this).css("border","1.5px solid white")
        $('.b1').show();
    }, function(){
        $(this).css("border","none")
        $('.b1').hide();
    })
    $('.item2').hover(function(){
        $(this).css("border","1.5px solid white")
        $('.b2').css("top","20.5%")
        $('.b2').show();
    }, function(){
        $(this).css("border","none")
        $('.b2').hide();
    })
    $('.item3').hover(function(){
        $(this).css("border","1.5px solid white")
        $('.b3').css("top","29%")
        $('.b3').show();
    }, function(){
        $(this).css("border","none")
        $('.b3').hide();
    })
    $('.item4').hover(function(){
        $(this).css("border","1.5px solid white")
        $('.b4').css("top","37.5%")
        $('.b4').show();
    }, function(){
        $(this).css("border","none")
        $('.b4').hide();
    })
    $('.item5').hover(function(){
        $(this).css("border","1.5px solid white")
        $('.b5').css("top","46%")
        $('.b5').show();
    }, function(){
        $(this).css("border","none")
        $('.b5').hide();
    })

}
function mobileToggle(){
    map.addControl(new mapboxgl.AttributionControl(), 'top-right');
    // document.getElementById("legend").remove();

    var btn = document.createElement('button')
    btn.innerHTML = "Tap here for more information"
    btn.classList.add("btn","btn-primary","mobileButton")
    btn.setAttribute('type','button')
    btn.setAttribute('data-toggle','collapse')
    btn.setAttribute('data-target','#legend')
    btn.setAttribute('aria-expanded','false')
    btn.setAttribute('aria-controls','legend')
    document.body.appendChild(btn)

    var legend = document.getElementById('legend')
    legend.classList.add('collapse')
}
$(document).ready(setMap);