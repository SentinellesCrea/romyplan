'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Calendar from '../Calendar';
import { fetchApi } from '@/lib/fetchApi';

type CalendarPreviewProps = {
  onDayClick?: (date: string) => void;
};

export default function CalendarPreview({ onDayClick }: CalendarPreviewProps) {
  const router = useRouter();
  const [eventsByDate, setEventsByDate] = useState<Record<string, string[]>>({});

  const groupColorsByDate = (items: any[]): Record<string, Set<string>> => {
    const map: Record<string, Set<string>> = {};
    items.forEach((item) => {
      const date = item.date?.slice(0, 10);
      const color = item.color;
      if (!date || !color) return;
      if (!map[date]) map[date] = new Set();
      map[date].add(color);
    });
    return map;
  };

  const mergeColorMaps = (...maps: Record<string, Set<string>>[]): Record<string, string[]> => {
    const merged: Record<string, Set<string>> = {};
    maps.forEach((map) => {
      Object.entries(map).forEach(([date, colors]) => {
        if (!merged[date]) merged[date] = new Set();
        colors.forEach((color) => merged[date].add(color));
      });
    });

    const result: Record<string, string[]> = {};
    for (const [date, set] of Object.entries(merged)) {
      result[date] = Array.from(set);
    }

    return result;
  };

  const loadAllEvents = async () => {
    try {
      const [tasks, anniversaries, notes, events, budgets] = await Promise.all([
        fetchApi('/api/tasks'),
        fetchApi('/api/anniversaries'),
        fetchApi('/api/notes'),
        fetchApi('/api/events'),
        fetchApi('/api/budget'),
      ]);

      const taskMap = groupColorsByDate(tasks);
      const anniversaryMap = groupColorsByDate(anniversaries);
      const noteMap = groupColorsByDate(notes);
      const eventMap = groupColorsByDate(events);
      const budgetMap = groupColorsByDate(budgets);

      const allEvents = mergeColorMaps(taskMap, anniversaryMap, noteMap, eventMap, budgetMap);
      setEventsByDate(allEvents);
    } catch (err) {
      console.error('❌ Erreur chargement événements calendrier :', err);
    }
  };

  useEffect(() => {
    loadAllEvents();
    const interval = setInterval(loadAllEvents, 30000);
    window.refreshCalendar = loadAllEvents;

    return () => {
      clearInterval(interval);
      delete window.refreshCalendar;
    };
  }, []);

  const defaultHandleDateClick = (date: string) => {
    router.push(`/day?date=${date}`);
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-md transition transform hover:-translate-y-1 duration-300">
      <h2 className="text-[#110444] font-bold text-xl mb-4">Calendrier</h2>

      <div className="text-center text-sm text-gray-500">
        <Calendar
          eventsByDate={eventsByDate}
          onDayClick={onDayClick ?? defaultHandleDateClick}
        />
      </div>

      {/* ✅ Légende des couleurs */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-[#110444] mb-2 pt-4 mt-6 border-t border-gray-200">
          Légende
        </h3>
        <div className="flex flex-wrap gap-3 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#60a5fa]"></span> Tâche
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ec4899]"></span> Anniv
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#10b981]"></span> Note
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff2424]"></span> Événement
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#f59e0b]"></span> Budget
          </div>
        </div>
      </div>
    </div>
  );
}
