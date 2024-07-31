import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDBSjYQ6vD5zYs_7f7lcvwYQ4qVr9_fFQY",
  authDomain: "inventory-management-9aec5.firebaseapp.com",
  projectId: "inventory-management-9aec5",
  storageBucket: "inventory-management-9aec5.appspot.com",
  messagingSenderId: "156873943837",
  appId: "1:156873943837:web:abddcb5f619405cc288ff4",
  measurementId: "G-QP4SPMX2H9"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore }