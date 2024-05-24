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
const uniqueEmail = localStorage.getItem("email");

// Retrieve the username from Firebase Realtime Database
const usernameRef = ref(database, 'users/' + uniqueUsername);
get(usernameRef).then((snapshot) => {
    if (snapshot.exists()) {

        let profilePicture = document.querySelector(".profile-picture");
        let fullName = document.querySelector(".full-name");
        let usernameText = document.querySelector(".username-text");
      
        const userData = snapshot.val();
        const username = userData.username;
        const imgURL = userData.ImageURL;

        profilePicture.src = imgURL;
        
        fullName.innerHTML = userData.firstname + " " + userData.lastname;
        usernameText.innerHTML = "@" + userData.username;
      
        // Save the username to local storage
        localStorage.setItem('username', username);

        function displayNotes() {
            const notesRef = ref(database, 'users/' + uniqueUsername + '/notes');
            get(notesRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const notesData = snapshot.val();
                    const notesContainer = document.querySelector(".activities");

                    notesContainer.innerHTML = ""; // Clear the notes container

                    const notesArray = Object.entries(notesData).map(([key, value]) => {
                        return { key, ...value };
                    });

                    notesArray.sort((a, b) => {
                        return new Date(b.timestamp) - new Date(a.timestamp);
                    });

                    for (const note of notesArray) {
                        const noteElement = document.createElement("div");
                        noteElement.classList.add("an-activity");

                        noteElement.innerHTML = `
                            <button class="activity-btn" onclick="window.location.href='Notes/notes.html'"><img src="Images/NotesLogo.png"
                                alt="logo-word" class="logo-activity">
                              <div class="activity-text">
                                <h3 class="activity-title">${note.title}</h3>
                                <p class="activity-description">${formatTimestamp(note.timestamp)}</p>
                              </div>
                            </button>
                        `;

                        function formatTimestamp(timestamp) {
                            const date = new Date(timestamp);
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const day = String(date.getDate()).padStart(2, '0');
                            const hours = String(date.getHours()).padStart(2, '0');
                            const minutes = String(date.getMinutes()).padStart(2, '0');
                            return `Last edited the ${month}/${day}/${year} at ${hours}:${minutes}`;
                        }

                        noteElement.addEventListener("click", function() {
                            loadNoteIntoEditor(note);
                        });

                        notesContainer.appendChild(noteElement);
                    }
                } else {
                    console.log("No notes available");
                }
            }).catch((error) => {
                console.error("Error getting notes: ", error);
            });
        }

        displayNotes();
      
    } else {
        console.log("No data available");
        window.location.href='Home/home.html'
    }
}).catch((error) => {
    console.error("Error getting username: ", error);
});

document.querySelector(".open-menu").addEventListener("click", function(event) {
  document.querySelector(".menu").style.width = "100%";
});

document.querySelector(".logo-main").addEventListener("click", function(event) {
  document.querySelector(".menu").style.width = "100%";
});

document.querySelector(".close-menu").addEventListener("click", function(event) {
  document.querySelector(".menu").style.width = "0";
});

function displayTime() {
  let d = new Date();
  let hour = d.getHours();
  let min = d.getMinutes();
  let amOrPm = "AM";
  if(hour >= 12)
  {
    amOrPm = "PM";
  }
  if(hour > 12)
  {
    hour = hour - 12;
  }
  if(min < 10)
    min = "0" + min;
  document.getElementById("clock").innerHTML = hour + ":" + min + " " + amOrPm;
}

setInterval(displayTime, 1000);

function displayDate() {
  const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  let d = new Date();
  let monthNum = d.getMonth();
  let date = d.getDate();
  let year = d.getFullYear();

  document.getElementById("date").innerHTML = month[monthNum] + " " + date + ", " + year;
}

setInterval(displayDate, 1000);

document.addEventListener('DOMContentLoaded', () => {
  const monthYearElement = document.getElementById('month-year');
  const calendarLogo = document.querySelector(".calendar-logo");
  const daysElement = document.getElementById('days');
  const prevButton = document.getElementById('prev');
  const nextButton = document.getElementById('next');
  const selectedDateElement = document.querySelector('.selected-date');

  let currentDate = new Date();

  function renderCalendar(date) {
      const year = date.getFullYear();
      const month = date.getMonth();
      const today = new Date();

      const firstDayOfMonth = new Date(year, month, 1).getDay();
      const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
      const lastDayOfMonth = new Date(year, month, lastDateOfMonth).getDay();

      const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
      ];

      monthYearElement.innerHTML = `<p class="monthName">${monthNames[month]}</p><p class="yearName">${year}</p>`;

      daysElement.innerHTML = '';

      for (let i = 0; i < firstDayOfMonth; i++) {
          daysElement.innerHTML += '<div></div>';
      }

      for (let i = 1; i <= lastDateOfMonth; i++) {
          const dayElement = document.createElement('div');
          dayElement.textContent = i;
          dayElement.classList.add('calendar-day');

          const dayOfWeek = new Date(year, month, i).getDay();
          if (dayOfWeek === 0 || dayOfWeek === 6) {
              dayElement.classList.add('weekend');
          }

          if (year === today.getFullYear() && month === today.getMonth() && i === today.getDate()) {
              dayElement.classList.add('today');
          }

          daysElement.appendChild(dayElement);
      }

      for (let i = lastDayOfMonth + 1; i <= 6; i++) {
          daysElement.innerHTML += '<div></div>';
      }
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function displaySelectedDate(date, dayName) {
      const dateString = `${dayName} ${date.getDate()}`;
      selectedDateElement.textContent = dateString;
  }

  prevButton.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar(currentDate);
  });

  nextButton.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar(currentDate);
  });

  daysElement.addEventListener('click', (event) => {
      const clickedElement = event.target;
      if (clickedElement.classList.contains('calendar-day')) {
          const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), parseInt(clickedElement.textContent));
          document.querySelectorAll('.calendar-day.selected').forEach(element => {
              element.classList.remove('selected');
          });
          clickedElement.classList.add('selected');

          calendarLogo.innerHTML = `<p class="weekName">${dayNames[selectedDate.getDay()]}</p><p class="dateNumber">${selectedDate.getDate()}</p>`;
          console.log("Hello Isa");
      }
  });

  renderCalendar(currentDate);
});