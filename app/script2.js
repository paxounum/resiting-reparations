// This isn't necessary but it keeps the editor from thinking L and carto are typos
/* global L, carto */

//Calling the National Cosponsors Map Variable

var natl_rep = L.map("natl_rep", {
  center: [39.481434, -97.593373],
  zoom: 4
});

// Adding basemap from Carto

L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png",
  {
    maxZoom: 18
  }
).addTo(natl_rep);

// Initializing Carto

var client = new carto.Client({
  apiKey: "default_public",
  username: "browj934"
});

// HR40 Sponsor Layer

// Initialze data source
var sponsorSource = new carto.source.SQL(
  "SELECT * FROM browj934.hr_40_sponsors_116th_congress WHERE sponsor = 'yes'"
);

// Create style for the data
var sponsorStyle = new carto.style.CartoCSS(`
  #layer {
  polygon-fill: #a2a95a;
  polygon-opacity: 0.7;
}
#layer::outline {
  line-width: 0.5;
  line-color: #a2a95a;
  line-opacity: 0.1;
}
`);

// Creating Sponsor Layer
var sponsorLayer = new carto.layer.Layer(sponsorSource, sponsorStyle);

//Blackest Cities Layer

//Adding Resolute Cities Data
var citySource = new carto.source.SQL(
  "SELECT * FROM browj934.americas_blackest_cities_2"
);

//Stying City Data
var cityStyle = new carto.style.CartoCSS(`
#layer [percent_black >= 12]{
  
  [zoom < 6]{
    marker-width: 7
  }
    [zoom >= 6]{
    marker-width: ramp([metro_black_population], range(10, 35), equal(5))}
  
  marker-fill: ramp([percent_black], (#cdb30c, #62760c, #535204, #523906, #672044), quantiles);
  marker-fill-opacity: 0.7;
  marker-allow-overlap: true;
  marker-line-width: 0;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}
#layer::labels [percent_black >= 12]{
  text-name:[city];
    [zoom > 6]{
    text-name: [metropolitan_area]}
  text-face-name: 'Lato Regular';
  text-size: 10;
  [percent_black > 24]{
  text-size: 13;
  text-face-name: 'Lato Bold';
  }
  text-fill: #373737;
  text-label-position-tolerance: 0;
  text-halo-radius: 0;
  text-halo-fill: #6F808D;
  text-dy: -10;
  text-allow-overlap: false;
  [zoom > 7]{
    text-allow-overlap: true}
  text-placement: point;
  text-placement-type: dummy;
}
`);

//Creating City Layer
var cityLayer = new carto.layer.Layer(citySource, cityStyle);

//Adding Trump Dataset
var trumpSource = new carto.source.SQL(
  "SELECT * FROM browj934.cong_dist_black_pop_vote_small WHERE vote_trump > 60 "
);

//Styling Trump Data
var trumpInvisible = new carto.style.CartoCSS(`
  #layer {
  polygon-fill: #c27c69;
  polygon-opacity: 0;
  }
  `);

var trumpVisible =  new carto.style.CartoCSS(`
  #layer {
  polygon-fill: #c27c69;
  polygon-opacity: 0.5;
  }
  `);

var trumpLayer = new carto.layer.Layer(trumpSource, trumpInvisible)

// Adding Sponsor Layer to Map
client.addLayers([trumpLayer, sponsorLayer, cityLayer]);
client.getLeafletLayer().addTo(natl_rep);



// Adding Layer Selector Buttons

/*
 * Listen for changes on the layer picker
 */

//Sponsor Button
// Step 1: Find the button by its class. If you are using a different class, change this.
var sponsorButton = document.querySelector(".sponsor-button");

// Step 2: Add an event listener to the button. We will run some code whenever the button is clicked.
sponsorButton.addEventListener("click", function(e) {
  sponsorSource.setQuery(
    "SELECT * FROM browj934.hr_40_sponsors_116th_congress WHERE state IN ('IL', 'CA', 'NY', 'MA', 'RI','NC') and sponsor = 'yes'"
  );

  // Sometimes it helps to log messages, here we log to let us know the button was clicked. You can see this if you open developer tools and look at the console.
  console.log("Sponsor was clicked");
});

//Optional Trump Turf Button

// Connecting Trump Button
var trumpButton = document.querySelector(".trump-button");
trumpButton.addEventListener ("click", function(e) {
  trumpLayer = new carto.layer.Layer(trumpSource, trumpVisible);
  client.addLayer(trumpLayer);
  client.getLeafletLayer().addTo(natl_rep);
  console.log("Trump was clicked.")
})

//This button ACCUMULATES on succesive clicks. I know why, but not how to fix it.

var resetButton = document.querySelector(".reset-button");

resetButton.addEventListener("click", function(e) {
  sponsorSource.setQuery("SELECT * FROM browj934.hr_40_sponsors_116th_congress WHERE sponsor = 'yes'");
  trumpLayer = new carto.layer.Layer(trumpSource, trumpInvisible);
  client.addLayers([trumpLayer, sponsorLayer, cityLayer]);
  client.getLeafletLayer().addTo(natl_rep);
  console.log("Reset was clicked.")
})
                      