'use client';

import { useAppStore } from '@/store/app-store';
import { AppState } from '@/types';
import { RefreshCw, ExternalLink, CheckCircle2, Download } from 'lucide-react';

export default function PresentingState() {
  const { researchResult, formData, transitionState, reset } = useAppStore();

  if (!researchResult) return null;

  const handleStartOver = () => {
    if (confirm('Start a new research? This will clear current results.')) {
      reset();
    }
  };

  const handleDownload = () => {
    const content = `
Research Results
================

Research Query:
${researchResult.query}

Date: ${researchResult.timestamp.toLocaleString()}

Findings:
---------
${researchResult.findings}

Sources:
--------
${researchResult.sources.map((s, i) => `
${i + 1}. ${s.title}
   ${s.url}
   ${s.snippet}
`).join('\n')}

Form Data:
----------
${Object.entries(formData).map(([key, value]) => `${key}: ${value}`).join('\n')}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `research-results-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Research Results</h2>
              <p className="text-primary-100">
                Completed on {researchResult.timestamp.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Findings */}
        <div className="p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Findings</h3>
          
          <div className="prose max-w-none">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {researchResult.findings}
              </p>
            </div>
          </div>

          {/* Sources */}
          {researchResult.sources.length > 0 && (
            <div className="mt-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Sources</h3>
              
              <div className="space-y-4">
                {researchResult.sources.map((source, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg border border-gray-200 p-5 hover:border-primary-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {source.title}
                        </h4>
                        <p className="text-gray-600 text-sm mb-3">
                          {source.snippet}
                        </p>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          Visit Source
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form Data Summary */}
          <div className="mt-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Inputs</h3>
            
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <dl className="space-y-3">
                {Object.entries(formData).map(([key, value]) => (
                  <div key={key} className="flex flex-col sm:flex-row sm:gap-4">
                    <dt className="font-medium text-gray-900 sm:w-1/3">
                      {key}:
                    </dt>
                    <dd className="text-gray-700 sm:w-2/3">
                      {Array.isArray(value) ? value.join(', ') : String(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-200 font-medium border border-gray-300"
            >
              <Download className="w-5 h-5" />
              Download Results
            </button>
            
            <button
              onClick={handleStartOver}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium shadow-sm"
            >
              <RefreshCw className="w-5 h-5" />
              Start New Research
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
