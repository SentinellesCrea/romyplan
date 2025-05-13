'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import CalendarPreview from '../components/home/CalendarPreview';
import { fetchApi } from '../../lib/fetchApi';
import Header from '../components/home/Header';
import Footer from '../components/home/Footer';

export default function DayPage() {
  const searchParams = useSearchParams();
  const date = searchParams.get('date') ?? dayjs().format('YYYY-MM-DD');

  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [notes, setNotes] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [anniversaries, setAnniversaries] = useState([]);

  useEffect(() => {
  const fetchAll = async () => {
    const [t, e, n, b, a] = await Promise.all([
      fetchApi(`/api/tasks?date=${date}`),
      fetchApi(`/api/events?date=${date}`),
      fetchApi(`/api/notes?date=${date}`),
      fetchApi(`/api/budget?date=${date}`), // ← assure-toi que la route est bien "budgets"
      fetchApi(`/api/anniversaries?date=${date}`)
    ]);
    setTasks(Array.isArray(t) ? t : []);
    setEvents(Array.isArray(e) ? e : []);
    setNotes(Array.isArray(n) ? n : []);
    setBudgets(Array.isArray(b) ? b : []);
    setAnniversaries(Array.isArray(a) ? a : []);
  };

  fetchAll();
}, [date]);


  const Card = ({ title, items }) => (
    <div className="bg-white shadow-md rounded-xl p-4 w-full">
      <h2 className="text-lg font-bold text-[#5f4b8b] mb-3">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">Aucun élément</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="text-sm text-gray-700">{item.title || item.label || item.name}</li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="w-full bg-[#fffaf2]">
      <Header />
      <div className="w-full bg-[#fffaf2] min-h-screen px-4 py-10 flex justify-center">
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Calendrier à gauche (1/3) */}
          <div className="md:col-span-1">
            <CalendarPreview />
          </div>

          {/* Cartes d'infos à droite (2/3) */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card title="Tâches" items={tasks} />
            <Card title="Événements" items={events} />
            <Card title="Anniversaires" items={anniversaries} />
            <Card title="Notes" items={notes} />
            <Card title="Budgets" items={budgets} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

}
