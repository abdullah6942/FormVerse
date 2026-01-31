'use client';

import { useAppStore } from '@/store/app-store';
import { Sparkles, MessageSquare, Menu, X, Plus, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ConfirmDialog from './ConfirmDialog';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen: externalIsOpen = true, onClose }: SidebarProps) {
  const { 
    sessions, 
    currentSessionId, 
    createSession, 
    loadSession, 
    deleteSession, 
    renameSession 
  } = useAppStore();
  
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen; // Use prop for desktop, internal state for mobile
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Create initial session if none exists
  useEffect(() => {
    if (sessions.length === 0) {
      createSession('New Research');
    }
  }, []);

  const handleNewChat = () => {
    createSession('New Research');
  };

  const handleRename = (id: string, currentTitle: string) => {
    setRenamingId(id);
    setRenameValue(currentTitle);
    setActiveMenu(null);
  };

  const handleRenameSubmit = (id: string) => {
    if (renameValue.trim()) {
      renameSession(id, renameValue.trim());
    }
    setRenamingId(null);
    setRenameValue('');
  };

  const handleDelete = (id: string) => {
    setDeleteConfirm(id);
    setActiveMenu(null);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteSession(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  const handleChatClick = (id: string) => {
    loadSession(id);
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="p-4 border-b border-zinc-800/50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-gradient flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" strokeWidth={1.5} />
          </div>
          <span className="text-lg font-bold text-white">FormVerse</span>
        </Link>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors border border-emerald-500/30"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          <span className="text-sm font-medium">New Research</span>
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-4">
        <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
          Chat History
        </h3>
        <div className="space-y-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={cn(
                "relative w-full flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800/50 transition-colors group cursor-pointer",
                currentSessionId === session.id && "bg-zinc-800/50"
              )}
              onClick={() => handleChatClick(session.id)}
            >
              <MessageSquare className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <div className="flex-1 min-w-0" onClick={(e) => renamingId === session.id && e.stopPropagation()}>
                {renamingId === session.id ? (
                  <input
                    type="text"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={() => handleRenameSubmit(session.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRenameSubmit(session.id);
                      if (e.key === 'Escape') { setRenamingId(null); setRenameValue(''); }
                    }}
                    autoFocus
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-300 focus:outline-none focus:border-emerald-500"
                  />
                ) : (
                  <>
                    <p className="text-sm text-zinc-300 truncate group-hover:text-white transition-colors">
                      {session.title}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">{session.date}</p>
                  </>
                )}
              </div>
              
              <div className="relative opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setActiveMenu(activeMenu === session.id ? null : session.id)}
                  className="p-1 hover:bg-zinc-700 rounded transition-colors"
                >
                  <MoreVertical className="w-4 h-4 text-zinc-400" strokeWidth={1.5} />
                </button>
                
                {activeMenu === session.id && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setActiveMenu(null)}
                    />
                    <div className="absolute right-0 top-8 z-20 w-40 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl overflow-hidden">
                      <button
                        onClick={() => handleRename(session.id, session.title)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
                      >
                        <Pencil className="w-4 h-4" strokeWidth={1.5} />
                        Rename
                      </button>
                      <button
                        onClick={() => handleDelete(session.id)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-zinc-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button - only shown on mobile */}
      <button
        onClick={() => setInternalIsOpen(!internalIsOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white"
      >
        {internalIsOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {internalIsOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setInternalIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 h-screen w-80 bg-[#111111] border-r border-zinc-800/50 flex flex-col z-40 transition-transform duration-300',
          internalIsOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          !isOpen && 'lg:-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        title="Delete Chat"
        message="Delete this chat? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
    </>
  );
}
