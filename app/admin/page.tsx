import { adminDb } from "@/lib/firebaseAdmin";
import { CreditCard, FileText, BookOpen, DollarSign } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  
  // We'll fetch basic stats
  const pdfsSnapshot = await adminDb.collection("pdfs").count().get();
  const subjectsSnapshot = await adminDb.collection("subjects").count().get();
  const purchasesSnapshot = await adminDb.collection("purchases").count().get();
  
  const totalPdfs = pdfsSnapshot.data().count;
  const totalSubjects = subjectsSnapshot.data().count;
  const totalPurchases = purchasesSnapshot.data().count;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total PDFs" 
          value={totalPdfs} 
          icon={<FileText size={24} className="text-[#E76F51]" />} 
          href="/admin/pdfs"
        />
        <StatCard 
          title="Total Subjects" 
          value={totalSubjects} 
          icon={<BookOpen size={24} className="text-[#2A9D8F]" />} 
          href="/admin/subjects"
        />
        <StatCard 
          title="Total Purchases" 
          value={totalPurchases} 
          icon={<CreditCard size={24} className="text-[#E9C46A]" />} 
          href="/admin/payments"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/admin/subjects" className="px-5 py-2.5 bg-[#F4A261] text-white rounded-lg hover:bg-[#E76F51] transition-colors font-medium">
            Manage Courses & Notes
          </Link>
          <Link href="/admin/subjects" className="px-5 py-2.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors font-medium border">
            Manage Subjects
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, href }: { title: string; value: number | string; icon: React.ReactNode; href: string }) {
  return (
    <Link href={href} className="bg-white rounded-xl shadow-sm border p-6 flex items-center justify-between hover:shadow-md transition-shadow group">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
      </div>
      <div className="p-4 bg-gray-50 rounded-full group-hover:scale-110 transition-transform">
        {icon}
      </div>
    </Link>
  );
}
