'use client';

import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
};

export default function SecondaryButton({ children, onClick, type = 'button', className = '' }: Props) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`bg-gray-200 text-gray-700 shadow-md font-medium text-sm px-3 py-1 rounded-full hover:bg-[#c6a974] cursor-pointer transition transform hover:-translate-y-1 duration-300 ${className}`}
    >
      {children}
    </button>
  );
}
