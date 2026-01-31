'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { MapPin, Search, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LocationOverride() {
  const { userContext, setUserContext } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAutoDetect = async () => {
    try {
      const response = await fetch('/api/location');
      const data = await response.json();
      
      if (data.success && userContext) {
        setUserContext({
          ...userContext,
          location: {
            ...data.location,
            isOverridden: false,
          },
        });
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Failed to auto-detect location:', error);
    }
  };

  const handleSearchSelect = (city: string) => {
    if (!userContext) return;

    setUserContext({
      ...userContext,
      location: {
        ...userContext.location,
        city,
        isOverridden: true,
      },
    });
    setIsOpen(false);
    setSearchQuery('');
  };

  if (!userContext) return null;

  // Mock cities for search - in real app would be API call
  const cities = ['Islamabad', 'Karachi', 'Lahore', 'Dubai', 'London', 'New York'];
  const filteredCities = searchQuery 
    ? cities.filter(city => city.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <div className="relative">
      {/* Location Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border",
          userContext.location.isOverridden
            ? "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
            : "bg-zinc-800/80 backdrop-blur-sm text-zinc-200 border-zinc-700/50 hover:border-emerald-500/50"
        )}
      >
        <MapPin className="w-4 h-4" strokeWidth={1.5} />
        <span>{userContext.location.city}</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-2 w-80 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/50 z-50 overflow-hidden">
            {/* Search Input */}
            <div className="p-4 border-b border-zinc-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" strokeWidth={1.5} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search any city worldwide..."
                  className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            {/* Auto-detect */}
            <div className="p-4">
              <button
                onClick={handleAutoDetect}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800/50 transition-colors text-left"
              >
                <Sun className="w-4 h-4 text-zinc-400" strokeWidth={1.5} />
                <span className="text-sm text-zinc-300">Auto-detect location</span>
              </button>
            </div>

            {/* Search Results */}
            {filteredCities.length > 0 && (
              <div className="border-t border-zinc-800 max-h-60 overflow-y-auto">
                {filteredCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleSearchSelect(city)}
                    className="w-full flex items-center gap-3 px-6 py-3 hover:bg-zinc-800/50 transition-colors text-left"
                  >
                    <MapPin className="w-4 h-4 text-zinc-500" strokeWidth={1.5} />
                    <span className="text-sm text-zinc-300">{city}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
