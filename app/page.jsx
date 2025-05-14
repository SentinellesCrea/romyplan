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



export default function HomePage() {
  
  return (
    <div className="w-full bg-[#fffaf2]">
      <Header />

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
