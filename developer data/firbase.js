// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCq4dfln0__p-8byF2CMY1pKaG6_x0EzFQ",
  authDomain: "fluid-mix-418817.firebaseapp.com",
  projectId: "fluid-mix-418817",
  storageBucket: "fluid-mix-418817.appspot.com",
  messagingSenderId: "732433814438",
  appId: "1:732433814438:web:3fbd8634bed5410f75b567",
  measurementId: "G-VLDRJ2TEGC"
};

// Initialize Firebase
console.log('Initializing Firebase...');
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Request permission to show notifications
console.log('Requesting notification permission...');
messaging.requestPermission()
  .then(() => {
    console.log('Notification permission granted.');
    return messaging.getToken();
  })
  .then(token => {
    console.log('FCM Token received:', token);
    // Send the token to your server for sending notifications
    sendTokenToServer(token);
  })
  .catch(error => {
    console.error('Unable to get permission to notify.', error);
  });

function sendTokenToServer(token) {
  const userId = userData._id;
  console.log('Sending token to server:', token, 'User ID:', userId);
  fetch('/save-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: token, userId: userId }),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Token saved on server:', data);
  })
  .catch(error => {
    console.error('Error saving token on server:', error);
  });
}

messaging.onMessage((payload) => {
  console.log('Message received: ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon
  };

  if (Notification.permission === 'granted') {
    console.log('Displaying notification:', notificationTitle, notificationOptions);
    new Notification(notificationTitle, notificationOptions);
  }
});
