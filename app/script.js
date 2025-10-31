var map = L.map('map', {
  center: [40.128491,-95.998535],
  zoom: 5,
  minZoom : 5, // set map's min zoom to 5
  maxZoom : 5, // set map's max zoom to 5
});

// Add base layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}.png', {
  maxZoom: 18
}).addTo(map);


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