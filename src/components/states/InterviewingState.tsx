'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store/app-store';
import { AppState } from '@/types';
import { Send, Loader2, Sparkles, User, Copy, RefreshCw, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProgressTimeline from '@/components/ProgressTimeline';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';

export default function InterviewingState() {
  const { messages, addMessage, setFormStructure, transitionState, userContext } = useAppStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingForm, setIsGeneratingForm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
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

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    // Auto-submit after a brief delay to show the text was populated
    setTimeout(() => {
      const form = textareaRef.current?.form;
      if (form) {
        form.requestSubmit();
      }
    }, 100);
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

  const handleCopy = async (text: string, messageId: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRegenerate = () => {
    if (messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
      if (lastUserMessage) {
        setInput(lastUserMessage.content);
        setTimeout(() => {
          const form = textareaRef.current?.form;
          if (form) {
            form.requestSubmit();
          }
        }, 100);
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Empty State / Messages */}
      <div className="flex-1 pb-32">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">
              What would you like to <span className="italic text-emerald-400">research</span> today?
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl mb-8">
              Tell me about your research needs and I&apos;ll help create a custom form for you.
            </p>
            
            {/* Suggestion Chips */}
            <div className="flex flex-wrap gap-3 justify-center max-w-3xl">
              <button
                onClick={() => handleSuggestionClick("I want to find the best CRM software for my startup")}
                className="px-4 py-2.5 bg-zinc-900/50 hover:bg-zinc-800/50 border border-zinc-700/50 hover:border-emerald-500/50 rounded-xl text-zinc-300 hover:text-white text-sm transition-all"
              >
                Find the best CRM for my startup
              </button>
              <button
                onClick={() => handleSuggestionClick("I need to research payment processors for e-commerce")}
                className="px-4 py-2.5 bg-zinc-900/50 hover:bg-zinc-800/50 border border-zinc-700/50 hover:border-emerald-500/50 rounded-xl text-zinc-300 hover:text-white text-sm transition-all"
              >
                Research e-commerce payment processors
              </button>
              <button
                onClick={() => handleSuggestionClick("Help me compare project management tools for remote teams")}
                className="px-4 py-2.5 bg-zinc-900/50 hover:bg-zinc-800/50 border border-zinc-700/50 hover:border-emerald-500/50 rounded-xl text-zinc-300 hover:text-white text-sm transition-all"
              >
                Compare project management tools
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8 py-8">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-4 group',
                  message.role === 'user' && 'justify-end'
                )}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-emerald-gradient flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <Sparkles className="w-4 h-4 text-white" strokeWidth={1.5} />
                    </div>
                  </div>
                )}
                
                <div className={cn(
                  'flex flex-col gap-2 max-w-[85%]',
                  message.role === 'user' && 'items-end'
                )}>
                  <div className="flex items-center gap-2">
                    {message.role === 'assistant' && (
                      <span className="text-xs font-medium text-emerald-400">FormVerse</span>
                    )}
                    {message.role === 'user' && (
                      <span className="text-xs font-medium text-zinc-400">You</span>
                    )}
                  </div>
                  
                  <div
                    className={cn(
                      'w-full',
                      message.role === 'user'
                        ? 'bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl rounded-tr-sm px-5 py-3.5'
                        : 'text-zinc-100'
                    )}
                  >
                    {message.role === 'assistant' ? (
                      <div className="prose prose-sm prose-invert max-w-none
                        prose-headings:font-semibold prose-headings:text-white
                        prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
                        prose-p:text-zinc-200 prose-p:leading-relaxed prose-p:my-3
                        prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-white prose-strong:font-semibold
                        prose-code:text-emerald-300 prose-code:bg-zinc-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-['']
                        prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-700/50 prose-pre:shadow-lg
                        prose-ul:text-zinc-200 prose-ol:text-zinc-200
                        prose-li:my-1 prose-li:text-zinc-200
                        prose-blockquote:border-l-emerald-500 prose-blockquote:text-zinc-300
                        prose-hr:border-zinc-700">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm, remarkMath]}
                          rehypePlugins={[rehypeKatex, rehypeRaw]}
                          components={{
                            code({ node: _node, inline, className, children, ...props }: any) {
                              const match = /language-(\w+)/.exec(className || '');
                              return !inline && match ? (
                                <SyntaxHighlighter
                                  style={oneDark}
                                  language={match[1]}
                                  PreTag="div"
                                  customStyle={{
                                    margin: 0,
                                    borderRadius: '0.5rem',
                                    fontSize: '0.875rem',
                                  }}
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              ) : (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              );
                            },
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed text-white">
                        {message.content}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons for Assistant Messages */}
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleCopy(message.content, message.id)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 rounded-lg transition-colors"
                        title="Copy message"
                      >
                        {copiedId === message.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                      {index === messages.length - 1 && (
                        <button
                          onClick={handleRegenerate}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 rounded-lg transition-colors"
                          title="Regenerate response"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Regenerate</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {message.role === 'user' && (
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-zinc-700/50 border border-zinc-600/50 flex items-center justify-center">
                      <User className="w-4 h-4 text-zinc-300" strokeWidth={1.5} />
                    </div>
                  </div>
                )}
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
