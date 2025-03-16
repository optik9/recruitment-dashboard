import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDBALzV_COhvkpO-A2z4UrWd-nzgimPJzg",
    authDomain: "recruitment-oc.firebaseapp.com",
    projectId: "recruitment-oc",
    storageBucket: "recruitment-oc.firebasestorage.app",
    messagingSenderId: "474516615060",
    appId: "1:474516615060:web:de914dd9231bdf0bc22981",
    measurementId: "G-F9G1X223XJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

//export { auth };
export { auth, db }; // Modificar la exportación existente
export const positionsRef = collection(db, "openPositions");
export const candidatesRef = collection(db, "candidates");
export const configRef = collection(db, "config");
