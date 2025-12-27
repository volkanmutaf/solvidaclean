import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBWFkdIE2czG242kc7UoZy_2Kf8s1uWX7I",
  authDomain: "binoclean-admin.firebaseapp.com",
  projectId: "binoclean-admin",
  storageBucket: "binoclean-admin.appspot.com", // ✅ düzeltildi
  messagingSenderId: "468878606733",
  appId: "1:468878606733:web:ddb10a557f5e09b9d3bdc4",
  measurementId: "G-DYL412VBJF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
