import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebaseClient";

export const createUserIfNotExists = async (user:any) => {

  const userRef = doc(db, "users", user.uid);

  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {

    await setDoc(userRef, {
      name: user.displayName,
      email: user.email,
      purchasedSubjects: [],
      createdAt: new Date()
    });

  }
};