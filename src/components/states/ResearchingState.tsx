'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { AppState } from '@/types';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function ResearchingState() {
  const { formData, userContext, setResearchResult, transitionState, setIsResearching } = useAppStore();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Planning research...');
  const [steps, setSteps] = useState<string[]>([]);

  useEffect(() => {
    conductResearch();
  }, []);

  const conductResearch = async () => {
    setIsResearching(true);
    
    // Simulate research steps
    const researchSteps = [
      'Planning research approach...',
      'Analyzing form data...',
      'Searching for relevant information...',
      'Conducting market research...',
      'Gathering regulatory information...',
      'Researching technology solutions...',
      'Compiling findings...',
      'Generating insights...',
    ];

    // Animate through steps
    for (let i = 0; i < researchSteps.length; i++) {
      setCurrentStep(researchSteps[i]);
      setSteps((prev) => [...prev, researchSteps[i]]);
      setProgress(((i + 1) / researchSteps.length) * 90);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData,
          userContext,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setProgress(100);
        setCurrentStep('Research complete!');
        
        setResearchResult({
          id: `research_${Date.now()}`,
          query: Object.entries(formData).map(([k, v]) => `${k}: ${v}`).join(', '),
          findings: data.result.findings,
          sources: data.result.sources,
          timestamp: new Date(),
          formData,
        });

        setTimeout(() => {
          setIsResearching(false);
          transitionState(AppState.PRESENTING);
        }, 1000);
      } else {
        throw new Error(data.error || 'Research failed');
      }
    } catch (error) {
      console.error('Research error:', error);
      setCurrentStep('Research failed. Please try again.');
      setIsResearching(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            {progress < 100 ? (
              <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
            ) : (
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            )}
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {progress < 100 ? 'Researching...' : 'Research Complete!'}
          </h2>
          <p className="text-gray-600 text-lg">{currentStep}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{progress.toFixed(0)}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-600 to-secondary-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Research Steps */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex items-center gap-3 animate-slide-in"
            >
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">{step}</span>
            </div>
          ))}
        </div>

        {progress < 100 && (
          <div className="mt-8 text-center text-sm text-gray-500">
            This may take a few moments as we gather comprehensive insights...
          </div>
        )}
      </div>
    </div>
  );
}
