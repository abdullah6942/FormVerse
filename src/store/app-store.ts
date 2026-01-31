import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
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

interface AppStore {
  // State Machine
  stateMachine: StateMachine;
  currentState: AppState;
  stateHistory: StateLog[];
  
  // User Context
  userContext: UserContext | null;
  
  // Conversation
  messages: Message[];
  
  // Form
  formStructure: FormStructure | null;
  formData: Record<string, any>;
  
  // Research
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
    (set, get) => ({
      // Initial State
      stateMachine: new StateMachine(),
      currentState: AppState.INTERVIEWING,
      stateHistory: [],
      userContext: null,
      messages: [],
      formStructure: null,
      formData: {},
      researchResult: null,
      isResearching: false,

      // State Machine Actions
      transitionState: (toState, metadata) => {
        const { stateMachine } = get();
        const success = stateMachine.transition(toState, metadata);
        
        if (success) {
          set({
            currentState: toState,
            stateHistory: stateMachine.getHistory(),
          });
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
      },

      clearMessages: () => {
        set({ messages: [] });
      },

      // Form Actions
      setFormStructure: (form) => {
        set({ formStructure: form });
      },

      updateFormData: (fieldId, value) => {
        set((state) => ({
          formData: {
            ...state.formData,
            [fieldId]: value,
          },
        }));
      },

      clearFormData: () => {
        set({ formData: {} });
      },

      // Research Actions
      setResearchResult: (result) => {
        set({ researchResult: result });
      },

      setIsResearching: (isResearching) => {
        set({ isResearching });
      },

      // Reset Action
      reset: () => {
        const stateMachine = new StateMachine();
        set({
          stateMachine,
          currentState: AppState.INTERVIEWING,
          stateHistory: stateMachine.getHistory(),
          messages: [],
          formStructure: null,
          formData: {},
          researchResult: null,
          isResearching: false,
        });
      },
    }),
    {
      name: 'research-form-builder',
    }
  )
);
