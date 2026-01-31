'use client';

import { useAppStore } from '@/store/app-store';
import { AppState } from '@/types';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

const states = [
  { state: AppState.INTERVIEWING, label: 'Interview' },
  { state: AppState.FORM_PREVIEW, label: 'Preview' },
  { state: AppState.FORM_ACTIVE, label: 'Fill Form' },
  { state: AppState.RESEARCHING, label: 'Research' },
  { state: AppState.PRESENTING, label: 'Results' },
];

export default function StateIndicator() {
  const { currentState, stateHistory } = useAppStore();

  const getStateIndex = (state: AppState) => {
    return states.findIndex((s) => s.state === state);
  };

  const currentIndex = getStateIndex(currentState);

  const isCompleted = (index: number) => {
    return index < currentIndex;
  };

  const isCurrent = (index: number) => {
    return index === currentIndex;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        {states.map((item, index) => (
          <div key={item.state} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all',
                  isCompleted(index) && 'bg-primary-600 border-primary-600',
                  isCurrent(index) && 'border-primary-600 bg-primary-50',
                  !isCompleted(index) && !isCurrent(index) && 'border-gray-300 bg-white'
                )}
              >
                {isCompleted(index) ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : (
                  <Circle
                    className={cn(
                      'w-5 h-5',
                      isCurrent(index) ? 'text-primary-600' : 'text-gray-300'
                    )}
                  />
                )}
              </div>
              <span
                className={cn(
                  'text-sm font-medium whitespace-nowrap',
                  isCurrent(index) ? 'text-primary-600' : 'text-gray-600'
                )}
              >
                {item.label}
              </span>
            </div>
            
            {index < states.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-2 transition-all',
                  isCompleted(index) ? 'bg-primary-600' : 'bg-gray-300'
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
