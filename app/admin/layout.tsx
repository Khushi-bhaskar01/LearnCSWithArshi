import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { isValidAdminSessionToken } from "@/lib/adminSession";
import { 
  LayoutDashboard, 
  FileText, 
  BookOpen, 
  CreditCard,
  LogOut
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("adminToken")?.value;

  if (!isValidAdminSessionToken(token)) {
    redirect("/admin-login");
  }

  // Check if user is admin is no longer needed here since we validate credentials strictly in the login API


  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col hidden md:flex">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-[#E76F51]">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem href="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" exact />
          <NavItem href="/admin/subjects" icon={<BookOpen size={20} />} label="Courses/Notes" />
          <NavItem href="/admin/payments" icon={<CreditCard size={20} />} label="Payments" />
        </nav>
        <div className="p-4 border-t">
          <form action="/api/admin-logout" method="post">
            <button type="submit" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors w-full">
              <LogOut size={20} />
              <span>Exit Admin</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white border-b p-4 md:hidden flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#E76F51]">Admin Panel</h2>
          <form action="/api/admin-logout" method="post">
            <button type="submit" className="text-gray-600">Exit</button>
          </form>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon, label, exact = false }: { href: string; icon: React.ReactNode; label: string; exact?: boolean }) {
  // We're not doing active state right now to keep it simple, but we could check pathname
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-[#E76F51] rounded-md transition-colors"
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}
