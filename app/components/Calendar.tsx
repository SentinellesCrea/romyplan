'use client';

import { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

dayjs.locale('fr');

const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

type CalendarProps = {
  onDayClick?: (date: string) => void;
  eventsByDate?: Record<string, string[]>;
};

export default function Calendar({ onDayClick, eventsByDate = {} }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const startOfMonth = currentDate.startOf('month');
  const endOfMonth = currentDate.endOf('month');
  const startDay = startOfMonth.day() === 0 ? 6 : startOfMonth.day() - 1;

  const daysInMonth = endOfMonth.date();
  const days: (string | null)[] = Array(startDay).fill(null);

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(dayjs(currentDate).date(i).format('YYYY-MM-DD'));
  }

  const prevMonth = () => setCurrentDate(currentDate.subtract(1, 'month'));
  const nextMonth = () => setCurrentDate(currentDate.add(1, 'month'));

  const handleClick = (date: string) => {
    setSelectedDate(date);
    onDayClick?.(date);
  };

  return (
    <div className="bg-white p-4 rounded-xl text-gray-900 w-full">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="text-2xl font-bold text-pink-500">&lt;</button>
        <h2 className="text-xl font-bold text-pink-600 uppercase">
          {currentDate.format('MMMM YYYY')}
        </h2>
        <button onClick={nextMonth} className="text-2xl font-bold text-pink-500">&gt;</button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-sm font-semibold text-pink-600 mb-2">
        {daysOfWeek.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((date, i) => {
          const isToday = date && dayjs(date).isSame(dayjs(), 'day');
          const isSelected = date && selectedDate === date;
          const colors = date ? eventsByDate[date] || [] : [];

          let bgClass = 'bg-white hover:bg-pink-100 border-gray-200';
          if (isSelected) {
            bgClass = 'bg-pink-300 text-white font-bold';
          } else if (isToday) {
            bgClass = 'bg-pink-200 text-white font-bold';
          }

          return (
            <div
              key={i}
              className={`relative w-10 h-10 flex items-center justify-center rounded-full transition-all ${bgClass}`}
              onClick={() => date && handleClick(date)}
            >
              <div className="absolute text-lg text-gray-700 cursor-pointer">
                {date ? dayjs(date).date() : ''}
              </div>

              {/* ✅ Pastilles de couleur */}
              {colors.length > 0 && (
                <div className="absolute bottom-0 left-1 right-1 flex justify-center gap-[3px]">
                  {colors.map((color, idx) => (
                    <span
                      key={idx}
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: color }}
                    ></span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
