// Konfigurasi dan inisialisasi Firebase (modular SDK)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// konfigurasi dari Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCBgAE5vbWfan3ixH0D5V3Dwc0yCKeadyY",
  authDomain: "app-input-nilai-kel1.firebaseapp.com",
  projectId: "app-input-nilai-kel1",
  storageBucket: "app-input-nilai-kel1.appspot.com",
  messagingSenderId: "421406842284",
  appId: "1:421406842284:web:a7d2f56bae178a160bae09"
};

// Inisialisasi Firebase dan Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Ekspor db agar bisa dipakai di logic.js
export { db };
