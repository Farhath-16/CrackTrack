importScripts(
    "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);

importScripts(
    "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

firebase.initializeApp({

    apiKey: "AIzaSyA9BagY1PfQKQydrfANzHWk5LS1iSVL25Y",

    authDomain: "placement-tracker-demo.firebaseapp.com",

    projectId: "placement-tracker-demo",

    storageBucket: "placement-tracker-demo.firebasestorage.app",

    messagingSenderId: "625822581784",

    appId: "1:625822581784:web:5d2be4dc984890dbddaf6d"

});

const messaging =
    firebase.messaging();

messaging.onBackgroundMessage(
    (payload) => {
         console.log(
        "BACKGROUND MESSAGE",
        payload
    );

        self.registration.showNotification(

            payload.notification.title,

            {
                body:
                    payload.notification.body
            }

        );

    }
);