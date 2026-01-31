'use client';

import Link from 'next/link';
import { Sparkles, MapPin } from 'lucide-react';
import { useAppStore } from '@/store/app-store';

export default function Header() {
  const { userContext, reset } = useAppStore();

  const handleReset = () => {
    if (confirm('Are you sure you want to start over? This will clear all progress.')) {
      reset();
    }
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">ResearchForm AI</span>
          </Link>

          <div className="flex items-center gap-4">
            {userContext && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm">
                <MapPin className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700">
                  {userContext.location.city}, {userContext.location.countryCode}
                </span>
              </div>
            )}
            
            <button
              onClick={handleReset}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium text-sm"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
