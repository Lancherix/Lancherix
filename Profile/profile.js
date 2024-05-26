import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

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

const uniqueUsername = localStorage.getItem("username");
const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const usernameRef = ref(database, 'users/' + uniqueUsername);
get(usernameRef).then((snapshot) => {
    if (snapshot.exists()) {

        let profilePicture = document.querySelector(".profile-picture");
        let nameI = document.querySelector(".name");
        let usernameI = document.querySelector(".username");
        let emailI = document.querySelector(".email");
        let birthdateI = document.querySelector(".birthdate");
        let genderI = document.querySelector(".gender");
        let bioI = document.querySelector(".bio");
        let linksI = document.querySelector(".links");
        let phoneI = document.querySelector(".phone");
        let countryI = document.querySelector(".country");

        const userData = snapshot.val();
        const username = userData.username;
        const imgURL = userData.ImageURL;

        profilePicture.src = imgURL;
        
        const name = userData.firstname + " " + userData.lastname;
        const usernameData = "@" + username;
        const email = userData.email;
        const birthdate = month[userData.month] + " " + userData.date + ", " + userData.year;
        const gender = userData.gender;
        const bio = userData.bio;
        const links = userData.links;
        const phone = userData.phone;
        const country = userData.country;
        
        nameI.innerHTML = name;
        usernameI.innerHTML = usernameData;
        emailI.innerHTML = email;
        birthdateI.innerHTML = birthdate;
        genderI.innerHTML = gender;
        bioI.innerHTML = bio;
        linksI.innerHTML = links;
        linksI.href = links;
        phoneI.innerHTML = phone;
        countryI.innerHTML = country;

        // Save the username to local storage
        localStorage.setItem('username', username);
    } else {
        console.log("No data available");
        window.location.href='https://www.lancherix.com/'
    }
}).catch((error) => {
    console.error("Error getting username: ", error);
    window.location.href='https://www.lancherix.com/'
});