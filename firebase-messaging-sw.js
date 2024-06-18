importScripts('https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.1.0/firebase-messaging.js');

// Your web app's Firebase configuration
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
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
