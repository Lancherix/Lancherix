import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "lancherix-53104.firebaseapp.com",
    projectId: "lancherix-53104",
    storageBucket: "lancherix-53104.appspot.com",
    messagingSenderId: "583309405095",
    appId: "1:583309405095:web:9cb478100805159f46e482"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const uniqueUsername = localStorage.getItem("username");

document.querySelector(".open-menu").addEventListener("click", function() {
    document.querySelector(".menu").style.width = "100%";
});

document.querySelector(".logo-main").addEventListener("click", function() {
    document.querySelector(".menu").style.width = "100%";
});

document.querySelector(".close-menu").addEventListener("click", function() {
    document.querySelector(".menu").style.width = "0";
});

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

        localStorage.setItem('username', username);
    } else {
        console.log("No data available");
        window.location.href = 'Home/home.html'
    }
}).catch((error) => {
    console.error("Error getting username: ", error);
});

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