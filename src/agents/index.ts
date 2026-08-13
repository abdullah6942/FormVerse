import { Mastra } from '@mastra/core';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { researchTools } from './tools';
import { 
  FORM_BUILDER_SYSTEM_PROMPT, 
  FORM_BUILDER_USER_CONTEXT_TEMPLATE 
} from './prompts/form-builder';
import { 
  RESEARCH_AGENT_SYSTEM_PROMPT,
  RESEARCH_AGENT_USER_CONTEXT_TEMPLATE 
} from './prompts/research-agent';
import { researchWorkflow } from './workflows/research-workflow';
import { getLocationContext, getRegionalContext } from '@/lib/geolocation';
import type { UserContext, FormStructure } from '@/types';

/**
 * Initialize Mastra instance with agents, workflows, and memory
 * Using in-memory storage for simplicity
 */
export const mastra = new Mastra({
  agents: {
    formBuilder: new Agent({
      id: 'formBuilder',
      name: 'Form Builder Agent',
      description: 'Conversational agent that interviews users to understand their research needs and generates dynamic forms with conditional logic',
      instructions: FORM_BUILDER_SYSTEM_PROMPT,
      model: 'anthropic/claude-haiku-4-5',
    }),
    researcher: new Agent({
      id: 'researcher',
      name: 'Research Agent',
      description: 'Research agent that conducts comprehensive research using an agentic loop (Plan → Execute → Reflect → Terminate) with access to multiple research tools',
      instructions: RESEARCH_AGENT_SYSTEM_PROMPT,
      model: 'anthropic/claude-haiku-4-5',
      tools: researchTools,
    }),
  },
  workflows: {
    researchWorkflow,
  },
});

/**
 * Helper: Format user context for agent prompts
 */
export function formatUserContext(userContext: UserContext, template: string): string {
  const loc = userContext.location;
  
  let context = template
    .replace('{city}', loc.city)
    .replace('{region}', loc.region)
    .replace('{country}', loc.country)
    .replace('{countryCode}', loc.countryCode)
    .replace('{timezone}', loc.timezone);
  
  if (loc.currency) {
    context = context.replace('{currency}', `Currency: ${loc.currency}`);
  } else {
    context = context.replace('{currency}', '');
  }
  
  if (loc.languages && loc.languages.length > 0) {
    context = context.replace('{languages}', `Languages: ${loc.languages.join(', ')}`);
  } else {
    context = context.replace('{languages}', '');
  }
  
  context = context.replace('{regionalContext}', getRegionalContext(loc));
  
  return context;
}

/**
 * Helper: Extract form structure from agent response
 */
export function extractFormStructure(response: string): FormStructure | null {
  try {
    // Look for JSON in the response
    const jsonMatch = response.match(/\{[\s\S]*"form"[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);
    if (!parsed.ready || !parsed.form) return null;

    return {
      ...parsed.form,
      id: `form_${Date.now()}`,
      createdAt: new Date(),
    };
  } catch (error) {
    console.error('Error extracting form structure:', error);
    return null;
  }
}

/**
 * Helper: Build research prompt with form data and context
 */
export function buildResearchPrompt(
  formData: Record<string, any>,
  userContext?: UserContext
): string {
  let prompt = RESEARCH_AGENT_USER_CONTEXT_TEMPLATE;

  if (userContext) {
    prompt = formatUserContext(userContext, prompt);
  }

  // Format form data
  const formDataStr = Object.entries(formData)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
  
  prompt = prompt.replace('{formData}', formDataStr);

  return prompt;
}

// Export constants for use in prompts
export { FORM_BUILDER_USER_CONTEXT_TEMPLATE, RESEARCH_AGENT_USER_CONTEXT_TEMPLATE };
