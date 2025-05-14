'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ children, onClose }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center overflow-y-auto px-4">
      <div className="relative max-h-[90vh] w-full max-w-xl rounded-2xl p-6 overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-8 right-14 text-gray-400 hover:text-gray-600 text-2xl hover:scale-105"
        >
          &times;
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}
