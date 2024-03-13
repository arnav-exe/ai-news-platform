import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import auth from "../lib/firebase/firebase"
import { writable } from "svelte/store";

export const authStore = writable({
    user: null,
    loading: true,
    data: {}
})

export const authHandlers = {
    signup: async (email, pswd) => {
        await createUserWithEmailAndPassword(auth, email, pswd);
    },
    login: async (email, pswd) => {
        await signInWithEmailAndPassword(auth, email, pswd);
    },
    logout: async _ => {
        await signOut(auth);
    }
}