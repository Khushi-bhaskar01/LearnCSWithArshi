import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseClient";

export const checkPurchase = async (uid:string, subjectId:string) => {

  const userDoc = await getDoc(doc(db, "users", uid));

  const data = userDoc.data();

  return data?.purchasedSubjects?.includes(subjectId);

};