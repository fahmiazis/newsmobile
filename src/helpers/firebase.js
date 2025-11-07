/* eslint-disable */
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAnBRn2XVjVam4ayU48ovlWrRVLlEMnDjs",
    authDomain: "barcode-34218.firebaseapp.com",
    projectId: "barcode-34218",
    storageBucket: "barcode-34218.firebasestorage.app",
    messagingSenderId: "542127336873",
    appId: "1:542127336873:web:a3e9405305a28037f4e8b8"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi Firestore
const db = getFirestore(app);

export { db };