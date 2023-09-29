
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';



const firebaseConfig = {
    apiKey: "AIzaSyDAKT1glV7qid6oTH-RPfhuaYZJRs4Xdy8",
    authDomain: "tickets-57db0.firebaseapp.com",
    projectId: "tickets-57db0",
    storageBucket: "tickets-57db0.appspot.com",
    messagingSenderId: "396069881131",
    appId: "1:396069881131:web:7d31c8e519c1ac8489316e",
    measurementId: "G-WPYR5NQMX4"
  };


  const firebaseApp = initializeApp(firebaseConfig);

  const auth = getAuth(firebaseApp);
  const dataBase = getFirestore(firebaseApp);
  const storage = getStorage(firebaseApp);

  export { auth, dataBase, storage };


  