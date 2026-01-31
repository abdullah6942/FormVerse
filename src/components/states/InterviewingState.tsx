'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store/app-store';
import { AppState } from '@/types';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProgressTimeline from '@/components/ProgressTimeline';

export default function InterviewingState() {
  const { messages, addMessage, setFormStructure, transitionState, userContext } = useAppStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingForm, setIsGeneratingForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    addMessage('user', userMessage);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage },
          ],
          userContext,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Check if form structure was generated
        if (data.formStructure) {
          // Show only the message, not the JSON
          const messageWithoutJSON = data.response.split('```json')[0].trim();
          addMessage('assistant', messageWithoutJSON);
          
          // Show form generation loading state
          setIsGeneratingForm(true);
          setFormStructure(data.formStructure);
          
          // Delay to show loading animation
          setTimeout(() => {
            transitionState(AppState.FORM_PREVIEW);
            setIsGeneratingForm(false);
          }, 1500);
        } else {
          addMessage('assistant', data.response);
        }
      } else {
        addMessage('assistant', 'Sorry, I encountered an error. Please try again.');
      }
    } catch (error) {
      console.error('Chat error:', error);
      addMessage('assistant', 'Sorry, something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Empty State / Messages */}
      <div className="flex-1 overflow-y-auto pb-32">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">
              What would you like to <span className="italic text-emerald-400">research</span> today?
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl">
              Tell me about your research needs and I&apos;ll help create a custom form for you.
            </p>
          </div>
        ) : (
          <div className="space-y-6 py-8">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-4',
                  message.role === 'user' && 'justify-end'
                )}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0">
                    <div className="w-7 h-7 rounded-full bg-emerald-gradient flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" strokeWidth={1.5} />
                    </div>
                  </div>
                )}
                
                <div className={cn(
                  'flex flex-col',
                  message.role === 'user' && 'items-end'
                )}>
                  {message.role === 'assistant' && (
                    <span className="text-xs text-zinc-500 mb-1">FormVerse</span>
                  )}
                  <div
                    className={cn(
                      'max-w-[85%]',
                      message.role === 'user'
                        ? 'bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl rounded-tr-sm px-4 py-3'
                        : 'text-zinc-100'
                    )}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-7 h-7 rounded-full bg-emerald-gradient flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" strokeWidth={1.5} />
                  </div>
                </div>
                <div>
                  <span className="text-xs text-zinc-500 mb-1 block">FormVerse</span>
                  <Loader2 className="w-5 h-5 text-zinc-400 animate-spin" />
                </div>
              </div>
            )}
            
            {isGeneratingForm && (
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-7 h-7 rounded-full bg-emerald-gradient flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" strokeWidth={1.5} />
                  </div>
                </div>
                <div>
                  <span className="text-xs text-zinc-500 mb-1 block">FormVerse</span>
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
                    <span className="text-sm text-zinc-300">Generating your custom form...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 lg:left-80 right-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent pt-6 pb-8">
        <div className="max-w-3xl mx-auto px-4">
          <form onSubmit={handleSubmit} className="relative">
            <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-700/50 rounded-3xl shadow-2xl shadow-black/50">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message FormVerse..."
                disabled={isLoading}
                rows={1}
                className="w-full bg-transparent border-none text-white placeholder:text-zinc-500 focus:ring-0 py-4 px-6 pr-14 resize-none outline-none disabled:cursor-not-allowed overflow-hidden"
                style={{ minHeight: '56px', maxHeight: '200px' }}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-3 bottom-3 size-10 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <Send className="w-5 h-5 text-white" strokeWidth={1.5} />
              </button>
            </div>
            <p className="text-xs text-zinc-600 text-center mt-2">
              Press Enter to send, Shift + Enter for new line
            </p>
          </form>
        </div>
      </div>

      {/* Progress Timeline */}
      <ProgressTimeline />
    </div>
  );
}
