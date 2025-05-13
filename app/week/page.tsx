'use client';

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import Header from '../components/home/Header';
import Footer from '../components/home/Footer';
import { fetchApi } from '@/lib/fetchApi';

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
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [anniversaries, setAnniversaries] = useState([]);
  const [budgets, setBudgets] = useState([]);

  const daysOfWeek = Array.from({ length: 7 }, (_, i) => currentWeekStart.add(i, 'day'));

  const handlePrevWeek = () => setCurrentWeekStart(currentWeekStart.subtract(7, 'day'));
  const handleNextWeek = () => setCurrentWeekStart(currentWeekStart.add(7, 'day'));
  const handleToday = () => setCurrentWeekStart(dayjs().startOf('week').add(1, 'day'));

  const fetchWeekEvents = async () => {
    const allEvents = await Promise.all(
      daysOfWeek.map(async (date) => {
        const res = await fetchApi(`/api/events?date=${date.format('YYYY-MM-DD')}`);
        return res.map((ev: any) => ({ ...ev, date: date.format('YYYY-MM-DD') }));
      })
    );
    setEvents(allEvents.flat());
  };

  const fetchWeekTasks = async () => {
    const allTasks = await Promise.all(
      daysOfWeek.map(async (date) => {
        const res = await fetchApi(`/api/tasks?date=${date.format('YYYY-MM-DD')}`);
        return res.map((ev: any) => ({ ...ev, date: date.format('YYYY-MM-DD') }));
      })
    );
    setTasks(allTasks.flat());
  };

  const fetchWeekNotes = async () => {
    const allNotes = await Promise.all(
      daysOfWeek.map(async (date) => {
        const res = await fetchApi(`/api/notes?date=${date.format('YYYY-MM-DD')}`);
        return res.map((note: any) => ({ ...note, rawDate: note.date, date: date.format('YYYY-MM-DD') }));
      })
    );
    setNotes(allNotes.flat());
  };

  const fetchWeekAnniversaries = async () => {
    const allAnniversaries = await Promise.all(
      daysOfWeek.map(async (date) => {
        const res = await fetchApi(`/api/anniversaries?date=${date.format('YYYY-MM-DD')}`);
        return res.map((a: any) => ({ ...a, date: date.format('YYYY-MM-DD') }));
      })
    );
    setAnniversaries(allAnniversaries.flat());
  };

  useEffect(() => {
    fetchWeekTasks();
    fetchWeekNotes();
    fetchWeekAnniversaries();
    fetchWeekEvents();
  }, [currentWeekStart]);

  return (
    <div className="bg-[#fffaf2] min-h-screen">
      <Header />

      <main className="w-full max-w-7xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-4">
          <button onClick={handlePrevWeek} className="text-sm text-pink-500 cursor-pointer transition transform hover:scale-105 duration-300">⬅️ Semaine précédente</button>
          <h2 className="text-lg font-bold text-[#5f4b8b]">
            Semaine du {currentWeekStart.format('DD MMMM YYYY')}
          </h2>
          <button onClick={handleNextWeek} className="text-sm text-pink-500 cursor-pointer transition transform hover:scale-105 duration-300">Semaine suivante ➡️</button>
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
              {Array.from({ length: 17 }).map((_, i) => (
                <div key={i} className="h-24 border-b">{`${6 + i}h`}</div>
              ))}
            </div>

            <div className="col-span-7 grid grid-cols-7">
              {daysOfWeek.map((day, idx) => (
                <div key={idx} className="border-l">
                  <div className="bg-pink-100 text-center py-2 font-semibold border-b">
                    {day.format('ddd DD')}
                  </div>
                  <div className="relative h-[24*17px]">
                    {tasks.filter((t) => t.date === day.format('YYYY-MM-DD')).map((task, i) => (
                      <div
                        key={`task-${i}`}
                        className="absolute left-2 right-2 h-16 bg-[#60a5fa] text-white rounded-lg shadow-md p-2 text-xs"
                        style={{ top: `${((task.hour ?? 6) - 6) * 4}rem` }}
                      >
                        {task.emoji && <span className="mr-1">{task.emoji}</span>}
                        {task.label}
                      </div>
                    ))}

                    {anniversaries.filter((a) => a.date === day.format('YYYY-MM-DD')).map((a, i) => (
                      <div
                        key={`anniv-${i}`}
                        className="absolute left-2 right-2 h-16 bg-[#ec4899] text-white rounded-lg shadow-md p-2 text-xs"
                        style={{ top: `${((a.hour ?? 6) - 6) * 4}rem` }}
                      >
                        🎂 {a.name}
                      </div>
                    ))}

                    {notes.filter((n) => n.rawDate?.slice(0, 10) === day.format('YYYY-MM-DD')).map((note, i) => (
                      <div
                        key={`note-${i}`}
                        className="absolute right-[-20px] w-32 bg-[#10b981] text-white rounded-md shadow-lg p-2 text-xs transform rotate-[-3deg] z-10"
                        style={{ top: `${i * 80}px` }}
                      >
                        <div className="font-bold mb-1"> Note</div>
                        <div className="text-white text-[11px] leading-snug break-words">
                          {note.title}
                        </div>
                      </div>
                    ))}

                    {events.filter((e) => e.date === day.format('YYYY-MM-DD')).map((event, i) => (
                      <div
                        key={`event-${i}`}
                        className="absolute left-2 right-2 h-16 bg-[#ff2424] text-white rounded-lg shadow-md p-2 text-xs"
                        style={{ top: `${((event.hour ?? 6) - 6) * 4}rem` }}
                      >
                        {event.emoji && <span className="mr-1">{event.emoji}</span>}
                        {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}