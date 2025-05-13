'use client';

import { useEffect, useMemo, useState } from 'react';
import Header from '../components/home/Header';
import CalendarPreview from '../components/home/CalendarPreview';
import Footer from '../components/home/Footer';
import { fetchApi } from '@/lib/fetchApi';
import dayjs from 'dayjs';

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));

  useEffect(() => {
    const loadNotes = async () => {
      const data = await fetchApi('/api/notes');
      setNotes(Array.isArray(data) ? data : []);
    };
    loadNotes();
  }, []);

  const filteredNotes = useMemo(() => {
    return notes.filter((n) => n.date?.slice(0, 10) === selectedDate);
  }, [notes, selectedDate]);

  return (
    <div className="bg-[#fffaf2] min-h-screen ">
      <Header />

      <div className="w-full flex justify-center">
        <div className="w-full max-w-7xl">
          <h1 className="text-2xl font-bold mb-6 text-[#5f4b8b] p-4 md:p-0 mt-10">
            Mes Notes du {dayjs(selectedDate).format('DD MMMM YYYY')}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Calendrier à gauche */}
            <div className="md:col-span-1 p-4 md:p-0">
              <CalendarPreview onDayClick={(date) => setSelectedDate(date)} />
            </div>

            {/* Notes à droite */}
            <div className="md:col-span-2 p-4 md:p-0">
              <div className="bg-white shadow-md rounded-xl p-4">
                {filteredNotes.length === 0 ? (
                  <p className="text-sm text-gray-500">Aucune note pour cette date.</p>
                ) : (
                  <ul className="space-y-2">
                    {filteredNotes.map((note, i) => (
                      <li key={i} className="text-sm text-gray-700">
                        📝 {note.title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
