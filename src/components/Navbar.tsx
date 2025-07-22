"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar({
  isAuthenticated = false,
}: {
  isAuthenticated: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white fixed top-0 left-0 w-full z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-blue-600">
          Sales Dashboard
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          {isAuthenticated ? (
            <>
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Home
              </Link>
              <Link
                href="/sales"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-medium"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setOpen(!open)}
            className="text-gray-700 text-2xl focus:outline-none"
          >
            {open ? "✖" : "☰"}
          </button>
        </div>
      </div>
          
      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-4 pb-4">
          {isAuthenticated ? (
            <>
              <Link href="/" className="block text-gray-700 py-2">
                Home
              </Link>
              <Link href="/dashboard" className="block text-gray-700 py-2">
                Dashboard
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="block text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
