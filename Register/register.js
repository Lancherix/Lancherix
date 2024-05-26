// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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
const auth = getAuth(app);
const database = getDatabase(app);

document.getElementById("register").addEventListener("click", function(event) {
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

  const email = document.querySelector(".email").value;
  const firstname = document.querySelector(".name").value;
  const lastname = document.querySelector(".lastname").value;
  const month = document.getElementById("month").value;
  const date = document.getElementById("date").value;
  const year = document.getElementById("year").value;
  const gender = document.getElementById("gender").value;
  const username = document.querySelector(".username").value;
  const password = document.querySelector(".password").value;
  const password2 = document.querySelector(".password2").value;

  localStorage.setItem("username", username);

  // Clear previous error messages
  const errorElements = document.querySelectorAll(".invalid");
  errorElements.forEach((element) => {
    element.innerHTML = "";
  });

  // Validation
  let isValid = true;

  if (email == "") {
    invalidEmail.innerHTML = "*Type your email.";
    isValid = false;
  } else if (!validateEmail(email)) {
    invalidEmail.innerHTML = "*Invalid email, try again.";
    isValid = false;
  } else {
    invalidEmail.innerHTML = "";
  }

  if (firstname == "") {
    invalidName.innerHTML = "*Type your name.";
    isValid = false;
  } else {
    invalidName.innerHTML = "";
  }

  if (month == "select-month" || date == "select-date" || year == "select-year") {
    invalidBirthDate.innerHTML = "*Enter your complete Birth date.";
    isValid = false;
  } else {
    invalidBirthDate.innerHTML = "";
  }

  if (gender == "select-gender") {
    invalidGender.innerHTML = "*Enter your gender.";
    isValid = false;
  } else {
    invalidGender.innerHTML = "";
  }

  if (password == "") {
    invalidPassword1.innerHTML = "*Type a password.";
    isValid = false;
  } else if (password.length < 6) {
    invalidPassword1.innerHTML = "*Your password should have at least 6 characters.";
    isValid = false;
  } else {
    invalidPassword1.innerHTML = "";
  }

  if (password2 == "" && password != "") {
    invalidPassword2.innerHTML = "*Repeat your password.";
    isValid = false;
  } else if (password2 !== password) {
    invalidPassword2.innerHTML = "*Your passwords should be equal.";
    isValid = false;
  } else {
    invalidPassword2.innerHTML = "";
  }

  // Add similar validations for other fields...

  if (!isValid) {
    // If any field is invalid, stop further processing
    return;
  }

  function checkUsernameAvailability(username) {
    const usernamesRef = ref(database, 'users');
    return get(child(usernamesRef, username))
      .then((snapshot) => {
        return !snapshot.exists(); // Username is available if snapshot doesn't exist
      })
      .catch((error) => {
        console.error("Error checking username availability:", error);
        return false; // Return false in case of any error
      });
  }

  if (username == "") {
    invalidUsername.innerHTML = "*Type a username.";
    isValid = false;
  } else if (username.length > 20) {
    invalidUsername.innerHTML = "*Your username is too long.";
    isValid = false;
  } else if (!/^[a-z0-9,_-]+$/.test(username)) {
    invalidUsername.innerHTML = "*Your username can only contain lowercase letters, numbers, ',', '-', or '_'.";
    isValid = false;
  } else {
    checkUsernameAvailability(username).then((isAvailable) => {
      if (!isAvailable) {
        invalidUsername.innerHTML = "*This username is already taken.";
        isValid = false;
      } else {
        invalidUsername.innerHTML = "";
        console.log("It is avilable!")
        set(ref(database, "users/" + username), {
          email: email,
          firstname: firstname,
          lastname: lastname,
          month: month,
          date: date,
          year: year,
          gender: gender,
          username: username,
          lastLogin: Date.now(),
          bio: "(Share your bio with the world)",
          links: "(Share a link with the world)",
          phone: "(Share your phone number)",
          country: "(Share the country you come from or live in)",
          ImageURL: "https://t3.ftcdn.net/jpg/03/58/90/78/360_F_358907879_Vdu96gF4XVhjCZxN2kCG0THTsSQi8IhT.jpg"
        }).then(() => {
          console.log("User data saved successfully");
          alert("Saving your data...");
        }).catch((error) => {
          console.error("Error saving user data:", error);
          alert("Error saving your data");
        });

        // All fields are valid, proceed with user registration
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;

            alert("Creating account...");
            window.location.href = "http://www.lancherix.com/home.html";
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            if (errorMessage == "Firebase: Error (auth/email-already-in-use).") {
              invalidPassword2.innerHTML = "Email is already in use, try a new one.";
            } else {
              invalidPassword2.innerHTML = "";
            }
          });
      }
    });
  }
});

// Function to validate email
function validateEmail(email) {
  const expression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return expression.test(email);
}