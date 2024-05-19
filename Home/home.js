document.querySelector(".open-menu").addEventListener("click", function(event) {
  document.querySelector(".menu").style.width = "100%";
  document.body.style.overflow = "hidden";
});

document.querySelector(".logo-main").addEventListener("click", function(event) {
  document.querySelector(".menu").style.width = "100%";
  document.body.style.overflow = "hidden";
});

document.querySelector(".close-menu").addEventListener("click", function(event) {
  document.querySelector(".menu").style.width = "0";
  document.body.style.overflow = "auto";
});