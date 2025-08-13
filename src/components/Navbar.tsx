"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FiBell, FiMenu, FiSearch, FiX, FiUser } from "react-icons/fi";
import ThemeToggle from "./ToggleTheme";
import { motion, AnimatePresence } from "framer-motion";
import { SiMoneygram } from "react-icons/si";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: "Dashboard", href: "/" },
    { name: "Transactions", href: "/transactions" },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`fixed w-full top-0 z-50 bg-white/95 dark:bg-[#06000f] backdrop-blur-lg border-b ${
        scrolled ? "border-gray-100 dark:border-gray-800" : "border-transparent"
      }`}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16 items-center'>
          {/* Logo and Mobile Menu Button */}
          <div className='flex items-center gap-4'>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none'
              aria-expanded={mobileMenuOpen}
              aria-label='Toggle navigation'
            >
              {mobileMenuOpen ? (
                <FiX className='h-5 w-5' />
              ) : (
                <FiMenu className='h-5 w-5' />
              )}
            </button>

            <Link
              href='/'
              className='text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2'
              aria-label='BudgetApp Home'
            >
              <SiMoneygram />
              <span className='hidden sm:inline'>BudgetApp</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center gap-6'>
            <div className='hidden md:flex items-center gap-1'>
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {link.name}
                  {pathname === link.href && (
                    <motion.div
                      layoutId='nav-underline'
                      className='absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4/5 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full'
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                </Link>
              ))}
            </div>

            <div className='flex items-center gap-4'>
              <div className='relative hidden lg:block'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <FiSearch className='h-4 w-4 text-gray-400' />
                </div>
                <input
                  type='text'
                  placeholder='Search...'
                  aria-label='Search'
                  className='block w-48 pl-10 pr-3 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all'
                />
              </div>

              <button className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative'>
                <FiBell className='h-5 w-5 text-gray-600 dark:text-gray-300' />
                <span className='absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500'></span>
              </button>

              <button className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800'>
                <FiUser className='h-5 w-5 text-gray-600 dark:text-gray-300' />
              </button>

              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Search and Theme */}
          <div className='md:hidden flex items-center gap-3'>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ${
                searchOpen && "hidden"
              }`}
            >
              <FiSearch className='h-5 w-5 text-gray-600 dark:text-gray-300' />
            </button>
            {searchOpen && (
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <FiSearch className='h-4 w-4 text-gray-400' />
                </div>
                <input
                  type='text'
                  placeholder='Search...'
                  autoFocus={searchOpen}
                  aria-label='Search'
                  className='block w-48 pl-10 pr-3 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all'
                />
              </div>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className='md:hidden overflow-hidden'
          >
            <div className='px-2 pt-2 pb-4 space-y-1 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800'>
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className='px-3 pt-3 mt-2 border-t border-gray-100 dark:border-gray-800'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <div className='h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>
                      <FiUser className='h-4 w-4 text-gray-600 dark:text-gray-300' />
                    </div>
                    <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      User Account
                    </span>
                  </div>
                  <button className='p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800'>
                    <FiBell className='h-5 w-5 text-gray-600 dark:text-gray-300' />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
