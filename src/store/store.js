import { writable } from "svelte/store";
import { auth, db } from "../lib/firebase/firebase";
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateEmail, updatePassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"

// store for user authentication
export const authStore = writable({
    user: null,
    loading: true,
    newsPrefs: {}
})

// auth handler functions
export const authHandlers = {
    signup: async (email, pswd, firstName, lastName) => { // sign up new user
        const userCreds = await createUserWithEmailAndPassword(auth, email, pswd);

        // adding additional data to user collection
        try {
            const docReference = doc(db, 'users', userCreds.user.uid);

            await setDoc(docReference, {
                firstName: firstName,
                lastName: lastName,
                email: email,
                newsPrefs: { // default news category preferences for new users
                    general: true,
                    business: false,
                    entertainment: false,
                    health: false,
                    science: false,
                    sports: false,
                    technology: false
                }
            });
        } catch (error) { // if adding additional data fails
            console.log("adding additional user data failed")
            console.log(error);
        }
    },

    login: async (email, pswd) => { // log in existing user
        await signInWithEmailAndPassword(auth, email, pswd);
    },

    logout: async () => { // log out user
        await signOut(auth);
    },

    updateEmail: async email => { // update user email
        authStore.update(curr => {
            return {
                ...curr, // spread current state incase other properties are added in the future
                currentUser: {
                    ...curr.currentUser, // keep current user data
                    email: email // update email
                }
            }
        });
        await updateEmail(auth.currentUser, email);
    },

    updatePassword: async pswd => { // update user password
        await updatePassword(auth.currentUser, pswd);
    },

    resetPassword: async email => { // send password reset email
        if (!email) { // do not allow pswd reset unless email is provided
            return;
        }
        await sendPasswordResetEmail(auth, email);
    },

    updatePrefs: async prefs => { // update user news category preferences (prefs object with bool for each category)
        const user = auth.currentUser;

        try {
            const docReference = doc(db, "users", user.uid); // get user document reference
            
            try { // update user document with new preferences
                await setDoc(docReference, { newsPrefs: prefs }, { merge: true });
            }
            catch (error) { // if updation fails
                console.log("ERROR UPDATING USER PREFS:", error);
            }
        }
        catch (error) {
            console.log("USER ERROR:", error);
        }
    }
}