import { adminDb } from "@/lib/firebaseAdmin";
import PaymentsClient from "./PaymentsClient";

export default async function PaymentsPage() {
  
  const purchasesSnapshot = await adminDb.collection("purchases").get();
  
  const purchases = purchasesSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate().toISOString() || null
    };
  });

  return (
    <PaymentsClient purchases={purchases} />
  );
}
