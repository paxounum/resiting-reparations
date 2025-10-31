// This isn't necessary but it keeps the editor from thinking L and carto are typos
/* global L, carto */

//COLOR VOCAB
/* 
  --owhite: #f0f4f4;
  --gold: #bb8b41;
  --green: #a2a95a;
  --dgreen: #688773;
  --blue: #4a82ad;
  --red: #c27c69;
  --purple: #8071b2;
  --gray: #535e5e;
*/

var map = L.map("map", {
  center: [42.044512, -87.691927],
  zoom: 14
});

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


// Collective Cartography Data
// Initialze CC data source
var collectiveSource = new carto.source.SQL("SELECT * FROM cc_barriers_all");

// Create style for the data
var collectiveStyle = new carto.style.CartoCSS(`
 #layer {
  line-width: 5;
  line-color: ramp([layer], (#a2a95a, #c27c69, #535e5e, #4a82ad, #8071b2, #8071b2), 
  ("Beach Access: Equity Optional", "Gates of Heavenston", "Wall of Segre-Separation", "Evanston Rio Grande", "Northwestern"), "=");
}
`);

//Add syle to Line data
var collectiveLayer = new carto.layer.Layer(collectiveSource, collectiveStyle);

//Community Harm Point Data
var pointSource = new carto.source.SQL("SELECT * FROM cc_barriers_points");

//Point Style
var pointStyle = new carto.style.CartoCSS(`
#layer {
  marker-width: 30;
  marker-fill: #000000;
  marker-fill-opacity: 1;
  marker-file: url('https://cdn.glitch.com/84dbdb18-88ef-4a1c-bddc-c150d9548773%2Feyelines.svg');
  marker-allow-overlap: true;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}
`);

// Add style to the Point data
var pointLayer = new carto.layer.Layer(pointSource, pointStyle, { 
                featureClickColumns: ['title', 'definition', 'story']}
                                      );

//HOLC Data Source
var holcSource = new carto.source.SQL("SELECT * FROM holc_evanston_only");

//HOLC Data Style
var holcStyle = new carto.style.CartoCSS(`
#layer {
  polygon-fill: ramp([holc_grade], (#e4d364, #4982ad, #a2a95a, #c27c69, #B3B3B3), ("C", "B", "A", "D"), "=");
  polygon-opacity: 0.4;
}
#layer::outline {
  line-width: 0;
  line-color: #FFFFFF;
  line-opacity: 0.5;
}
`);

//HOLC Data Layer
var holcLayer = new carto.layer.Layer(holcSource, holcStyle, { 
                featureClickColumns: ['holc_grade']}
                                      );

//Physcial Data Source
var physicalSource = new carto.source.SQL("SELECT * FROM physical_barriers_combo");

//Physcial Data Style
var physicalStyle = new carto.style.CartoCSS(`
#layer {
  polygon-fill: ramp([layer], (#91761d, #166e8e, #B3B3B3), ("Rails_Poly", "North Branch Channel"), "=");
}
#layer::outline {
  line-width: ramp([layer], (2, 0, 0), ("Rails_Poly", "North Branch Channel"), "=");
  line-color: ramp([layer], (#91761d, #166e8e, #B3B3B3), ("Rails_Poly", "North Branch Channel"), "=");
  line-opacity: 1;
}
#layer::labels {
  text-name: [name];
  text-face-name: 'DejaVu Sans Book';
  text-size: 10;
  text-fill: #000000;
  text-label-position-tolerance: 0;
  text-halo-radius: 1;
  text-halo-fill: #ffffff;
  text-dy: -10;
  text-allow-overlap: true;
  text-placement: point;
  text-placement-type: dummy;
}
`);

//Physcial Data Layer
var physicalLayer = new carto.layer.Layer(physicalSource, physicalStyle, { 
                featureClickColumns: ['name']}
                                      );

//Zones Data Source
var zonesSource = new carto.source.SQL("SELECT * FROM zones_ruic_simple");

//Zones Data Style
var zonesStyle = new carto.style.CartoCSS(`
#layer {
  polygon-fill: ramp([zone], (#ead96e, #71c1f6, #6eb147, #a0bf49, #c5995f, #afa5e1, #b3b3b3), ("R3_5", "C", "R1", "R2", "I", "U"), "=");
  polygon-opacity: 0.7;
}
#layer::outline {
  line-width: 1;
  line-color: #ffffff;
  line-opacity: 0;
}
`);

//Zones Data Layer
var zonesLayer = new carto.layer.Layer(zonesSource, zonesStyle, { 
                featureClickColumns: ['zone']}
                                      );

// Adding a Click Feature to show data in Legend
var legend = document.querySelector('.legend-content');
pointLayer.on('featureClicked', function (event) {
  // Create the HTML that will go in the sidebar. event.data has all the data for 
  // the clicked feature.
  // I will add the content line-by-line here to make it a little easier to read.

  var content = '<div style="padding-top: 10px; border-top: double black 3px"></div>'
  content += '<h3>' + event.data['title'] + '</h3>'
  content += '<h6>Barrier Definition</h6>' + '<p>' + event.data['definition'] + '</p>'
  content += '<h6>Cartography Story</h6>' + '<p>' + event.data['story'] + '</p>'
  
  // Then put the HTML inside the sidebar. Once you click on a feature, the HTML
  // for the sidebar will change.
  legend.innerHTML = content;
  console.log("Clicked");
});

//Additional Geographies Checkboxes

function handleCheckboxChange() {
 
  console.log('Collective Cartography', collectiveCheckbox.checked);
  console.log('HOLC', holcCheckbox.checked);
  console.log('Physical Boundaries', physicalCheckbox.checked);
  console.log('Zones', zonesCheckbox.checked);
  
  if (collectiveCheckbox.checked){ 
  collectiveLayer.show();
  pointLayer.show();
  }
  else { 
  collectiveLayer.hide();
  pointLayer.hide();
  }
  
  if (holcCheckbox.checked){ 
  holcLayer.show()
  }
  else { 
  holcLayer.hide()
  }
  
  if (physicalCheckbox.checked){ 
  physicalLayer.show()
  }
  else { 
  physicalLayer.hide()
  }
  
  if (zonesCheckbox.checked){ 
  zonesLayer.show()
  }
  else { 
  zonesLayer.hide()
  }
}

var collectiveCheckbox = document.querySelector('.collective-check');

collectiveCheckbox.addEventListener('change', function () {
  handleCheckboxChange();
});

var holcCheckbox = document.querySelector('.holc-check');

holcCheckbox.addEventListener('change', function () {
  handleCheckboxChange();
});

var physicalCheckbox = document.querySelector('.physical-check');

physicalCheckbox.addEventListener('change', function () {
  handleCheckboxChange();
});

var zonesCheckbox = document.querySelector('.zones-check');

zonesCheckbox.addEventListener('change', function () {
  handleCheckboxChange();
}); 

// Add the data to the map as a layer
client.addLayers([zonesLayer, holcLayer, physicalLayer, collectiveLayer, pointLayer]);
client.getLeafletLayer().addTo(map);
collectiveCheckbox.checked = true;
zonesLayer.hide();
holcLayer.hide();
physicalLayer.hide();

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

/*ABOUT */

var about = document.getElementById("about");

// Get the button that opens the modal
var btn = document.getElementById("page-block");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  about.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  about.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == about) {
    about.style.display = "none";
  }
};
