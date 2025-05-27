import React, { useState, useRef, useEffect } from 'react';
import { User } from 'lucide-react';
import { useAuth } from './auth';
import { useOnClickOutside } from '../hooks/useOnClickOutside';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-gray-600 hover:text-gray-900"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <User size={24} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <div className="px-4 py-2 text-sm text-gray-700 border-b">
              {user?.email}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}