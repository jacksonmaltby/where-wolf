// Get the modal
var modal = document.getElementById("welcomeModal");

// Get the close button
var closeBtn = document.getElementsByClassName("close")[0];

// When the page is loaded, show the modal
window.onload = function() {
  modal.style.display = "block";
}

// When the user clicks on the close button, hide the modal
closeBtn.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, hide the modal
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
