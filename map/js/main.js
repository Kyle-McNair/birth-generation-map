

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

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mcnairk94/ckbr1y01s0y7x1ik6etmyzu3v',
        center: [-87.8, 41.8], // starting position [lng, lat]
        zoom: 9, // starting zoom
        minZoom: 4,
        maxZoom: 12
        });
}
$(document).ready(setMap);