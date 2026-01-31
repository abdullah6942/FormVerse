import { z } from 'zod';

// ============================================================================
// STATE MACHINE TYPES
// ============================================================================

export enum AppState {
  INTERVIEWING = 'INTERVIEWING',
  FORM_PREVIEW = 'FORM_PREVIEW',
  FORM_ACTIVE = 'FORM_ACTIVE',
  RESEARCHING = 'RESEARCHING',
  PRESENTING = 'PRESENTING',
}

export const StateTransitions: Record<AppState, AppState[]> = {
  [AppState.INTERVIEWING]: [AppState.FORM_PREVIEW],
  [AppState.FORM_PREVIEW]: [AppState.INTERVIEWING, AppState.FORM_ACTIVE],
  [AppState.FORM_ACTIVE]: [AppState.FORM_PREVIEW, AppState.RESEARCHING],
  [AppState.RESEARCHING]: [AppState.PRESENTING],
  [AppState.PRESENTING]: [AppState.INTERVIEWING],
};

export interface StateLog {
  from: AppState;
  to: AppState;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// ============================================================================
// USER CONTEXT TYPES
// ============================================================================

export interface UserLocation {
  country: string;
  countryCode: string;
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  timezone: string;
  currency?: string;
  languages?: string[];
  isOverridden: boolean;
}

export interface UserContext {
  location: UserLocation;
  sessionId: string;
  timestamp: Date;
}

// ============================================================================
// FORM FIELD TYPES
// ============================================================================

export enum FieldType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  MULTISELECT = 'multiselect',
  NUMBER = 'number',
  DATE = 'date',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
}

export interface FieldCondition {
  fieldId: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
  value: any;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
  };
  conditions?: FieldCondition[];
  helpText?: string;
  defaultValue?: any;
}

export interface FormStructure {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  createdAt: Date;
}

// ============================================================================
// RESEARCH TYPES
// ============================================================================

export interface ResearchSource {
  title: string;
  url: string;
  snippet: string;
  relevance: number;
}

export interface ResearchResult {
  id: string;
  query: string;
  findings: string;
  sources: ResearchSource[];
  timestamp: Date;
  formData: Record<string, any>;
}

export interface ToolExecution {
  toolName: string;
  input: any;
  output: any;
  timestamp: Date;
  success: boolean;
  error?: string;
}

export interface AgentLoop {
  iterations: number;
  plan: string[];
  executions: ToolExecution[];
  reflection: string;
  shouldContinue: boolean;
}

// ============================================================================
// MESSAGE TYPES
// ============================================================================

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

export const LocationSchema = z.object({
  country: z.string(),
  countryCode: z.string(),
  city: z.string(),
  region: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string(),
  currency: z.string().optional(),
  languages: z.array(z.string()).optional(),
  isOverridden: z.boolean(),
});

export const FormFieldSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(FieldType),
  label: z.string(),
  placeholder: z.string().optional(),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
  validation: z.object({
    pattern: z.string().optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    minLength: z.number().optional(),
    maxLength: z.number().optional(),
  }).optional(),
  conditions: z.array(z.object({
    fieldId: z.string(),
    operator: z.enum(['equals', 'notEquals', 'contains', 'greaterThan', 'lessThan']),
    value: z.any(),
  })).optional(),
  helpText: z.string().optional(),
  defaultValue: z.any().optional(),
});

export const FormStructureSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  fields: z.array(FormFieldSchema),
  createdAt: z.date(),
});
