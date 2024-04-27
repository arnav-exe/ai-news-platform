import { writable } from "svelte/store";
import { auth, db } from "../lib/firebase/firebase";
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateEmail, updatePassword } from "firebase/auth";
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
    },

    updateEmail: async email => {
        authStore.update(curr => {
            return {
                ...curr,
                currentUser: {
                    ...curr.currentUser,
                    email: email
                }
            }
        });
        await updateEmail(auth.currentUser, email);
    },

    updatePassword: async pswd => {
        await updatePassword(auth.currentUser, pswd);
    },

    resetPassword: async email => {
        if (!email) { // do not allow pswd reset unless email is provided
            return;
        }
        await sendPasswordResetEmail(auth, email);
    }
}