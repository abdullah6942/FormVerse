'use client';

import { useEffect, useState, useRef } from 'react';
import { useAppStore } from '@/store/app-store';
import { AppState } from '@/types';
import { Loader2, CheckCircle2 } from 'lucide-react';
import ProgressTimeline from '@/components/ProgressTimeline';

export default function ResearchingState() {
  const { formData, userContext, setResearchResult, transitionState, setIsResearching } = useAppStore();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Planning research...');
  const [steps, setSteps] = useState<string[]>([]);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!hasStarted.current) {
      hasStarted.current = true;
      conductResearch();
    }
  }, []);

  const conductResearch = async () => {
    setIsResearching(true);
    setSteps([]); // Reset steps to prevent duplicates
    setProgress(0); // Reset progress
    
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
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl shadow-2xl p-12">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            {progress < 100 ? (
              <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
            ) : (
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            )}
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">
            {progress < 100 ? 'Researching...' : 'Research Complete!'}
          </h2>
          <p className="text-zinc-400 text-lg">{currentStep}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-zinc-400 mb-2">
            <span>Progress</span>
            <span>{progress.toFixed(0)}%</span>
          </div>
          <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-gradient transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Research Steps */}
        <div className="space-y-3 mb-6">
          {steps.map((step, index) => (
            <div
              key={`step-${index}-${step}`}
              className="flex items-center gap-3 animate-slide-in"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span className="text-zinc-300">{step}</span>
            </div>
          ))}
        </div>

        {progress < 100 && (
          <div className="text-center text-sm text-zinc-500">
            This may take a few moments as we gather comprehensive insights...
          </div>
        )}
      </div>

      {/* Progress Timeline */}
      <ProgressTimeline />
    </div>
  );
}
