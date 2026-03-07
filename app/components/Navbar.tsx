"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { auth } from "@/lib/firebaseClient";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Navbar() {
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -80,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      });
    });

    const handleScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener("scroll", handleScroll);

    return () => {
      ctx.revert();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        mobileMenuRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 }
      );
    });

    return () => ctx.revert();
  }, [menuOpen]);

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    document.cookie = "firebaseToken=; path=/; max-age=0";
    window.location.href = "/";
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Courses", href: "/courses" },
    { name: "Notes", href: "/notes" },
    { name: "YouTube", href: "/youtube" },
  ];

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-5 left-0 right-0 mx-auto w-[96%] max-w-7xl z-50
        rounded-2xl px-10 py-4 flex items-center justify-between transition-all
        ${
          scrolled
            ? "bg-white/70 backdrop-blur-xl shadow-xl"
            : "bg-white/40 backdrop-blur-md"
        }`}
      >
        <Link href="/" className="text-lg font-semibold">
          <span className="text-[#F4A261]">Dr.</span> Arshi Husain
        </Link>

        <div className="hidden md:flex gap-10 items-center">
          {navLinks.map((item) => (
            <Link key={item.name} href={item.href}>
              {item.name}
            </Link>
          ))}

          {!user ? (
            <Link
              href="/login"
              className="bg-[#F4A261] text-white px-6 py-2 rounded-full"
            >
              Login
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-9 h-9 rounded-full bg-[#F4A261] text-white"
              >
                {user.email?.charAt(0).toUpperCase()}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-44 bg-white rounded-xl shadow">
                  <p className="px-4 py-2 text-sm truncate">{user.email}</p>

                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div
          className="md:hidden cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>
      </nav>

      {menuOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed top-24 left-0 right-0 mx-auto w-[92%] bg-white p-6 rounded-2xl shadow-xl z-40"
        >
          <div className="flex flex-col gap-4">
            {navLinks.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className="text-lg py-2 border-b border-gray-100 hover:text-[#F4A261] transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {!user ? (
              <Link
                href="/login"
                className="bg-[#F4A261] text-white px-6 py-3 rounded-full text-center mt-4 hover:bg-[#E76F51] transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            ) : (
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-[#F4A261] text-white flex items-center justify-center font-semibold">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.email}</p>
                  </div>
                </div>
                
                <Link
                  href="/profile"
                  className="block w-full text-left px-4 py-3 hover:bg-gray-100 rounded-xl transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-red-500 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}