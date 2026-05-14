"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface User {
  sub: string;
  email?: string;
  first_name?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {pathname !== "/" && (
          <Link href="/" className="navbar-brand">
            <span className="arabic-title">يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟</span>
          </Link>
        )}
        <div className="navbar-links">
          <Link
            href="/"
            className={`navbar-link ${pathname === "/" ? "active" : ""}`}
          >
            Verses
          </Link>
          <Link
            href="/bookmarks"
            className={`navbar-link ${pathname === "/bookmarks" ? "active" : ""}`}
          >
            Bookmarks
          </Link>
          {user ? (
            <a href="/api/auth/logout" className="auth-btn signed-in">
              <span>{user.first_name || "Signed In"}</span>
            </a>
          ) : (
            <a href="/api/auth/login" className="auth-btn">
              Sign In
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
