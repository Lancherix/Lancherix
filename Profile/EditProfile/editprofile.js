import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCQSHcf3H3a9mQ1o7Fl0HY_jQW_mXsLkPE",
  AIzaSyCQSHcf3H3a9mQ1o7Fl0HY_jQW_mXsLkPEauthDomain: "lancherix-53104.firebaseapp.com",
  projectId: "lancherix-53104",
  storageBucket: "lancherix-53104.appspot.com",
  messagingSenderId: "583309405095",
  appId: "1:583309405095:web:9cb478100805159f46e482"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

const uniqueUsername = localStorage.getItem("username");
console.log(uniqueUsername);

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

let profilePicture = document.querySelector(".profile-picture");
let nameI = document.querySelector(".name");
let usernameI = document.querySelector(".username");
let emailI = document.querySelector(".email");
let birthdateI = document.querySelector(".birthdate");
let genderI = document.querySelector(".gender");
let bioI = document.querySelector(".bio");
let linksI = document.querySelector(".links");
let phoneI = document.querySelector(".phoneNumber");
let countryI = document.querySelector(".country");

const usernameRef = ref(database, 'users/' + uniqueUsername);
get(usernameRef).then((snapshot) => {
  if (snapshot.exists()) {

    const userData = snapshot.val();
    const username = userData.username;

    const name = userData.firstname + " " + userData.lastname;
    const usernameData = "@" + username;
    const email = userData.email;
    const birthdate = month[userData.month] + " " + userData.date + ", " + userData.year;
    const gender = userData.gender;

    nameI.innerHTML = name;
    usernameI.innerHTML = usernameData;
    emailI.innerHTML = email;
    birthdateI.innerHTML = birthdate;
    genderI.value = gender;
    bioI.value = userData.bio;
    linksI.value = userData.links;
    phoneI.value = userData.phone;
    countryI.value = userData.country;

    const firstname = userData.firstname;
    const lastname = userData.lastname;
    let myMonth = userData.month;
    const date = userData.date;
    const year = userData.year;
    let profileURL = userData.ImageURL;

    profilePicture.src = profileURL;
    
    localStorage.setItem("firstname", firstname);
    localStorage.setItem("lastname", lastname);
    localStorage.setItem("month", myMonth);
    localStorage.setItem("date", date);
    localStorage.setItem("year", year);
    

    console.log("User Data:", userData);

    document.getElementById("profilePictureInput").addEventListener("change", function(event) {
      const file = event.target.files[0];
      handleProfilePictureInput(file, userData);
    });

    function handleProfilePictureInput(file) {
      if (file) {
        const reader = new FileReader();
        reader.onload = function() {
          const imageDataUrl = reader.result;

          const image = new Image();
          image.onload = function() {
            if (image.width === image.height) {
              const imgURL = reader.result; // Save the image data URL as profile URL
              // Update user data with the new profile URL
              userData.ImageURL = imgURL;
              console.log(imgURL);
              localStorage.setItem("ImageURL", imgURL); // Also update local storage if needed
              profileURL = imgURL
            } else {
              alert('Please select a square image.');
            }
          };
          image.src = imageDataUrl;
        };
        reader.readAsDataURL(file);
      } else {
        console.error('No file selected');
      }
    }

    document.getElementById("profilePictureInput").addEventListener("change", function(event) {
      const file = event.target.files[0];
      handleProfilePictureInput(file);
    });

    const myFirstname = localStorage.getItem("firstname");
    const myLastname = localStorage.getItem("lastname");
    myMonth = localStorage.getItem("month");
    const myDate = localStorage.getItem("date");
    const myYear = localStorage.getItem("year");

    console.log(myFirstname + myLastname + myMonth + myDate + myYear);

    document.getElementById("save-changes").addEventListener("click", function(event) {
      console.log("Button clicked"); // Check if the event listener is triggered
      event.preventDefault();

      let invalidEmail = document.querySelector(".invalidEmail");
      let invalidName = document.querySelector(".noName");
      let invalidLastName = document.querySelector(".noLastName");
      let invalidBirthDate = document.querySelector(".invalidBirthDate");
      let invalidGender = document.querySelector(".invalidGender");
      let invalidUsername = document.querySelector(".invalidUsername");
      let invalidPassword1 = document.querySelector(".invalidPassword1");
      let invalidPassword2 = document.querySelector(".invalidPassword2");

      const email = emailI.innerHTML;
      // const firstname = document.querySelector(".name").value;
      // const lastname = document.querySelector(".lastname").value;
      // const month = document.getElementById("month").value;
      // const date = document.getElementById("date").value;
      // const year = document.getElementById("year").value;
      const gender = genderI.value;
      // const username = document.querySelector(".username").value;
      // const password = document.querySelector(".password").value;
      // const password2 = document.querySelector(".password2").value;

      // Clear previous error messages
      const errorElements = document.querySelectorAll(".invalid");
      errorElements.forEach((element) => {
        element.innerHTML = "";
      });

      // Validation
      let isValid = true;


      if (gender == "select-gender") {
        isValid = false;
      } else {

      }

      // Add similar validations for other fields...

      if (!isValid) {
        // If any field is invalid, stop further processing
        return;
      }

      let bio = bioI.value;
      let links = linksI.value;
      let phone = phoneI.value;
      let country = countryI.value;

      console.log("It is available!")
      set(ref(database, "users/" + uniqueUsername), {
        email: email,
        firstname: myFirstname,
        lastname: myLastname,
        month: myMonth,
        date: myDate,
        year: myYear,
        gender: gender,
        username: uniqueUsername,
        bio: bio,
        links: links,
        phone: phone,
        country: country,
        ImageURL: profileURL
      }).then(() => {
        console.log("User data saved successfully");
        alert("Saving your data...");
        location.reload();
      }).catch((error) => {
        console.error("Error saving user data:", error);
        alert("Error saving your data");
      });
    });

  } else {
    console.log("No data available");
    window.location.href = 'https://www.lancherix.com/'
  }
}).catch((error) => {
  console.error("Error getting username: ", error);
  window.location.href='https://www.lancherix.com/'
});