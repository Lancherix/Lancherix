import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getDatabase, ref, set, get, child, remove } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

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

document.querySelector(".open-menu").addEventListener("click", function(event) {
    document.querySelector(".menu").style.width = "100%";
});

document.querySelector(".logo-main").addEventListener("click", function(event) {
    document.querySelector(".menu").style.width = "100%";
});

document.querySelector(".close-menu").addEventListener("click", function(event) {
    document.querySelector(".menu").style.width = "0";
});

document.querySelector(".close-menu").addEventListener("click", function(event) {
    document.querySelector(".menu").style.width = "0";
});

document.querySelector(".Bold").addEventListener("click", function(event) {
    document.execCommand('bold');
});

document.querySelector(".Italic").addEventListener("click", function(event) {
    document.execCommand('italic');
});

document.querySelector(".Underline").addEventListener("click", function(event) {
    document.execCommand('underline');
});

document.querySelector(".Strikethrough").addEventListener("click", function(event) {
    document.execCommand('strikeThrough');
});

document.querySelector(".Apply").addEventListener("click", function(event) {
    let fontSize = document.getElementById('fontsize').value;

    let selection = window.getSelection();

    if (selection.rangeCount > 0) {
        let range = selection.getRangeAt(0);
        let selectedText = range.extractContents();
        let span = document.createElement('span');
        span.style.fontSize = fontSize + "px";
        span.appendChild(selectedText);
        range.insertNode(span);
    }

    let fontFamily = document.getElementById('fontfamily').value;

    if (selection.rangeCount > 0) {
        let range = selection.getRangeAt(0);
        let selectedText = range.extractContents();
        let span = document.createElement('span');
        span.style.fontFamily = fontFamily;
        span.appendChild(selectedText);
        range.insertNode(span);
    }
});

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


        document.querySelector(".saveNote").addEventListener("click", function(event) {
            const fileName = document.querySelector(".FileName").value;
            const noteContent = document.getElementById('editor').innerHTML;
            const timestamp = new Date().toISOString();

            console.log(uniqueUsername);
            console.log(fileName);

            function checkFileNameAvailability(fileName) {
                const fileNameRef = ref(database, 'users', uniqueUsername, 'notes');
                return get(child(fileNameRef, fileName))
                    .then((snapshot) => {
                        console.log("Snapshot exists:", snapshot.exists());
                        return !snapshot.exists(); // File Name is available if snapshot doesn't exist
                    })
                    .catch((error) => {
                        console.error("Error checking file name availability:", error);
                        return false; // Return false in case of any error
                    });
            }

            if (fileName == "") {
                alert("Type a File Name.");
            } else if (/[.#$\[\]]/.test(fileName)) {
                alert("*Your File Name can't contain '.', '#', '$', '[', or ']'.");
            } else if (fileName.length > 13) {
                alert("*Your File Name is too long.")
            } else {
                checkFileNameAvailability(fileName).then((isAvailable) => {
                    console.log("File name available:", isAvailable);
                    if (!isAvailable) {
                        alert("You have already used this File Name, use a different one.");
                    } else {
                        set(ref(database, "users/" + uniqueUsername + "/notes/" + fileName), {
                            title: fileName,
                            content: noteContent,
                            timestamp: timestamp
                        }).then(() => {
                            console.log("User data saved successfully");
                            alert("Saving your note...");
                        }).catch((error) => {
                            console.error("Error saving user data:", error);
                            alert("Error saving your data");
                        });
                    }
                }).catch((error) => {
                    console.error("Error checking file name availability:", error);
                    alert("Error checking file name availability");
                });
            }
        });

        function displayNotes() {
            const notesRef = ref(database, 'users/' + uniqueUsername + '/notes');
            get(notesRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const notesData = snapshot.val();
                    const notesContainer = document.querySelector(".all-notes");

                    notesContainer.innerHTML = ""; // Clear the notes container

                    const notesArray = Object.entries(notesData).map(([key, value]) => {
                        return { key, ...value };
                    });

                    notesArray.sort((a, b) => {
                        return new Date(b.timestamp) - new Date(a.timestamp);
                    });

                    for (const note of notesArray) {
                        const noteElement = document.createElement("div");
                        noteElement.classList.add("a-note");

                        noteElement.innerHTML = `
                            <div class="note-info">
                                <h3 class="note-name">${note.title}</h3>
                                <p class="note-history">${formatTimestamp(note.timestamp)}</p>
                            </div>
                        `;

                        function formatTimestamp(timestamp) {
                            const date = new Date(timestamp);
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const day = String(date.getDate()).padStart(2, '0');
                            const hours = String(date.getHours()).padStart(2, '0');
                            const minutes = String(date.getMinutes()).padStart(2, '0');
                            return `${month}/${day}/${year} at ${hours}:${minutes}`;
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

        // Function to load note content into editor
        function loadNoteIntoEditor(note) {
            document.querySelector(".FileName").value = note.title;
            document.getElementById('editor').innerHTML = note.content;
        }

        document.querySelector(".Delete").addEventListener("click", function(event) {
            const fileName = document.querySelector(".FileName").value;
            if (fileName == "") {
                alert("No file selected.");
            } else {
                const noteRef = ref(database, 'users/' + uniqueUsername + '/notes/' + fileName);
                remove(noteRef).then(() => {
                    console.log("Note deleted successfully");
                    alert("Note deleted successfully");
                    displayNotes();
                    location.reload();
                }).catch((error) => {
                    console.error("Error deleting note: ", error);
                    alert("Error deleting note");
                });
            }
        });

        // Display notes on page load
        displayNotes();

    } else {
        console.log("No data available");
        window.location.href = 'https://www.lancherix.com/'
    }
}).catch((error) => {
    console.error("Error getting username: ", error);
});