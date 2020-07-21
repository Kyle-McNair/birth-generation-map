var map

function setMap(){
    mapboxgl.accessToken = "pk.eyJ1IjoibWNuYWlyazk0IiwiYSI6ImNrNmpxdDI1eDAwZjUzbG15OGFnZGxyd2EifQ.7XQ2utbtmE1Vqu4LbrcXyw"

    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mcnairk94/ckbr1y01s0y7x1ik6etmyzu3v',
        center: [-87.65, 41.88], // starting position [lng, lat]
        zoom: 8, // starting zoom
        minZoom: 2,
        maxZoom: 12
        });


        map.on('load', function () {
  
            map.addSource('Birth-Generations', {
              type: 'vector',
              url: 'mapbox://mcnairk94.amuexkf6'
            });
            if(window.innerWidth > 576){
                map.addLayer({
                    'id':'dots_2018',
                    'type':'circle',
                    'source':'Birth-Generations',
                    'source-layer':'2018_BG_Scale25',
                    'paint':{
                        'circle-radius': {
                            'stops':[
                                [5,0.85],
                                [6, 0.95],
                                [7,1.1],
                                [8,1.2],
                                [9,1.2],
                                [10, 1.2],
                                [10.5,1.2],
                                [11, 1.2],
                                [12,2]
                            ]
                        },
                        'circle-color':[
                            'match',
                            ['get','Generation'],
                            'SG', '#750d87',
                            'BB','#b28dc4',
                            'GX','#af6e23',
                            'ML','#a7d5a0',
                            'GZ','#006b2a',
                            /* other */ '#ccc'
                        ]
                    }
                });
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
                            'SG', '#750d87',
                            'BB','#b28dc4',
                            'GX','#af6e23',
                            'ML','#a7d5a0',
                            'GZ','#006b2a',
                            /* other */ '#ccc'
                        ]
                    }
                });
            }
            var collection = {"SG":{"Opacity": 1, "Color": "#750d87"},"BB":{"Opacity": 1, "Color": "#b28dc4"},"GX":{"Opacity": 1, "Color": "#af6e23"},
            "ML":{"Opacity": 1, "Color": "#a7d5a0"},"GZ":{"Opacity": 1, "Color": "#0062a"}}
            console.log(collection)
            
            var gen = document.getElementById('generations')    
            gen.addEventListener('click',function(e){
                var layerID = e.target.id
                var opacityCheck = document.getElementById(layerID)
                var layer = 'dots_2018'
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
}

function dotScale(){
    var scale = 25
    var zoom = map.getZoom();
    if(zoom >=10){
        return "1 Dot = "+String(scale)+" People, Scale: "+zoom
    }
    else if(zoom < 10 && zoom >= 9){
        return "1 Dot = "+String(scale*2)+" People, Scale: "+zoom
    }
    else if(zoom < 9 && zoom >= 8){
        return "1 Dot = "+String(scale*4)+" People, Scale: "+zoom
    }
    else if(zoom < 8 && zoom >=7){
        return "1 Dot = "+String(scale*8)+" People, Scale: "+zoom
    }
    else if(zoom < 7 && zoom >= 6){
        return "1 Dot = "+String(scale*16)+" People, Scale: "+zoom
    }
    else if(zoom < 6 && zoom >= 5){
        return "1 Dot = "+String(scale*32)+" People, Scale: "+zoom
    }
    else if(zoom < 5 && zoom >= 4){
        return "1 Dot = "+String(scale*64)+" People, Scale: "+zoom
    }
    else if(zoom < 4 && zoom >= 1){
        return "1 Dot = "+String(scale*128)+" People, Scale: "+zoom
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
        $('.b2').css("top","17%")
        $('.b2').show();
    }, function(){
        $(this).css("border","none")
        $('.b2').hide();
    })
    $('.item3').hover(function(){
        $(this).css("border","1.5px solid white")
        $('.b3').css("top","25.5%")
        $('.b3').show();
    }, function(){
        $(this).css("border","none")
        $('.b3').hide();
    })
    $('.item4').hover(function(){
        $(this).css("border","1.5px solid white")
        $('.b4').css("top","34%")
        $('.b4').show();
    }, function(){
        $(this).css("border","none")
        $('.b4').hide();
    })
    $('.item5').hover(function(){
        $(this).css("border","1.5px solid white")
        $('.b5').css("top","43.5%")
        $('.b5').show();
    }, function(){
        $(this).css("border","none")
        $('.b5').hide();
    })

}
$(document).ready(setMap);