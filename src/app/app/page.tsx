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
import Header from '@/components/Header';
import StateIndicator from '@/components/StateIndicator';
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <StateIndicator />
          <LocationOverride />
        </div>
        
        <div className="mt-8">
          {currentState === AppState.INTERVIEWING && <InterviewingState />}
          {currentState === AppState.FORM_PREVIEW && <FormPreviewState />}
          {currentState === AppState.FORM_ACTIVE && <FormActiveState />}
          {currentState === AppState.RESEARCHING && <ResearchingState />}
          {currentState === AppState.PRESENTING && <PresentingState />}
        </div>
      </main>
    </div>
  );
}
