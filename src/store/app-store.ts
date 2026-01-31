import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  AppState, 
  type UserContext, 
  type UserLocation,
  type FormStructure, 
  type Message,
  type ResearchResult,
  type StateLog,
} from '@/types';
import { StateMachine } from '@/lib/state-machine';
import { generateId } from '@/lib/utils';

interface ChatSession {
  id: string;
  title: string;
  date: string;
  stateMachine: StateMachine;
  currentState: AppState;
  stateHistory: StateLog[];
  messages: Message[];
  formStructure: FormStructure | null;
  formData: Record<string, any>;
  researchResult: ResearchResult | null;
  isResearching: boolean;
  lastUpdated: Date;
}

interface AppStore {
  // Session Management
  sessions: ChatSession[];
  currentSessionId: string | null;
  
  // User Context (shared across sessions)
  userContext: UserContext | null;
  
  // Current Session Getters
  getCurrentSession: () => ChatSession | null;
  
  // Session Actions
  createSession: (title?: string) => string;
  loadSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  renameSession: (sessionId: string, title: string) => void;
  saveCurrentSession: () => void;
  
  // State Machine (from current session)
  currentState: AppState;
  stateHistory: StateLog[];
  messages: Message[];
  formStructure: FormStructure | null;
  formData: Record<string, any>;
  researchResult: ResearchResult | null;
  isResearching: boolean;
  
  // Actions
  transitionState: (toState: AppState, metadata?: Record<string, any>) => boolean;
  setUserContext: (context: UserContext) => void;
  updateLocation: (location: UserLocation) => void;
  addMessage: (role: 'user' | 'assistant', content: string, metadata?: Record<string, any>) => void;
  clearMessages: () => void;
  setFormStructure: (form: FormStructure) => void;
  updateFormData: (fieldId: string, value: any) => void;
  clearFormData: () => void;
  setResearchResult: (result: ResearchResult | null) => void;
  setIsResearching: (isResearching: boolean) => void;
  reset: () => void;
}

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        sessions: [],
        currentSessionId: null,
        userContext: null,
        currentState: AppState.INTERVIEWING,
        stateHistory: [],
        messages: [],
        formStructure: null,
        formData: {},
        researchResult: null,
        isResearching: false,

        // Get Current Session
        getCurrentSession: () => {
          const { sessions, currentSessionId } = get();
          return sessions.find(s => s.id === currentSessionId) || null;
        },

        // Session Management
        createSession: (title) => {
          const sessionId = generateId('session');
          const now = new Date();
          const stateMachine = new StateMachine();
          
          const newSession: ChatSession = {
            id: sessionId,
            title: title || 'New Research',
            date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            stateMachine,
            currentState: AppState.INTERVIEWING,
            stateHistory: stateMachine.getHistory(),
            messages: [],
            formStructure: null,
            formData: {},
            researchResult: null,
            isResearching: false,
            lastUpdated: now,
          };

          set((state) => ({
            sessions: [newSession, ...state.sessions],
            currentSessionId: sessionId,
            currentState: AppState.INTERVIEWING,
            stateHistory: stateMachine.getHistory(),
            messages: [],
            formStructure: null,
            formData: {},
            researchResult: null,
            isResearching: false,
          }));

          return sessionId;
        },

        loadSession: (sessionId) => {
          const { sessions } = get();
          const session = sessions.find(s => s.id === sessionId);
          
          if (session) {
            set({
              currentSessionId: sessionId,
              currentState: session.currentState,
              stateHistory: session.stateHistory,
              messages: session.messages,
              formStructure: session.formStructure,
              formData: session.formData,
              researchResult: session.researchResult,
              isResearching: session.isResearching,
            });
          }
        },

        deleteSession: (sessionId) => {
          const { sessions, currentSessionId } = get();
          const updatedSessions = sessions.filter(s => s.id !== sessionId);
          
          // If deleting current session, switch to another or create new
          if (currentSessionId === sessionId) {
            if (updatedSessions.length > 0) {
              const nextSession = updatedSessions[0];
              set({
                sessions: updatedSessions,
                currentSessionId: nextSession.id,
                currentState: nextSession.currentState,
                stateHistory: nextSession.stateHistory,
                messages: nextSession.messages,
                formStructure: nextSession.formStructure,
                formData: nextSession.formData,
                researchResult: nextSession.researchResult,
                isResearching: nextSession.isResearching,
              });
            } else {
              // No sessions left, create a new one
              set({ sessions: [] });
              get().createSession('New Research');
            }
          } else {
            set({ sessions: updatedSessions });
          }
        },

        renameSession: (sessionId, title) => {
          set((state) => ({
            sessions: state.sessions.map(s => 
              s.id === sessionId ? { ...s, title } : s
            ),
          }));
        },

        // Save current state to session
        saveCurrentSession: () => {
          const { 
            sessions, 
            currentSessionId, 
            currentState, 
            stateHistory, 
            messages, 
            formStructure, 
            formData, 
            researchResult, 
            isResearching 
          } = get();
          
          if (!currentSessionId) return;

          set({
            sessions: sessions.map(s => 
              s.id === currentSessionId 
                ? { 
                    ...s, 
                    currentState, 
                    stateHistory, 
                    messages, 
                    formStructure, 
                    formData, 
                    researchResult, 
                    isResearching,
                    lastUpdated: new Date(),
                  } 
                : s
            ),
          });
        },

        // State Machine Actions
        transitionState: (toState, metadata) => {
          const session = get().getCurrentSession();
          if (!session) return false;

          const success = session.stateMachine.transition(toState, metadata);
          
          if (success) {
            set({
              currentState: toState,
              stateHistory: session.stateMachine.getHistory(),
            });
            get().saveCurrentSession();
          }
          
          return success;
        },

        // User Context Actions
        setUserContext: (context) => {
          set({ userContext: context });
        },

        updateLocation: (location) => {
          const { userContext } = get();
          if (userContext) {
            set({
              userContext: {
                ...userContext,
                location,
              },
            });
          }
        },

        // Message Actions
        addMessage: (role, content, metadata) => {
          const message: Message = {
            id: generateId('msg'),
            role,
            content,
            timestamp: new Date(),
            metadata,
          };
          
          set((state) => ({
            messages: [...state.messages, message],
          }));
          get().saveCurrentSession();
        },

        clearMessages: () => {
          set({ messages: [] });
          get().saveCurrentSession();
        },

        // Form Actions
        setFormStructure: (form) => {
          set({ formStructure: form });
          get().saveCurrentSession();
        },

        updateFormData: (fieldId, value) => {
          set((state) => ({
            formData: {
              ...state.formData,
              [fieldId]: value,
            },
          }));
          get().saveCurrentSession();
        },

        clearFormData: () => {
          set({ formData: {} });
          get().saveCurrentSession();
        },

        // Research Actions
        setResearchResult: (result) => {
          set({ researchResult: result });
          get().saveCurrentSession();
        },

        setIsResearching: (isResearching) => {
          set({ isResearching });
          get().saveCurrentSession();
        },

        // Reset Action (creates new session)
        reset: () => {
          get().createSession('New Research');
        },
      }),
      {
        name: 'formverse-storage',
        partialize: (state) => ({
          sessions: state.sessions,
          currentSessionId: state.currentSessionId,
          userContext: state.userContext,
        }),
      }
    ),
    {
      name: 'research-form-builder',
    }
  )
);
