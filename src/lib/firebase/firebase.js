import { deleteApp, getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// firebase configuration keys
const firebaseConfig = {
    apiKey: "AIzaSyDLMrZ4fF7j0_k8wWuMqcmk_O7Hl1AAdz8",
    authDomain: "ai-news-platform.firebaseapp.com",
    projectId: "ai-news-platform",
    storageBucket: "ai-news-platform.appspot.com",
    messagingSenderId: "412587066714",
    appId: "1:412587066714:web:bda8c66cc3a1c1b9529f63"
};

// init firebase
let firebaseApp;

if (!getApps().length) { // good
    firebaseApp = initializeApp(firebaseConfig);
}
else { // bad
    firebaseApp = getApp();
    deleteApp(firebaseApp);
    firebaseApp = initializeApp(firebaseConfig);
}

export const db = getFirestore(firebaseApp); // firestore handler
export const auth = getAuth(firebaseApp); // auth handler