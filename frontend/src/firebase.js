import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {

    apiKey: "AIzaSyA9BagY1PfQKQydrfANzHWk5LS1iSVL25Y",

    authDomain: "placement-tracker-demo.firebaseapp.com",

    projectId: "placement-tracker-demo",

    storageBucket: "placement-tracker-demo.firebasestorage.app",

    messagingSenderId: "625822581784",

    appId: "1:625822581784:web:5d2be4dc984890dbddaf6d",

    measurementId: "G-56JKY2M84P"

};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);