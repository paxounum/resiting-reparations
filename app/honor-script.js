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