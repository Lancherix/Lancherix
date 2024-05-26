// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

document.getElementById("submit").addEventListener("click", async function(event) {
  event.preventDefault();

  const username = document.querySelector(".username").value;
  const password = document.querySelector(".password").value;

  let invalidItem = document.querySelector(".invalidItem");
  let invalidEmail = document.querySelector(".invalidEmail");

  if (username === "") {
    invalidEmail.innerHTML = "*Type your username.";
  } else {
    invalidEmail.innerHTML = "";
  }

  if (password === "") {
    invalidItem.innerHTML = "*Type your password.";
    return;
  }

  const usernameRef = ref(database, 'users/' + username);

  try {
    const snapshot = await get(usernameRef);

    if (snapshot.exists()) {
      const userData = snapshot.val();
      const email = userData.email;

      localStorage.setItem('username', username);
      localStorage.setItem('email', email);

      await signInWithEmailAndPassword(auth, email, password);

      window.location.href = "https://www.lancherix.com/home.html";
    } else {
      invalidItem.innerHTML = "*Wrong password or username, try again.";
    }
  } catch (error) {
    console.error("Error during sign-in:", error);
    invalidItem.innerHTML = "*Wrong password or username, try again.";
  }
});