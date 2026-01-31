'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { AppState } from '@/types';
import { generateId } from '@/lib/utils';
import InterviewingState from '@/components/states/InterviewingState';
import FormPreviewState from '@/components/states/FormPreviewState';
import FormActiveState from '@/components/states/FormActiveState';
import ResearchingState from '@/components/states/ResearchingState';
import PresentingState from '@/components/states/PresentingState';
import Sidebar from '@/components/Sidebar';
import LocationOverride from '@/components/LocationOverride';
import { Menu, Home } from 'lucide-react';
import Link from 'next/link';

export default function AppPage() {
  const { currentState, setUserContext, userContext, isResearching } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Detect user location on mount
  useEffect(() => {
    if (!userContext) {
      detectLocation();
    }
  }, []);

  const detectLocation = async () => {
    try {
      const response = await fetch('/api/location');
      const data = await response.json();
      
      if (data.success) {
        setUserContext({
          location: data.location,
          sessionId: generateId('session'),
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error('Failed to detect location:', error);
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Ambient glow */}
        <div className="fixed inset-0 bg-gradient-radial pointer-events-none opacity-60" />
        
        {/* Header Controls - Fixed Top */}
        <div className={`fixed top-4 z-50 flex items-center justify-between transition-all duration-300 ${sidebarOpen ? 'left-[336px]' : 'left-4'} right-4`}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2.5 bg-zinc-900/80 backdrop-blur-xl border border-zinc-700/50 rounded-lg hover:bg-zinc-800 transition-colors"
              title="Toggle sidebar"
            >
              <Menu className="w-5 h-5 text-zinc-300" strokeWidth={1.5} />
            </button>
            <Link
              href="/"
              className={`p-2.5 bg-zinc-900/80 backdrop-blur-xl border border-zinc-700/50 rounded-lg transition-colors ${
                isResearching 
                  ? 'opacity-50 cursor-not-allowed pointer-events-none' 
                  : 'hover:bg-zinc-800'
              }`}
              title={isResearching ? 'Cannot go home while researching' : 'Go to home'}
            >
              <Home className="w-5 h-5 text-zinc-300" strokeWidth={1.5} />
            </Link>
          </div>
          <LocationOverride />
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-8">
            {currentState === AppState.INTERVIEWING && <InterviewingState />}
            {currentState === AppState.FORM_PREVIEW && <FormPreviewState />}
            {currentState === AppState.FORM_ACTIVE && <FormActiveState />}
            {currentState === AppState.RESEARCHING && <ResearchingState />}
            {currentState === AppState.PRESENTING && <PresentingState />}
          </div>
        </div>
      </main>
    </div>
  );
}
