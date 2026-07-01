import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC3YhsgyixI0_8iXMA3bBZknrlkM7r80DY",
  authDomain: "raithabandhu-b4cd1.firebaseapp.com",
  projectId: "raithabandhu-b4cd1",
  storageBucket: "raithabandhu-b4cd1.firebasestorage.app",
  messagingSenderId: "596477698623",
  appId: "1:596477698623:web:5142945697686b5e95ce8a",
  measurementId: "G-YTH5VK2ET5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
