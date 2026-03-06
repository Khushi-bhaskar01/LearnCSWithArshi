import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseClient";

export const getSubjects = async () => {

  const snapshot = await getDocs(collection(db, "subjects"));

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

};