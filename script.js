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

const uniqueUsername = localStorage.getItem("username");

function checkUsername() {
  if (uniqueUsername != null) {
    window.location.href='/home.html'
  } else {
    console.log("Lancherix");
  }
}

checkUsername();