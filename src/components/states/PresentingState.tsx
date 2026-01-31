'use client';

import { useAppStore } from '@/store/app-store';
import { AppState } from '@/types';
import { RefreshCw, ExternalLink, CheckCircle2, Download, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';
import ProgressTimeline from '@/components/ProgressTimeline';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { jsPDF } from 'jspdf';

export default function PresentingState() {
  const { researchResult, formData, transitionState, reset } = useAppStore();

  if (!researchResult) return null;

  const handleStartOver = () => {
    reset();
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Helper function to add text with word wrapping
    const addText = (text: string, fontSize: number = 10, isBold: boolean = false) => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach((line: string) => {
        if (yPosition + 10 > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, margin, yPosition);
        yPosition += fontSize / 2 + 2;
      });
    };

    const addSpace = (space: number = 5) => {
      yPosition += space;
    };

    // Title
    doc.setFillColor(16, 185, 129); // Emerald color
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Research Results', margin, 25);
    
    yPosition = 50;
    doc.setTextColor(0, 0, 0);

    // Date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${researchResult.timestamp.toLocaleString()}`, margin, yPosition);
    yPosition += 15;

    // Research Query
    addText('Research Query:', 12, true);
    addSpace(3);
    addText(researchResult.query, 10);
    addSpace(10);

    // Form Data
    if (Object.keys(formData).length > 0) {
      addText('Form Details:', 12, true);
      addSpace(3);
      Object.entries(formData).forEach(([key, value]) => {
        addText(`${key}: ${Array.isArray(value) ? value.join(', ') : String(value)}`, 10);
      });
      addSpace(10);
    }

    // Findings - Remove markdown formatting for PDF
    addText('Research Findings:', 12, true);
    addSpace(3);
    
    // Clean markdown from findings
    const cleanFindings = researchResult.findings
      .replace(/#{1,6}\s/g, '') // Remove heading markers
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold markers
      .replace(/\*([^*]+)\*/g, '$1') // Remove italic markers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links but keep text
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/`([^`]+)`/g, '$1'); // Remove inline code
    
    addText(cleanFindings, 10);
    addSpace(10);

    // Sources
    if (researchResult.sources && researchResult.sources.length > 0) {
      addText('Sources & References:', 12, true);
      addSpace(3);
      researchResult.sources.forEach((source, index) => {
        addText(`${index + 1}. ${source.title}`, 10, true);
        addText(`   ${source.url}`, 9);
        if (source.snippet) {
          addText(`   ${source.snippet}`, 9);
        }
        addSpace(5);
      });
    }

    // Save PDF
    doc.save(`research-results-${Date.now()}.pdf`);
  };

  // Parse the findings to extract structured sections with better markdown support
  const parseFindings = (findings: string) => {
    const sections: { title: string; content: string; icon?: string }[] = [];
    const lines = findings.split('\n');
    let currentSection = { title: '', content: '' };
    let inSection = false;

    lines.forEach((line) => {
      // Check if line is a main heading (starts with ## but not ###)
      const isMainHeading = line.trim().match(/^##\s+(?!#)/);
      
      if (isMainHeading) {
        // Save previous section if it has content
        if (currentSection.title && currentSection.content.trim()) {
          sections.push({ ...currentSection });
        }
        
        // Start new section
        const title = line.replace(/^#+\s*/, '').trim();
        currentSection = {
          title,
          content: ''
        };
        inSection = true;
      } else if (inSection) {
        // Add line to current section content
        currentSection.content += line + '\n';
      } else if (!currentSection.title && line.trim()) {
        // Content before first heading - add to intro section
        if (!currentSection.title) {
          currentSection.title = 'Summary';
        }
        currentSection.content += line + '\n';
      }
    });

    // Don't forget the last section
    if (currentSection.title && currentSection.content.trim()) {
      sections.push(currentSection);
    }

    // If no sections were parsed, treat entire content as one section
    if (sections.length === 0 && findings.trim()) {
      sections.push({ title: 'Research Findings', content: findings });
    }

    return sections;
  };

  const sections = parseFindings(researchResult.findings);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-5xl mx-auto">
      {/* Chat-like Results Display */}
      <div className="flex-1 overflow-y-auto pb-8">
        <div className="space-y-6">
          {/* Success Header Message */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-emerald-gradient flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" strokeWidth={1.5} />
              </div>
            </div>
            <div className="flex-1">
              <div className="text-xs text-zinc-500 mb-1">FormVerse</div>
              <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl rounded-tl-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Research Complete!</h2>
                    <p className="text-zinc-400 text-sm">
                      Completed on {researchResult.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="text-zinc-300 leading-relaxed">
                  I&apos;ve analyzed your requirements and gathered comprehensive insights. Here&apos;s what I found:
                </p>
              </div>
            </div>
          </div>

          {/* Findings Sections */}
          {sections.map((section, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-emerald-gradient flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" strokeWidth={1.5} />
                </div>
              </div>
              <div className="flex-1">
                <div className="text-xs text-zinc-500 mb-1">FormVerse</div>
                <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl rounded-tl-sm p-6">
                  <h3 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                    {section.title}
                  </h3>
                  <div className="prose prose-invert max-w-none prose-headings:text-white prose-h4:text-lg prose-h4:font-semibold prose-p:text-zinc-300 prose-p:leading-relaxed prose-strong:text-white prose-strong:font-semibold prose-li:text-zinc-300 prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:text-emerald-300">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {section.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Sources Section */}
          {researchResult.sources.length > 0 && (
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-emerald-gradient flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" strokeWidth={1.5} />
                </div>
              </div>
              <div className="flex-1">
                <div className="text-xs text-zinc-500 mb-1">FormVerse</div>
                <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl rounded-tl-sm p-6">
                  <h3 className="text-xl font-bold text-emerald-400 mb-4">Sources & References</h3>
                  <div className="space-y-3">
                    {researchResult.sources.map((source, index) => (
                      <div
                        key={index}
                        className="bg-zinc-950/50 rounded-xl border border-zinc-700 p-4 hover:border-emerald-500/50 transition-all"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xs font-semibold">
                                {index + 1}
                              </div>
                              <h4 className="font-semibold text-white">
                                {source.title}
                              </h4>
                            </div>
                            <p className="text-zinc-400 text-sm mb-3">
                              {source.snippet}
                            </p>
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
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
              </div>
            </div>
          )}

          {/* Your Inputs Summary */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-emerald-gradient flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" strokeWidth={1.5} />
              </div>
            </div>
            <div className="flex-1">
              <div className="text-xs text-zinc-500 mb-1">FormVerse</div>
              <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl rounded-tl-sm p-6">
                <h3 className="text-xl font-bold text-emerald-400 mb-4">Your Research Inputs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(formData).map(([key, value]) => (
                    <div key={key} className="bg-zinc-950/50 rounded-lg border border-zinc-700 p-4">
                      <dt className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
                        {key.replace(/_/g, ' ')}
                      </dt>
                      <dd className="text-white font-medium">
                        {Array.isArray(value) ? value.join(', ') : String(value)}
                      </dd>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="sticky bottom-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent pt-6 pb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900/80 backdrop-blur-xl text-zinc-300 hover:text-white rounded-xl border border-zinc-700 hover:border-zinc-600 font-medium transition-all"
          >
            <Download className="w-5 h-5" strokeWidth={1.5} />
            Download Results
          </button>
          
          <button
            onClick={handleStartOver}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-gradient text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 font-medium transition-all"
          >
            <RefreshCw className="w-5 h-5" strokeWidth={1.5} />
            Start New Research
          </button>
        </div>
      </div>

      {/* Progress Timeline */}
      <ProgressTimeline />
    </div>
  );
}
