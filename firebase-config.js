// =========================================================
// KONFIGURASI FIREBASE
// Dimuat di semua halaman (setelah SDK Firebase)
// =========================================================
const firebaseConfig = {
  databaseURL: "https://uco-afl-2-default-rtdb.asia-southeast1.firebasedatabase.app/",
  apiKey: "AIzaSyBvZo5IiRnzCVWMkA515hHKxKBj7pp1M-Y",
  authDomain: "uco-afl-2.firebaseapp.com",
  projectId: "uco-afl-2",
  storageBucket: "uco-afl-2.firebasestorage.app",
  messagingSenderId: "728246555687",
  appId: "1:728246555687:web:d85bd13bfcc9df317c6a02",
  measurementId: "G-3H6J0DKMGQ"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
// Database hanya dimuat di index.html; di login/register bernilai null
const db = typeof firebase.database === "function" ? firebase.database() : null;
const kaosRef = db ? db.ref("kaos") : null;
