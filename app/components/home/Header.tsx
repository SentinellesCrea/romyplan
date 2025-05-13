'use client';

import { useState, useRef, useEffect } from 'react';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { FiMenu, FiX } from 'react-icons/fi';
import { HiHome, HiClipboardList, HiGift, HiCash, HiBookmark } from 'react-icons/hi';
import { HiOutlineCalendarDays } from 'react-icons/hi2';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

dayjs.locale('fr');

const navItems = [
  { label: 'Accueil', href: '/', icon: <HiHome /> },
  { label: 'Tâches', href: '/tasks', icon: <HiClipboardList /> },
  { label: 'Budget', href: '/budget', icon: <HiCash /> },
  { label: 'Anniversaires', href: '/anniversaries', icon: <HiGift /> },
  { label: 'Notes', href: '/notes', icon: <HiBookmark /> },
  { label: 'Événements', href: '/events', icon: <HiOutlineCalendarDays /> },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const currentDay = dayjs().format('DD MMMM YYYY');
  const queryDate = dayjs().format('YYYY-MM-DD');
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu si clic hors menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-gradient-to-r from-[#f6ead4] to-[#dbcbb0] h-20 rounded-b-3xl text-[#110444] shadow-md flex items-center justify-between px-6 relative z-50">
      {/* Logo */}
      <Link href="/" passHref>
        <h1 className="text-2xl sm:text-3xl font-bold italic cursor-pointer transition transform hover:scale-105 duration-300">
          RomyPlan 🌸
        </h1>
      </Link>

      {/* Menu desktop */}
      <nav className="hidden md:flex gap-12 items-center">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center text-sm font-semibold transition transform hover:scale-105 duration-300 ${
              pathname === item.href ? 'text-[#b2581c]' : 'text-[#5f4b8b]'
            }`}
          >
            <div className="text-xl">{item.icon}</div>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Date cliquable → redirection vers /day?date=YYYY-MM-DD */}
      <div
        onClick={() => router.push(`/day?date=${queryDate}`)}
        className="hidden md:flex items-center gap-2 text-sm sm:text-base cursor-pointer transition transform hover:scale-105 duration-300"
      >
        <span>{currentDay}</span>
        <FaRegCalendarAlt />
      </div>

      {/* Mobile menu toggle */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="text-2xl text-[#5f4b8b]">
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute top-20 left-0 w-full bg-white border-t border-gray-200 shadow-md flex flex-col items-center py-4 md:hidden"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 py-2 px-4 w-full text-center justify-center text-base font-medium ${
                pathname === item.href ? 'text-[#b2581c]' : 'text-[#5f4b8b]'
              } hover:bg-[#f6f0e4] transition`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </Link>
          ))}

          {/* Date visible en mobile */}
          <div
            onClick={() => {
              setIsOpen(false);
              router.push(`/day?date=${queryDate}`);
            }}
            className="mt-4 text-[#5f4b8b] flex items-center gap-2 cursor-pointer"
          >
            <span>{currentDay}</span>
            <FaRegCalendarAlt />
          </div>
        </div>
      )}
    </header>
  );
}
