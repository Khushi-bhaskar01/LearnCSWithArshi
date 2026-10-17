import { adminDb } from "@/lib/firebaseAdmin";
import SubjectClient from "./SubjectClient";

export default async function SubjectsPage() {
  
  const subjectsSnapshot = await adminDb.collection("subjects").get();
  const subjects = subjectsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate().toISOString() || null
  }));

  return (
    <SubjectClient initialSubjects={subjects} />
  );
}
