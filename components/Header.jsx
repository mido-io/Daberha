"use client";
import Link from "next/link";
import {
  UserButton,
  SignedIn,
  useUser,
} from "@clerk/nextjs";

import { HiMenu, HiX } from "react-icons/hi";
import { useState, useEffect } from "react";
import { getUserAccounts } from "@/actions/dashboard";

const navItems = [
  { href: "/dashboard", label: "الرئيسية" },
  { href: "/budget", label: "الميزانية" },
  { href: "/transaction", label: "المصاريف" },
  { href: "/reports", label: "التقارير" },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      getUserAccounts().then((data) => {
        if (data) setAccounts(data);
      }).catch(console.error);
    }
  }, [isLoaded, isSignedIn]);


  return (
    <SignedIn>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background">
        <div className="mx-auto flex h-16 items-center justify-between px-4" dir="rtl">
          {/* Logo */}
          <Link href="/" className="text-3xl md:text-4xl font-bold leading-none text-primary" aria-label=" دبّرها">
            دبّرها
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-lg md:text-xl font-medium leading-none text-foreground font-arabic" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link key={`${item.href}-${item.label}`} href={item.href} className="transition-opacity hover:opacity-80 hover:text-primary">
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Auth & Mobile Menu Toggle */}
          <div className="flex items-center gap-4" dir="ltr">

            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                },
              }}
            />

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-foreground p-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border px-4 py-4 flex flex-col gap-4 shadow-lg text-foreground font-arabic" dir="rtl">
            {navItems.map((item) => (
              <Link
                key={`mobile-${item.href}`}
                href={item.href}
                className="text-xl font-medium py-2 border-b border-border hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </header>
    </SignedIn>
  );
};

export default Header;
