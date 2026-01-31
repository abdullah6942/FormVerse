'use client';

import { useAppStore } from '@/store/app-store';
import { AppState } from '@/types';
import { MessageSquare, Eye, PenTool, CheckCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineStep {
  id: AppState;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const steps: TimelineStep[] = [
  {
    id: AppState.INTERVIEWING,
    label: 'Interview',
    icon: MessageSquare,
    description: 'Define requirements',
  },
  {
    id: AppState.FORM_PREVIEW,
    label: 'Preview',
    icon: Eye,
    description: 'Review form structure',
  },
  {
    id: AppState.FORM_ACTIVE,
    label: 'Fill Form',
    icon: PenTool,
    description: 'Complete the form',
  },
  {
    id: AppState.RESEARCHING,
    label: 'Research',
    icon: CheckCircle,
    description: 'AI researching',
  },
];

export default function ProgressTimeline() {
  const { currentState, formStructure, transitionState } = useAppStore();

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentState);
  };

  const isStepAccessible = (stepId: AppState) => {
    // Can't access preview or beyond without a form
    if (!formStructure && stepId !== AppState.INTERVIEWING) {
      return false;
    }
    
    const currentIndex = getCurrentStepIndex();
    
    // If we're in PRESENTING or RESEARCHING state, allow access to Interview, Preview, and Fill Form
    if (currentState === AppState.PRESENTING || currentState === AppState.RESEARCHING) {
      return stepId === AppState.INTERVIEWING || 
             stepId === AppState.FORM_PREVIEW || 
             stepId === AppState.FORM_ACTIVE;
    }
    
    // Can access interviewing and preview once form exists
    if (stepId === AppState.INTERVIEWING || stepId === AppState.FORM_PREVIEW) {
      return formStructure !== null;
    }
    
    // Can access form active if currently there or past it
    if (stepId === AppState.FORM_ACTIVE) {
      return currentIndex >= 2;
    }
    
    // Cannot manually go to researching state
    if (stepId === AppState.RESEARCHING) {
      return false;
    }
    
    return false;
  };

  const isStepCompleted = (stepId: AppState) => {
    const stepIndex = steps.findIndex(s => s.id === stepId);
    const currentIndex = getCurrentStepIndex();
    
    // If we're in PRESENTING state, mark all steps including Research as completed
    if (currentState === AppState.PRESENTING) {
      return stepIndex <= 3; // All steps including Research (0, 1, 2, 3) are completed
    }
    
    // If we're in RESEARCHING state, mark all previous steps as completed
    if (currentState === AppState.RESEARCHING) {
      return stepIndex < currentIndex;
    }
    
    // Normal completion: steps before current step
    return stepIndex < currentIndex;
  };

  const handleStepClick = (stepId: AppState) => {
    // Disable all clicks during research
    if (currentState === AppState.RESEARCHING) {
      return;
    }
    
    if (isStepAccessible(stepId) && stepId !== currentState) {
      transitionState(stepId);
    }
  };

  // Only show timeline if form has been generated
  if (!formStructure) return null;

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-10">
      <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-6">
          Progress
        </h3>
        
        <div className="space-y-8 relative">
          {/* Connecting line */}
          <div className="absolute left-5 top-8 bottom-8 w-px bg-gradient-to-b from-emerald-500/20 via-emerald-500/40 to-emerald-500/20" />
          
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = currentState === step.id;
            const isCompleted = isStepCompleted(step.id);
            const isAccessible = isStepAccessible(step.id);
            const isLast = index === steps.length - 1;
            const isResearching = currentState === AppState.RESEARCHING;

            return (
              <div key={step.id} className="relative">
                <button
                  onClick={() => handleStepClick(step.id)}
                  disabled={!isAccessible || isResearching}
                  className={cn(
                    'flex items-start gap-4 text-left transition-all group',
                    isAccessible && !isResearching ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'
                  )}
                >
                  {/* Icon circle */}
                  <div
                    className={cn(
                      'relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                      isActive && 'bg-emerald-500 shadow-lg shadow-emerald-500/50 scale-110',
                      isCompleted && !isActive && 'bg-emerald-500/30 border-2 border-emerald-500',
                      !isActive && !isCompleted && 'bg-zinc-800 border-2 border-zinc-700',
                      isAccessible && !isActive && 'group-hover:border-emerald-500/50 group-hover:bg-zinc-700'
                    )}
                  >
                    <StepIcon
                      className={cn(
                        'w-5 h-5 transition-all duration-300',
                        isActive && 'text-white',
                        isCompleted && !isActive && 'text-emerald-400',
                        !isActive && !isCompleted && 'text-zinc-500'
                      )}
                    />
                    
                    {/* Glow effect for active */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-20" />
                    )}
                  </div>

                  {/* Label */}
                  <div className="flex-1 pt-1">
                    <div
                      className={cn(
                        'font-semibold text-sm transition-all duration-300',
                        isActive && 'text-emerald-400 glow-text',
                        isCompleted && !isActive && 'text-emerald-500',
                        !isActive && !isCompleted && 'text-zinc-500',
                        isAccessible && !isActive && 'group-hover:text-emerald-400'
                      )}
                    >
                      {step.label}
                    </div>
                    <div className="text-xs text-zinc-600 mt-0.5">
                      {step.description}
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>        
        {/* Research Again Button - only show when in PRESENTING state */}
        {currentState === AppState.PRESENTING && (
          <div className="mt-6 pt-6 border-t border-zinc-800">
            <button
              onClick={() => {
                // Clear only the research result, keep everything else
                useAppStore.setState({ 
                  researchResult: null,
                  isResearching: false 
                });
                // Transition directly to researching state
                transitionState(AppState.RESEARCHING);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-gradient text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 font-medium transition-all text-sm"
            >
              <RefreshCw className="w-4 h-4" strokeWidth={2} />
              Research Again
            </button>
          </div>
        )}      </div>
    </div>
  );
}
