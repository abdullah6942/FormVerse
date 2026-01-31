'use client';

import { useAppStore } from '@/store/app-store';
import { AppState, FieldType } from '@/types';
import { ArrowLeft, ArrowRight, Edit3 } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {formStructure.title}
          </h2>
          <p className="text-gray-600 text-lg">
            {formStructure.description}
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Form Preview ({formStructure.fields.length} fields)
          </h3>
          
          <div className="space-y-6 bg-gray-50 rounded-xl p-6">
            {formStructure.fields.map((field, index) => (
              <div key={field.id} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">
                        #{index + 1}
                      </span>
                      <label className="text-base font-medium text-gray-900">
                        {field.label}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                    </div>
                    
                    {field.helpText && (
                      <p className="text-sm text-gray-600 mt-1">{field.helpText}</p>
                    )}
                  </div>
                  
                  <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-full font-medium">
                    {field.type}
                  </span>
                </div>

                {/* Show field preview */}
                <div className="mt-3">
                  {renderFieldPreview(field)}
                </div>

                {/* Show conditions if any */}
                {field.conditions && field.conditions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      <span className="font-medium">Conditional:</span> Shows when{' '}
                      {field.conditions.map((c, i) => (
                        <span key={i}>
                          {i > 0 && ' and '}
                          <span className="font-medium">{c.fieldId}</span> {c.operator} &quot;{c.value}&quot;
                        </span>
                      ))}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:text-gray-900 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Edit Requirements
          </button>

          <button
            onClick={handleContinue}
            className="flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium shadow-sm"
          >
            Continue to Form
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm"
        />
      );
    
    case FieldType.TEXTAREA:
      return (
        <textarea
          placeholder={field.placeholder || 'Enter details...'}
          disabled
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm resize-none"
        />
      );
    
    case FieldType.SELECT:
      return (
        <select disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm">
          <option>{field.placeholder || 'Select an option...'}</option>
          {field.options?.map((opt: string) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      );
    
    case FieldType.MULTISELECT:
      return (
        <div className="space-y-2">
          {field.options?.slice(0, 3).map((opt: string) => (
            <label key={opt} className="flex items-center gap-2 text-sm text-gray-500">
              <input type="checkbox" disabled className="rounded" />
              {opt}
            </label>
          ))}
          {field.options && field.options.length > 3 && (
            <p className="text-xs text-gray-400">...and {field.options.length - 3} more</p>
          )}
        </div>
      );
    
    case FieldType.RADIO:
      return (
        <div className="space-y-2">
          {field.options?.map((opt: string) => (
            <label key={opt} className="flex items-center gap-2 text-sm text-gray-500">
              <input type="radio" name={field.id} disabled />
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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm"
        />
      );
    
    default:
      return (
        <div className="text-sm text-gray-500">
          Preview not available for {field.type}
        </div>
      );
  }
}
