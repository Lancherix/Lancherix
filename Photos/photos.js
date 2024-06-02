import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getDatabase, ref, set, get, child, remove } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyCQSHcf3H3a9mQ1o7Fl0HY_jQW_mXsLkPE",
    AIzaSyCQSHcf3H3a9mQ1o7Fl0HY_jQW_mXsLkPEauthDomain: "lancherix-53104.firebaseapp.com",
    projectId: "lancherix-53104",
    storageBucket: "lancherix-53104.appspot.com",
    messagingSenderId: "583309405095",
    appId: "1:583309405095:web:9cb478100805159f46e482"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

const uniqueUsername = localStorage.getItem("username");
const uniqueEmail = localStorage.getItem("email");

document.querySelector(".open-menu").addEventListener("click", function (event) {
    document.querySelector(".menu").style.width = "100%";
});

document.querySelector(".logo-main").addEventListener("click", function (event) {
    document.querySelector(".menu").style.width = "100%";
});

document.querySelector(".close-menu").addEventListener("click", function (event) {
    document.querySelector(".menu").style.width = "0";
});

document.querySelector(".close-menu").addEventListener("click", function (event) {
    document.querySelector(".menu").style.width = "0";
});

const usernameRef = ref(database, 'users/' + uniqueUsername);
get(usernameRef).then((snapshot) => {
    if (snapshot.exists()) {

        let thePicture = document.querySelector(".profile-picture");
        let fullName = document.querySelector(".full-name");
        let usernameText = document.querySelector(".username-text");

        const userData = snapshot.val();
        const username = userData.username;
        const imgURL = userData.ImageURL;
        let pictureURL = userData.ImageURL;

        thePicture.src = imgURL;

        fullName.innerHTML = userData.firstname + " " + userData.lastname;
        usernameText.innerHTML = "@" + userData.username;

        localStorage.setItem('username', username);

        document.getElementById("pictureInput").addEventListener("change", function (event) {
            const file = event.target.files[0];
            handlePictureInput(file, userData);
        });

        function handlePictureInput(file) {
            if (file) {
                const reader = new FileReader();
                reader.onload = function () {
                    const imageDataUrl = reader.result;

                    const image = new Image();
                    image.onload = function () {
                        const imgURL = reader.result;
                        userData.ImageURL = imgURL;
                        console.log(imgURL);
                        localStorage.setItem("ImageURL", imgURL);
                        pictureURL = imgURL
                    };
                    image.src = imageDataUrl;
                };
                reader.readAsDataURL(file);
            } else {
                console.error('No file selected');
            }
        }

        document.getElementById("pictureInput").addEventListener("change", function (event) {
            const file = event.target.files[0];
            handlePictureInput(file);
        });

        document.querySelector(".uploadImage").addEventListener("click", function (event) {
            const pictureName = document.querySelector(".pictureName").value;
            if (!pictureName) {
                alert("Please provide a name for the picture.");
                return;
            } else if (/[.#$\[\]]/.test(pictureName)) {
                alert("*Your Picture Name can't contain '.', '#', '$', '[', or ']'.");
                return;
            };

            const userPhotosRef = ref(database, `users/${uniqueUsername}/photos/${pictureName}`);
            const fileInput = document.getElementById("pictureInput");
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const storageReference = storageRef(storage, `users/${uniqueUsername}/photos/${pictureName}`);

                uploadBytes(storageReference, file).then((snapshot) => {
                    return getDownloadURL(snapshot.ref);
                }).then((downloadURL) => {
                    const currentDate = new Date().toISOString();
                    const imageData = {
                        ImageURL: downloadURL,
                        UploadDate: currentDate
                    };
                    set(userPhotosRef, imageData)
                        .then(() => {
                            alert("Saving your data...");
                            location.reload();
                        })
                        .catch((error) => {
                            console.error("Error saving user data:", error);
                            alert("Error saving your data");
                        });
                }).catch((error) => {
                    console.error("Error uploading file:", error);
                    alert("Error uploading your file");
                });
            } else {
                alert("Please select a file to upload.");
            }
        });

        const photosContainer = document.querySelector(".myPhotos");

        const userPhotosRef = ref(database, `users/${uniqueUsername}/photos`);
        get(userPhotosRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const photosData = snapshot.val();
                    const photoObjects = Object.values(photosData).sort((a, b) => {
                        const dateA = new Date(a.UploadDate);
                        const dateB = new Date(b.UploadDate);

                        return dateB.getTime() - dateA.getTime();
                    });

                    photosContainer.innerHTML = "";

                    photoObjects.forEach((photoObject) => {
                        if (photoObject.ImageURL) {
                            const photoDiv = document.createElement("div");
                            photoDiv.className = "photo areal-photo photoMax";
                            photoDiv.style.backgroundImage = `url(${photoObject.ImageURL})`;
                            photosContainer.appendChild(photoDiv);
                        } else {
                            console.error("Invalid photo object:", photoObject);
                        }
                    });

                    document.querySelectorAll(".photo img").forEach((imgElement) => {
                        if (imgElement && imgElement.parentElement) {
                            imgElement.parentElement.style.display = "inline-block";
                        }
                    });
                } else {
                    console.log("No photos available for this user.");
                }
            })
            .catch((error) => {
                console.error("Error getting user photos: ", error);
            });

        document.querySelector(".photo-content").addEventListener("click", function (event) {
            if (this.innerHTML == "") {
                document.querySelector(".photo-content").addEventListener("click", function (event) {
                    console.log("Restoring grid view");
                    window.location.reload();
                });
            }
        });

    } else {
        console.log("No data available");
        window.location.href = 'https://www.lancherix.com/'
    }
}).catch((error) => {
    console.error("Error getting username: ", error);
    window.location.href = 'https://www.lancherix.com/'
});