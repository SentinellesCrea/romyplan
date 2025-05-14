'use client';

import { useEffect, useMemo, useState } from 'react';
import Header from '../components/home/Header';
import CalendarPreview from '../components/home/CalendarPreview';
import Footer from '../components/home/Footer';
import PrimaryButton from '../components/ui/PrimaryButton';
import Modal from '../components/ui/Modal';
import NoteForm from '../components/forms/NoteForm';
import { fetchApi } from '../../lib/fetchApi';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [showModal, setShowModal] = useState(false);

  const loadNotes = async () => {
    try {
      const data = await fetchApi('/api/notes');
      setNotes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des notes :', error);
      toast.error("Erreur lors du chargement des notes");
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleNoteAdded = () => {
    setShowModal(false);
    loadNotes();
    toast.success("📝 Note ajoutée avec succès");
    if (typeof window !== 'undefined' && window.refreshCalendar) {
      window.refreshCalendar();
    }
  };

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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[#110444] font-bold text-lg">Mes Notes</h2>
                <PrimaryButton onClick={() => setShowModal(true)}>+ Ajouter</PrimaryButton>
              </div>

              <div className="bg-white shadow-md rounded-xl p-4">
                {filteredNotes.length === 0 ? (
                  <p className="text-sm text-gray-500">Aucune note pour cette date.</p>
                ) : (
                  <ul className="space-y-3">
                    {filteredNotes.map((note) => (
                      <li key={note._id} className="flex items-start gap-3">
                        <div className="text-xl">{note.emoji ?? '📝'}</div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700">{note.title}</p>
                          {note.content && (
                            <p className="text-xs text-gray-500 mt-1">
                              {note.content.length > 80
                                ? note.content.slice(0, 80) + '...'
                                : note.content}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                  <NoteForm
                    onSubmitSuccess={handleNoteAdded}
                    onCancel={() => setShowModal(false)}
                  />
                </Modal>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
