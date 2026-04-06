import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyALyGAcggdZZsF_4KC2cP-xqbtmRPILguM",
  authDomain: "tradeconnect-12647.firebaseapp.com",
  projectId: "tradeconnect-12647",
  storageBucket: "tradeconnect-12647.firebasestorage.app",
  messagingSenderId: "572013353071",
  appId: "1:572013353071:web:1fedb803658609ea97559a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();