import { writable } from "svelte/store";
import { auth, db } from "../lib/firebase/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"

export const authStore = writable({
    user: null,
    loading: true,
    data: {}
})

export const authHandlers = {
    signup: async (email, pswd, firstName, lastName) => {
        const userCreds = await createUserWithEmailAndPassword(auth, email, pswd);

        // adding additional data to user collection
        try {
            const docReference = doc(db, 'users', userCreds.user.uid);

            await setDoc(docReference, {
                firstName: firstName,
                lastName: lastName,
                email: email,
                newsPrefs: []
            });
        } catch (error) {
            console.log("adding additional user data failed")
            console.log(error);
        }
        

    },
    login: async (email, pswd) => {
        await signInWithEmailAndPassword(auth, email, pswd);
    },
    logout: async _ => {
        await signOut(auth);
    }
}