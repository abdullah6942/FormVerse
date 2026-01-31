'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { AppState, FieldType, type FormField } from '@/types';
import { ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProgressTimeline from '@/components/ProgressTimeline';

export default function FormActiveState() {
  const { formStructure, formData, updateFormData, transitionState } = useAppStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!formStructure) return null;

  const handleBack = () => {
    transitionState(AppState.FORM_PREVIEW);
  };

  const handleSubmit = () => {
    // Validate form
    const newErrors: Record<string, string> = {};
    
    formStructure.fields.forEach((field) => {
      if (shouldShowField(field)) {
        if (field.required && !formData[field.id]) {
          newErrors[field.id] = 'This field is required';
        }
        
        // Additional validation
        if (formData[field.id] && field.validation) {
          const value = formData[field.id];
          
          if (field.validation.pattern) {
            const regex = new RegExp(field.validation.pattern);
            if (!regex.test(value)) {
              newErrors[field.id] = 'Invalid format';
            }
          }
          
          if (field.validation.min !== undefined && Number(value) < field.validation.min) {
            newErrors[field.id] = `Minimum value is ${field.validation.min}`;
          }
          
          if (field.validation.max !== undefined && Number(value) > field.validation.max) {
            newErrors[field.id] = `Maximum value is ${field.validation.max}`;
          }
          
          if (field.validation.minLength && value.length < field.validation.minLength) {
            newErrors[field.id] = `Minimum length is ${field.validation.minLength}`;
          }
          
          if (field.validation.maxLength && value.length > field.validation.maxLength) {
            newErrors[field.id] = `Maximum length is ${field.validation.maxLength}`;
          }
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit form and transition to research
    transitionState(AppState.RESEARCHING);
  };

  const shouldShowField = (field: FormField): boolean => {
    if (!field.conditions || field.conditions.length === 0) {
      return true;
    }

    return field.conditions.every((condition) => {
      const conditionValue = formData[condition.fieldId];
      
      switch (condition.operator) {
        case 'equals':
          return conditionValue === condition.value;
        case 'notEquals':
          return conditionValue !== condition.value;
        case 'contains':
          return String(conditionValue || '').includes(String(condition.value));
        case 'greaterThan':
          return Number(conditionValue) > Number(condition.value);
        case 'lessThan':
          return Number(conditionValue) < Number(condition.value);
        default:
          return true;
      }
    });
  };

  const visibleFields = formStructure.fields.filter(shouldShowField);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl shadow-2xl p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            {formStructure.title}
          </h2>
          <p className="text-zinc-400 text-lg">
            {formStructure.description}
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {visibleFields.map((field) => (
            <div key={field.id} className="animate-slide-in">
              <label className="block text-sm font-medium text-white mb-2">
                {field.label}
                {field.required && <span className="text-emerald-400 ml-1">*</span>}
              </label>
              
              {field.helpText && (
                <p className="text-sm text-zinc-400 mb-2">{field.helpText}</p>
              )}

              {renderField(field, formData[field.id], (value) => {
                updateFormData(field.id, value);
                // Clear error when user types
                if (errors[field.id]) {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors[field.id];
                    return newErrors;
                  });
                }
              })}

              {errors[field.id] && (
                <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors[field.id]}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-6 py-3 text-zinc-300 hover:text-white font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
            Back to Preview
          </button>

          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-8 py-3 bg-emerald-gradient text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 font-medium transition-all"
          >
            Submit & Research
            <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Progress Timeline */}
      <ProgressTimeline />
    </div>
  );
}

function renderField(field: FormField, value: any, onChange: (value: any) => void) {
  const baseInputClass = cn(
    'w-full px-4 py-3 border rounded-lg outline-none transition-all',
    'bg-zinc-950/50 border-zinc-700 text-white placeholder:text-zinc-500',
    'focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
  );

  switch (field.type) {
    case FieldType.TEXT:
      return (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={baseInputClass}
        />
      );
    
    case FieldType.TEXTAREA:
      return (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={4}
          className={cn(baseInputClass, 'resize-none')}
        />
      );
    
    case FieldType.SELECT:
      return (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={baseInputClass}
        >
          <option value="">{field.placeholder || 'Select an option...'}</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    
    case FieldType.MULTISELECT:
      return (
        <div className="space-y-2">
          {field.options?.map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(value || []).includes(opt)}
                onChange={(e) => {
                  const currentValue = value || [];
                  if (e.target.checked) {
                    onChange([...currentValue, opt]);
                  } else {
                    onChange(currentValue.filter((v: string) => v !== opt));
                  }
                }}
                className="w-4 h-4 rounded border-zinc-700 bg-zinc-950/50 text-emerald-500 focus:ring-emerald-500/20"
              />
              <span className="text-zinc-300">{opt}</span>
            </label>
          ))}
        </div>
      );
    
    case FieldType.RADIO:
      return (
        <div className="space-y-2">
          {field.options?.map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={field.id}
                value={opt}
                checked={value === opt}
                onChange={(e) => onChange(e.target.value)}
                className="w-4 h-4 border-zinc-700 bg-zinc-950/50 text-emerald-500 focus:ring-emerald-500/20"
              />
              <span className="text-zinc-300">{opt}</span>
            </label>
          ))}
        </div>
      );
    
    case FieldType.NUMBER:
      return (
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          min={field.validation?.min}
          max={field.validation?.max}
          className={baseInputClass}
        />
      );
    
    case FieldType.DATE:
      return (
        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={baseInputClass}
        />
      );
    
    case FieldType.CHECKBOX:
      return (
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 rounded border-zinc-700 bg-zinc-950/50 text-emerald-500 focus:ring-emerald-500/20"
          />
          <span className="text-zinc-300">{field.placeholder}</span>
        </label>
      );
    
    default:
      return <div className="text-zinc-500">Unsupported field type: {field.type}</div>;
  }
}
