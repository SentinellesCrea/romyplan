'use client';

import { useEffect, useMemo, useState } from 'react';
import Header from '../components/home/Header';
import CalendarPreview from '../components/home/CalendarPreview';
import Footer from '../components/home/Footer';
import { fetchApi } from '../../lib/fetchApi'; // ✅ chemin relatif
import dayjs from 'dayjs';

type NoteItem = {
  _id: string;
  title: string;
  content?: string;
  date: string;
  color?: string;
  emoji?: string;
};

export default function NotesPage() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const data = await fetchApi('/api/notes');
        setNotes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('❌ Erreur lors du chargement des notes :', error);
      }
    };
    loadNotes();
  }, []);

  const filteredNotes = useMemo(() => {
    return notes.filter((n) => n.date?.slice(0, 10) === selectedDate);
  }, [notes, selectedDate]);

  return (
    <div className="bg-[#fffaf2] min-h-screen">
      <Header />

      <div className="w-full flex justify-center">
        <div className="w-full max-w-7xl">
          <h1 className="text-2xl font-bold mb-6 text-[#5f4b8b] p-4 md:p-0 mt-10">
            Mes Notes du {dayjs(selectedDate).format('DD MMMM YYYY')}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Calendrier */}
            <div className="md:col-span-1 p-4 md:p-0">
              <CalendarPreview onDayClick={(date) => setSelectedDate(date)} />
            </div>

            {/* Notes */}
            <div className="md:col-span-2 p-4 md:p-0">
              <div className="bg-white shadow-md rounded-xl p-4">
                {filteredNotes.length === 0 ? (
                  <p className="text-sm text-gray-500">Aucune note pour cette date.</p>
                ) : (
                  <ul className="space-y-2">
                    {filteredNotes.map((note) => (
                      <li key={note._id} className="text-sm text-gray-700">
                        {note.emoji ?? '📝'} {note.title}
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
