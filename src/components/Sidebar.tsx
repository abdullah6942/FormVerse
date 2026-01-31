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

      {/* Company Logo */}
      <div className="p-4 border-t border-zinc-800/50">
        <a 
          href="https://www.clientacquisition.io/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center hover:opacity-80 transition-opacity"
        >
          <svg width="240" height="30" viewBox="0 0 362 45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M74.4024 28.28C72.0324 28.28 70.3424 26.43 70.3424 23.94C70.3424 21.54 71.9424 19.6 74.2824 19.6C76.0324 19.6 77.3624 20.4 78.1024 22H83.2724C82.3224 17.66 78.6524 14.83 74.1624 14.83C69.2324 14.83 65.2024 18.8 65.2024 23.91C65.2024 28.96 69.2024 33.05 74.2524 33.05C78.6224 33.05 82.2924 30.28 83.3024 26H78.1024C77.3224 27.48 76.1224 28.28 74.4024 28.28Z" fill="white"/>
            <path d="M91.0524 9.70999H85.9424V32.49H91.0524V9.70999Z" fill="white"/>
            <path d="M99.7824 9.70999H94.6724V13.59H99.7824V9.70999Z" fill="white"/>
            <path d="M99.7824 15.41H94.6724V32.5H99.7824V15.41Z" fill="white"/>
            <path d="M111.442 14.83C106.422 14.83 102.482 19.08 102.482 24C102.482 29.08 106.612 33.05 111.532 33.05C115.132 33.05 118.242 30.86 119.872 27.14H114.642C113.812 28.22 112.922 28.74 111.532 28.74C109.442 28.74 107.802 27.45 107.532 25.51H120.342C120.432 25.05 120.462 24.65 120.462 24.16C120.462 18.86 116.552 14.83 111.442 14.83ZM107.592 22.06C107.992 20.24 109.592 19.14 111.442 19.14C113.412 19.14 114.952 20.31 115.352 22.06H107.592Z" fill="white"/>
            <path d="M132.622 14.83C130.562 14.83 129.052 15.48 127.972 17.23H127.912V15.41H123.142V32.5H128.252V23.08C128.252 20.77 129.112 19.63 131.172 19.63C133.052 19.63 133.852 20.71 133.852 23.02V32.5H138.962V21.6C138.962 16.55 135.702 14.83 132.622 14.83Z" fill="white"/>
            <path d="M147.702 9.70999H142.592V32.5H147.702V19.29H150.162V15.41H147.702V9.70999Z" fill="white"/>
            <path d="M164.842 17.23H164.782C163.792 15.66 161.862 14.83 159.762 14.83C154.862 14.83 151.202 18.89 151.202 23.94C151.202 29.11 154.712 33.08 159.762 33.08C162.012 33.08 164.042 32.16 164.782 30.65H164.842V32.5H169.952V15.41H164.842V17.23ZM160.562 28.31C158.192 28.31 156.312 26.37 156.312 24C156.312 21.54 158.162 19.6 160.502 19.6C162.902 19.6 164.842 21.54 164.842 23.94C164.842 26.4 162.962 28.31 160.562 28.31Z" fill="white"/>
            <path d="M181.922 28.28C179.552 28.28 177.862 26.43 177.862 23.94C177.862 21.54 179.462 19.6 181.802 19.6C183.552 19.6 184.882 20.4 185.622 22H190.792C189.842 17.66 186.172 14.83 181.682 14.83C176.752 14.83 172.722 18.8 172.722 23.91C172.722 28.96 176.722 33.05 181.772 33.05C186.142 33.05 189.812 30.28 190.822 26H185.622C184.852 27.48 183.652 28.28 181.922 28.28Z" fill="white"/>
            <path d="M206.342 17.29H206.282C205.292 15.66 203.392 14.83 201.202 14.83C196.152 14.83 192.642 18.86 192.642 24.28C192.642 29.18 196.122 33.05 200.892 33.05C203.202 33.05 204.952 32.25 206.062 30.74H206.122V38.19H211.232V15.41H206.332V17.29H206.342ZM202.032 28.28C199.662 28.28 197.752 26.37 197.752 24.06C197.752 21.44 199.602 19.6 201.972 19.6C204.402 19.6 206.312 21.54 206.312 23.97C206.312 26.34 204.432 28.28 202.032 28.28Z" fill="white"/>
            <path d="M225.622 24.89C225.622 26.98 224.632 28.28 222.702 28.28C220.772 28.28 219.962 27.23 219.962 24.99V15.42H214.852V26.04C214.852 30.9 217.842 33.06 221.442 33.06C223.752 33.06 225.102 32.26 225.842 30.69H225.902V32.51H230.732V15.42H225.622V24.89Z" fill="white"/>
            <path d="M239.512 15.41H234.402V32.5H239.512V15.41Z" fill="white"/>
            <path d="M239.512 9.70999H234.402V13.59H239.512V9.70999Z" fill="white"/>
            <path d="M250.722 22.06C248.352 21.44 247.522 20.98 247.522 20.06C247.522 19.41 248.142 18.92 249.002 18.92C249.832 18.92 250.542 19.23 250.572 20.21H255.592C255.342 16.85 252.732 14.82 249.032 14.82C245.582 14.82 242.412 17.01 242.412 20.39C242.412 22.39 243.552 24.08 247.862 25.41C250.412 26.21 251.002 26.7 251.002 27.66C251.002 28.46 250.112 28.98 249.212 28.98C248.192 28.98 247.422 28.49 247.272 27.41H242.192C242.562 30.89 245.302 33.07 249.152 33.07C253.032 33.07 256.112 30.82 256.112 27.25C256.102 24.77 254.782 23.14 250.722 22.06Z" fill="white"/>
            <path d="M263.913 15.41H258.802V32.5H263.913V15.41Z" fill="white"/>
            <path d="M263.913 9.70999H258.802V13.59H263.913V9.70999Z" fill="white"/>
            <path d="M272.652 9.70999H267.542V32.5H272.652V19.29H275.112V15.41H272.652V9.70999Z" fill="white"/>
            <path d="M282.572 15.41H277.462V32.5H282.572V15.41Z" fill="white"/>
            <path d="M282.572 9.70999H277.462V13.59H282.572V9.70999Z" fill="white"/>
            <path d="M294.542 14.86C289.432 14.86 285.332 18.65 285.332 23.94C285.332 29.17 289.332 33.02 294.542 33.02C299.682 33.02 303.752 29.23 303.752 23.88C303.742 18.7 299.682 14.86 294.542 14.86ZM294.542 28.25C292.232 28.25 290.452 26.28 290.452 23.94C290.452 21.6 292.272 19.63 294.512 19.63C296.912 19.63 298.642 21.66 298.642 23.94C298.632 26.22 296.942 28.25 294.542 28.25Z" fill="white"/>
            <path d="M315.992 14.83C313.932 14.83 312.422 15.48 311.342 17.23H311.282V15.41H306.512V32.5H311.622V23.08C311.622 20.77 312.482 19.63 314.542 19.63C316.422 19.63 317.222 20.71 317.222 23.02V32.5H322.332V21.6C322.342 16.55 319.072 14.83 315.992 14.83Z" fill="white"/>
            <path d="M340.682 15.41H335.572V32.5H340.682V15.41Z" fill="white"/>
            <path d="M340.682 9.70999H335.572V13.59H340.682V9.70999Z" fill="white"/>
            <path d="M352.652 14.86C347.542 14.86 343.442 18.65 343.442 23.94C343.442 29.17 347.442 33.02 352.652 33.02C357.792 33.02 361.862 29.23 361.862 23.88C361.852 18.7 357.792 14.86 352.652 14.86ZM352.652 28.25C350.342 28.25 348.562 26.28 348.562 23.94C348.562 21.6 350.382 19.63 352.622 19.63C355.022 19.63 356.752 21.66 356.752 23.94C356.742 26.22 355.052 28.25 352.652 28.25Z" fill="white"/>
            <path d="M332.072 32.5V26.57L326.142 32.5H332.072Z" fill="white"/>
            <path d="M24.1325 16.74L29.7225 26.42H34.1525L24.3225 9.39C24.2425 9.25 24.0325 9.25 23.9525 9.39L9.25252 34.85C9.17252 34.99 9.27252 35.17 9.43252 35.17H49.3125L47.1225 31.34H15.7025L24.1325 16.74Z" fill="white"/>
            <path d="M4.52249 37.79C3.62249 36.23 3.62249 34.37 4.52249 32.81L19.8125 6.31999C20.7125 4.75999 22.3225 3.83 24.1225 3.83C25.9225 3.83 27.5325 4.76 28.4225 6.31L39.8925 26.41H44.3025L31.7425 4.39999C30.1525 1.63999 27.3025 0 24.1125 0C20.9225 0 18.0725 1.64999 16.4825 4.39999L1.1925 30.89C-0.3975 33.65 -0.3975 36.94 1.1925 39.7C2.7825 42.46 5.6325 44.1 8.8225 44.1H44.1325L46.3425 40.27H8.8325C7.0325 40.28 5.42249 39.35 4.52249 37.79Z" fill="white"/>
          </svg>
        </a>
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
