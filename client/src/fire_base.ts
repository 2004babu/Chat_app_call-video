// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { signInWithPopup, getAuth, GoogleAuthProvider, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getMessaging } from 'firebase/messaging'
import axios from "axios";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APPID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT
};

// Initialize Firebase
let auth;
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const messaging = getMessaging(app)
export default auth = getAuth(app)
const googleprovider = new GoogleAuthProvider();



export const sighInWithGoogle = async () => {
    try {
        const result: UserCredential = await signInWithPopup(auth, googleprovider)
        const user = result.user;

        const token = await user.getIdToken();

        const apiurl = import.meta.env.VITE_BACKEND_URL

      const response=  await axios.post(apiurl + '/auth/gogglesignup', {}, { headers: { Authorization: `Bearer ${token}` } })

        if (response.data.user) {

            return response.data.user
        } else {
            return null

        }


    } catch (error) {
        console.log(error);

    }
}

export const signUpEmailAndPassword = async (email: string, password: string, name: string) => {
    try {

        const result: UserCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = result.user;

        const updateUser = await updateProfile(user, { displayName: name })
        console.log(updateUser);

        const token = await user.getIdToken();

        const apiurl = import.meta.env.VITE_BACKEND_URL

        const response = await axios.post(apiurl + '/auth/emailSignup', {}, { headers: { Authorization: `Bearer ${token}` } })


        await axios.post(apiurl + '/auth/setjwt', {}, { withCredentials: true, headers: { Authorization: `Bearer ${token}` } })


        if (response.data.user) {

            return response.data.user
        } else {
            return null

        }

    } catch (error) {
        console.log((error as Error).message);
        return (error as Error).message
    }
}
export const sighInWithEmail = async (email: string, password: string) => {
    try {

        const result: UserCredential = await signInWithEmailAndPassword(auth, email, password)

        if (result.user) {

            return `"Welcome!" ${result.user.displayName ?? result.user.email}`
        } else {
            return 'User Not Found!'

        }


        // const user = result.user
        // const token = await user.getIdToken();

        // const apiurl = import.meta.env.VITE_BACKEND_URL

        // const response = await axios.post(apiurl + '/auth/emaillogin', {}, { headers: { Authorization: `Bearer ${token}` } })

    } catch (error) {
        console.log((error as Error).message);
        return 'User Not Found Check UserName and PassWord!'


    }
}
