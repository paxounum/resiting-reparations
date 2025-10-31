/*global L, carto, Mustache */

//Defining Map
var map = L.map("map", {
  center: [42.042798, -87.673518],
  zoom: 14
});

var popupTemplate = document.querySelector('.popup-template').innerHTML;

// Add base layer
L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}.png",
  {
    maxZoom: 18
  }
).addTo(map);

// Initialize Carto
var client = new carto.Client({
  apiKey: "default_public",
  username: "browj934"
});

// Reparations Definitions Survey Data
// Initialze data source
var defSource = new carto.source.SQL("SELECT * FROM browj934.copy_reparations_where_you_stand_responses");

// Create style for the data
var defStyle = new carto.style.CartoCSS(`
 #layer {
  marker-width: 30;
  marker-fill: #000000;
  marker-fill-opacity: 1;
  marker-file: url('https://cdn.glitch.com/84dbdb18-88ef-4a1c-bddc-c150d9548773%2Fstakeholder_b.png');
  marker-allow-overlap: true;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}
`);

//Add syle to Line data
var defLayer = new carto.layer.Layer(defSource, defStyle, { 
                featureClickColumns: ['name', 'tenure', 'beginning', 'program', 'community', 'change', 'questions', 'scene']});

// Adding Click Features to show Interview data in Panel
var beginning = document.querySelector('.beginning-content');

defLayer.on('featureClicked', function (event) {
  
  var begContent = '<h6>From the beginning...</h6>'
  begContent += '<p>' + event.data['beginning'] + '</p>'
  beginning.innerHTML = begContent;
  console.log("Clicked");
});

var program = document.querySelector('.program-content');
defLayer.on('featureClicked', function (event) {
  
  var progContent = '<h6>The Evanston approach...</h6>'
  progContent += '<p>' + event.data['program'] + '</p>'
  program.innerHTML = progContent;
  console.log("Clicked");
});

var community = document.querySelector('.community-content');
defLayer.on('featureClicked', function (event) {
  
  var comContent = '<h6>From my community...</h6>'
  comContent += '<p>' + event.data['community'] + '</p>'
  community.innerHTML = comContent;
  console.log("Clicked");
});

//Adding Popup
defLayer.on('featureClicked', function (event) {
  
  var content =  Mustache.render(popupTemplate, event.data);
  // If you're not sure what data is available, log it out:
  console.log(event.data);
  
  var popup = L.popup();
  popup.setContent(content);
  
  // Place the popup and open it
  popup.setLatLng(event.latLng);
  popup.openOn(map);
});

  
// Add the data to the map as a layer
client.addLayer(defLayer, defLayer);
client.getLeafletLayer().addTo(map);


//Nav Panel Response
var toggleNav = document.querySelector('.toggle-nav');
var navPanel = document.querySelector('.nav-panel')
var navVisible = true;

toggleNav.addEventListener('click', function () {
  console.log('click', navVisible);
  if (navVisible) {
    navVisible = false;
    navPanel.style.bottom = '-240px';
  }
  else {
    navVisible = true;
    navPanel.style.bottom = '0px';
  }
})