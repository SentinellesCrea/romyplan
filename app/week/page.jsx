'use client';

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import Header from '../components/home/Header';
import Footer from '../components/home/Footer';
import { fetchApi } from '../../lib/fetchApi';

dayjs.locale('fr');

const colors = {
  task: '#60a5fa',
  anniversary: '#ec4899',
  note: '#10b981',
  event: '#ff2424',
  budget: '#f59e0b'
};

export default function WeeklyView() {
  const [currentWeekStart, setCurrentWeekStart] = useState(dayjs().startOf('week').add(1, 'day'));
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [notes, setNotes] = useState([]);
  const [anniversaries, setAnniversaries] = useState([]);
  const [budgets, setBudgets] = useState([]);

  const daysOfWeek = Array.from({ length: 7 }, (_, i) => currentWeekStart.add(i, 'day'));

  const handlePrevWeek = () => setCurrentWeekStart(currentWeekStart.subtract(7, 'day'));
  const handleNextWeek = () => setCurrentWeekStart(currentWeekStart.add(7, 'day'));
  const handleToday = () => setCurrentWeekStart(dayjs().startOf('week').add(1, 'day'));

  useEffect(() => {
    const fetchWeekData = async () => {
      const fetchByDay = async (type, setter) => {
        const all = await Promise.all(
          daysOfWeek.map(async (date) => {
            const res = await fetchApi(`/api/${type}?date=${date.format('YYYY-MM-DD')}`);
            return res.map((item) => ({
              ...item,
              date: date.format('YYYY-MM-DD'),
              type,
            }));
          })
        );
        setter(all.flat());
      };

      await Promise.all([
        fetchByDay('tasks', setTasks),
        fetchByDay('events', setEvents),
        fetchByDay('notes', setNotes),
        fetchByDay('anniversaries', setAnniversaries),
        fetchByDay('budget', setBudgets),
      ]);
    };

    fetchWeekData();
  }, [currentWeekStart]);

  const renderItem = (item, i) => {
    const hasHour = typeof item.hour === 'number' && !isNaN(item.hour);
    const top = hasHour ? (item.hour - 6) * 96 : 0;
    const bgColor = colors[item.type] || '#ccc';
    const label = item.label || item.title || item.name;

    return (
      <div
        key={`${item.type}-${item._id || i}`}
        className={`absolute left-2 right-2 ${hasHour ? 'h-16' : ''} text-white rounded-lg shadow-md p-2 text-xs`}
        style={{
          top: `${top}px`,
          backgroundColor: bgColor,
        }}
      >
        {item.emoji && <span className="mr-1">{item.emoji}</span>}
        {label}
      </div>
    );
  };

  return (
    <div className="bg-[#fffaf2] min-h-screen">
      <Header />

      <main className="w-full max-w-7xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handlePrevWeek}
            className="text-sm text-pink-500 cursor-pointer transition transform hover:scale-105 duration-300"
          >
            ⬅️ Semaine précédente
          </button>
          <h2 className="text-lg font-bold text-[#5f4b8b]">
            Semaine du {currentWeekStart.format('DD MMMM YYYY')}
          </h2>
          <button
            onClick={handleNextWeek}
            className="text-sm text-pink-500 cursor-pointer transition transform hover:scale-105 duration-300"
          >
            Semaine suivante ➡️
          </button>
        </div>

        <button
          onClick={handleToday}
          className="mb-6 text-sm text-white bg-pink-400 hover:bg-pink-500 px-3 py-1 rounded-full"
        >
          Aujourd'hui
        </button>

        <div className="relative bg-white rounded-2xl shadow-md overflow-auto">
          <div className="grid grid-cols-8">
            <div className="col-span-1 text-sm text-gray-500 p-2">
              <div className="h-10 border-b">Sans heure</div>
              {Array.from({ length: 17 }).map((_, i) => (
                <div key={i} className="h-24 border-b">{`${6 + i}h`}</div>
              ))}
            </div>

            <div className="col-span-7 grid grid-cols-7">
              {daysOfWeek.map((day, idx) => {
                const currentDate = day.format('YYYY-MM-DD');

                const items = [
                  ...tasks.filter((i) => i.date === currentDate),
                  ...events.filter((i) => i.date === currentDate),
                  ...notes.filter((i) => i.date === currentDate || i.rawDate?.slice(0, 10) === currentDate),
                  ...anniversaries.filter((i) => i.date === currentDate),
                  ...budgets.filter((i) => i.date === currentDate),
                ];

                return (
                  <div key={idx} className="border-l relative">
                    <div className="bg-pink-100 text-center py-2 font-semibold border-b">
                      {day.format('ddd DD')}
                    </div>
                    <div className="relative" style={{ height: `${96 * 18}px` }}>
                      {items.map((item, i) => renderItem(item, i))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
