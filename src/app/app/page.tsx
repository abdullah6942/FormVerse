'use client';

import { useEffect } from 'react';
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

export default function AppPage() {
  const { currentState, setUserContext, userContext } = useAppStore();

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
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Ambient glow */}
        <div className="fixed inset-0 bg-gradient-radial pointer-events-none opacity-60" />
        
        {/* Location - Fixed Top Right */}
        <div className="fixed top-4 right-4 z-30">
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
