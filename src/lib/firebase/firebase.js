import { deleteApp, getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// firebase configuration keys
const firebaseConfig = {
    apiKey: import.meta.env.VITE_APIKEY,
    authDomain: import.meta.env.VITE_AUTHDOMAIN,
    projectId: import.meta.env.VITE_PROJECTID,
    storageBucket: import.meta.env.VITE_STORAGEBUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
    appId: import.meta.env.VITE_APPID
};

// init firebase
let firebaseApp;

// if (location.hostname === "localhost") {
//     config = {
//         databaseURL: "http://localhost:4000?ns=emulatorui",
//     }
// }

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