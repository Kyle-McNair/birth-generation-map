var map

function setMap(){

    // var dark = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
    //     attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    //     subdomains: 'abcd',
    //     minZoom: 0,
    //     maxZoom: 20,
    //     ext: 'png'
    // });

    // map = L.map('map', {
    //     center: [38,-98],
    //     zoom: 5,
	// 	layers: [dark]
    // });

    mapboxgl.accessToken = "pk.eyJ1IjoibWNuYWlyazk0IiwiYSI6ImNrNmpxdDI1eDAwZjUzbG15OGFnZGxyd2EifQ.7XQ2utbtmE1Vqu4LbrcXyw"

    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mcnairk94/ckbr1y01s0y7x1ik6etmyzu3v',
        center: [-87.65, 41.88], // starting position [lng, lat]
        zoom: 8, // starting zoom
        minZoom: 2,
        maxZoom: 13
        });


        // map.on('load', function () {
  
        //     map.addSource('Birth-Generations', {
        //       type: 'vector',
        //       url: 'mapbox://mcnairk94.99c2gure'
        //     });
        //     map.addLayer({
        //         'id':'dots_part1',
        //         'type':'circle',
        //         'source':'Birth-Generations',
        //         'source-layer':'2018_dots_part1_geojson',
        //         'paint':{
        //             'circle-radius': 1.25,
        //             'circle-color':'green'
        //         }
        //     })
          
        // })

    map.on('render',function(){
        var dotInfo = $('.dotText')
        dotInfo.text(dotScale())
    })
    //dotScale()
    legendHover()
}

function dotScale(){
    var scale = 25
    var zoom = map.getZoom();
    if(zoom >= 12 && zoom > 9){
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