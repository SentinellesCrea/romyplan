'use client';

import { useEffect, useState } from 'react';
import { RxCross2 } from "react-icons/rx";
import PrimaryButton from '../ui/PrimaryButton';
import Modal from '../ui/Modal';
import NoteForm from '../forms/NoteForm';
import { fetchApi } from '../../../lib/fetchApi';
import { toast } from 'react-toastify';

const hexToRgba = (hex, alpha = 0.3) => {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const loadNotes = async () => {
    try {
      const data = await fetchApi('/api/notes');
      setNotes(data);
    } catch (err) {
      console.error('Erreur chargement notes :', err);
      toast.error("Erreur lors du chargement des notes");
    }
  };

  const handleNoteAdded = () => {
    setShowModal(false);
    loadNotes();
    toast.success("📝 Note ajoutée avec succès");

    if (typeof window !== 'undefined' && window.refreshCalendar) {
      window.refreshCalendar();
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetchApi(`/api/notes/${id}`, { method: 'DELETE' });
      toast.success('🗑️ Note supprimée');
      loadNotes();

      if (typeof window !== 'undefined' && window.refreshCalendar) {
        window.refreshCalendar();
      }
    } catch (err) {
      console.error('Erreur suppression :', err);
      toast.error('Erreur lors de la suppression');
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <div className="bg-white rounded-xl p-4 shadow-md transition transform hover:-translate-y-1 duration-300 animate-fadeUp">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[#110444] font-bold text-lg">Mes Notes</h2>
        <PrimaryButton onClick={() => setShowModal(true)}>+ Ajouter</PrimaryButton>
      </div>

      {notes.length === 0 ? (
        <p className="text-sm text-gray-500">Aucune note enregistrée.</p>
      ) : (
        <ul className="space-y-3">
          {notes.map((note) => (
            <li
              key={note._id}
              className="flex items-start gap-3 p-3 rounded-lg shadow-sm hover:shadow-md transition transform hover:-translate-y-1 duration-300 relative"
              style={{
                backgroundColor: hexToRgba(note.color || '#f59e0b', 0.3),
                borderLeft: `4px solid ${note.color || '#f59e0b'}`,
              }}
            >
              <div className="text-2xl">{note.emoji || '📝'}</div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-gray-800">{note.title}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {note.content.length > 80
                    ? `${note.content.slice(0, 80)}...`
                    : note.content}
                </p>
              </div>
              <button
                onClick={() => handleDelete(note._id)}
                className="absolute top-2 right-2 text-m text-gray-400 hover:text-red-500"
                title="Supprimer"
              >
                <RxCross2 />
              </button>
            </li>
          ))}
        </ul>
      )}

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <NoteForm
            onSubmitSuccess={handleNoteAdded}
            onClose={() => setShowModal(false)}
            onCancel={() => setShowModal(false)}
          />
        </Modal>
      )}
    </div>
  );
}
