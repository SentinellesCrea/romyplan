// app/page.tsx
"use client"

import Header from './components/home/Header';
import Tasks from './components/home/Tasks';
import CalendarPreview from './components/home/CalendarPreview';
import Budget from './components/home/Budget';
import Anniversaries from './components/home/Anniversaries';
import Notes from './components/home/Notes';
import Events from './components/home/Events';
import Footer from './components/home/Footer';

import { BsCalendarMonthFill, BsCalendarDayFill, BsCalendarWeekFill } from "react-icons/bs";
import { useRouter, usePathname } from 'next/navigation';
import dayjs from 'dayjs';
import Link from 'next/link';
import 'dayjs/locale/fr';


const navItems = [
  { label: "Aujourdh'ui", href: '/day', icon: <BsCalendarDayFill /> },
  { label: 'Cette Semaine', href: '/week', icon: <BsCalendarWeekFill /> },
  { label: 'Le Mois', href: '/month', icon: <BsCalendarMonthFill /> },
];


export default function HomePage() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="w-full bg-[#fffaf2]">
      <Header />

        <div className="flex justify-center mt-4">
          {/* Menu desktop */}
          <nav className="hidden md:flex gap-12 items-center bg-gradient-to-r from-[#f6ead4] to-[#dbcbb0] p-4 rounded-xl">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center text-sm font-semibold transition transform hover:scale-105 duration-300 ${
                  pathname === item.href ? 'text-[#b2581c]' : 'text-[#5f4b8b]'
                }`}
              >
                <span>{item.label}</span> 
              </Link>
            ))}
          </nav>
        </div>


          <div className="w-full flex justify-center px-4">
            <div className="w-full max-w-7xl">
              {/* On utilise un conteneur flex uniquement en mobile */}
              <div className="flex flex-col md:grid md:grid-cols-3 gap-4 mt-12">
                {/* En mobile : calendrier en haut */}
                <div className="order-2 md:order-none">
                  <Tasks />
                </div>
                <div className="order-1 md:order-none">
                  <CalendarPreview />
                </div>
                <div className="order-3 md:order-none">
                  <Budget />
                </div>
                <div className="order-4 md:order-none">
                  <Anniversaries />
                </div>
                <div className="order-5 md:order-none">
                  <Notes />
                </div>
                <div className="order-6 md:order-none">
                  <Events />
                </div>
              </div>
            </div>
          </div>

      <Footer />
    </div>
  );
}
