// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getDatabase } from 'firebase/database';
// import { getStorage } from 'firebase/storage';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCQZc08dOkuDkOKWcoqS-acKSRTlAymUBs',
  authDomain: 'kval-darbs-2021-ek18103.firebaseapp.com',
  databaseURL:
    'https://kval-darbs-2021-ek18103-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'kval-darbs-2021-ek18103',
  storageBucket: 'kval-darbs-2021-ek18103.appspot.com',
  messagingSenderId: '891196183282',
  appId: '1:891196183282:web:53acf8823c0623e320b66b',
};

// Initialize Firebase

// const app = firebase.initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const database = app.database();
// export const storage = getStorage(app);

const app = firebase.initializeApp(firebaseConfig);
export const auth = app.auth();
export const database = app.database();
export const storage = app.storage();
export const dbRef = firebase.database().ref();
