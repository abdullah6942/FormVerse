'use client';

import { useAppStore } from '@/store/app-store';
import { AppState, FieldType } from '@/types';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import ProgressTimeline from '@/components/ProgressTimeline';

export default function FormPreviewState() {
  const { formStructure, transitionState } = useAppStore();

  if (!formStructure) return null;

  const handleBack = () => {
    transitionState(AppState.INTERVIEWING);
  };

  const handleContinue = () => {
    transitionState(AppState.FORM_ACTIVE);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl shadow-2xl p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-gradient rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl font-bold text-white">
              {formStructure.title}
            </h2>
          </div>
          <p className="text-zinc-400 text-lg leading-relaxed">
            {formStructure.description}
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              Form Preview
            </h3>
            <span className="text-sm text-zinc-500">
              {formStructure.fields.length} {formStructure.fields.length === 1 ? 'field' : 'fields'}
            </span>
          </div>
          
          <div className="space-y-4">
            {formStructure.fields.map((field, index) => (
              <div key={field.id} className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 hover:border-emerald-900/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
                        {index + 1}
                      </span>
                      <label className="text-base font-medium text-white">
                        {field.label}
                        {field.required && (
                          <span className="text-emerald-400 ml-1">*</span>
                        )}
                      </label>
                    </div>
                    
                    {field.helpText && (
                      <p className="text-sm text-zinc-400 ml-9">{field.helpText}</p>
                    )}
                  </div>
                  
                  <span className="text-xs px-3 py-1 bg-zinc-800 text-emerald-400 rounded-full font-medium border border-zinc-700">
                    {field.type}
                  </span>
                </div>

                {/* Show field preview */}
                <div className="ml-9">
                  {renderFieldPreview(field)}
                </div>

                {/* Show conditions if any */}
                {field.conditions && field.conditions.length > 0 && (
                  <div className="ml-9 mt-4 pt-4 border-t border-zinc-800">
                    <p className="text-xs text-zinc-500">
                      <span className="font-medium text-zinc-400">Conditional:</span> Shows when{' '}
                      {field.conditions.map((c, i) => (
                        <span key={i}>
                          {i > 0 && ' and '}
                          <span className="font-medium text-emerald-400">{c.fieldId}</span>{' '}
                          <span className="text-zinc-400">{c.operator}</span>{' '}
                          <span className="text-zinc-300">&quot;{c.value}&quot;</span>
                        </span>
                      ))}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-6 py-3 text-zinc-300 hover:text-white font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
            Edit Requirements
          </button>

          <button
            onClick={handleContinue}
            className="flex items-center gap-2 px-8 py-3 bg-emerald-gradient text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 font-medium transition-all"
          >
            Continue to Form
            <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Progress Timeline */}
      <ProgressTimeline />
    </div>
  );
}

function renderFieldPreview(field: any) {
  switch (field.type) {
    case FieldType.TEXT:
      return (
        <input
          type="text"
          placeholder={field.placeholder || 'Enter text...'}
          disabled
          className="w-full px-4 py-3 border border-zinc-700 rounded-lg bg-zinc-950/50 text-zinc-400 text-sm placeholder:text-zinc-600 focus:outline-none"
        />
      );
    
    case FieldType.TEXTAREA:
      return (
        <textarea
          placeholder={field.placeholder || 'Enter details...'}
          disabled
          rows={3}
          className="w-full px-4 py-3 border border-zinc-700 rounded-lg bg-zinc-950/50 text-zinc-400 text-sm placeholder:text-zinc-600 resize-none focus:outline-none"
        />
      );
    
    case FieldType.SELECT:
      return (
        <select disabled className="w-full px-4 py-3 border border-zinc-700 rounded-lg bg-zinc-950/50 text-zinc-400 text-sm focus:outline-none">
          <option>{field.placeholder || 'Select an option...'}</option>
          {field.options?.map((opt: string) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      );
    
    case FieldType.MULTISELECT:
      return (
        <div className="space-y-3">
          {field.options?.slice(0, 3).map((opt: string) => (
            <label key={opt} className="flex items-center gap-3 text-sm text-zinc-400 cursor-not-allowed">
              <input type="checkbox" disabled className="rounded border-zinc-700 bg-zinc-950/50 text-emerald-500" />
              {opt}
            </label>
          ))}
          {field.options && field.options.length > 3 && (
            <p className="text-xs text-zinc-500">...and {field.options.length - 3} more</p>
          )}
        </div>
      );
    
    case FieldType.RADIO:
      return (
        <div className="space-y-3">
          {field.options?.map((opt: string) => (
            <label key={opt} className="flex items-center gap-3 text-sm text-zinc-400 cursor-not-allowed">
              <input type="radio" name={field.id} disabled className="border-zinc-700 bg-zinc-950/50 text-emerald-500" />
              {opt}
            </label>
          ))}
        </div>
      );
    
    case FieldType.NUMBER:
      return (
        <input
          type="number"
          placeholder={field.placeholder || 'Enter number...'}
          disabled
          className="w-full px-4 py-3 border border-zinc-700 rounded-lg bg-zinc-950/50 text-zinc-400 text-sm placeholder:text-zinc-600 focus:outline-none"
        />
      );
    
    default:
      return (
        <div className="text-sm text-zinc-500">
          Preview not available for {field.type}
        </div>
      );
  }
}
