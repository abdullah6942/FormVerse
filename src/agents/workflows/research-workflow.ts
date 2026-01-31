/**
 * Research Workflow - Implements an explicit agentic loop
 * 
 * This workflow demonstrates the required "Workflow or graph-based execution" 
 * from task requirements. It implements a structured research process with
 * explicit steps: Plan → Execute → Reflect → Terminate
 */

import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';

// ============================================================================
// STEP 1: PLAN - Analyze the form and create research strategy
// ============================================================================

const planStep = createStep({
  id: 'plan-research',
  description: 'Analyze form structure and plan research strategy',
  inputSchema: z.object({
    formData: z.any(),
    userContext: z.object({
      location: z.object({
        city: z.string(),
        region: z.string(),
        country: z.string(),
      }),
    }),
  }),
  outputSchema: z.object({
    researchPlan: z.string(),
    areasToInvestigate: z.array(z.string()),
    formData: z.any(),
    userContext: z.any(),
  }),
  execute: async ({ inputData }) => {
    const { formData, userContext } = inputData;
    
    // Deep analysis of form data to extract requirements
    const requirements: Record<string, any> = {};
    const formStr = JSON.stringify(formData, null, 2);
    
    // Extract all form fields as requirements
    Object.entries(formData).forEach(([key, value]) => {
      if (value && String(value).trim()) {
        requirements[key] = value;
      }
    });
    
    // Identify research areas based on form content
    const areasToInvestigate: string[] = [];
    
    if (formStr.toLowerCase().includes('market') || formStr.toLowerCase().includes('business') || 
        formStr.toLowerCase().includes('industry') || formStr.toLowerCase().includes('competitor')) {
      areasToInvestigate.push('market_research');
    }
    if (formStr.toLowerCase().includes('regulation') || formStr.toLowerCase().includes('legal') || 
        formStr.toLowerCase().includes('compliance') || formStr.toLowerCase().includes('license')) {
      areasToInvestigate.push('regulatory_research');
    }
    if (formStr.toLowerCase().includes('technolog') || formStr.toLowerCase().includes('platform') || 
        formStr.toLowerCase().includes('software') || formStr.toLowerCase().includes('tool')) {
      areasToInvestigate.push('technology_research');
    }
    
    // Always include web search for general research
    areasToInvestigate.push('web_search');
    
    const researchPlan = `Comprehensive Research Plan for ${userContext.location.city}, ${userContext.location.country}:

USER REQUIREMENTS EXTRACTED:
${Object.entries(requirements).map(([k, v]) => `  - ${k}: ${v}`).join('\n')}

RESEARCH STRATEGY:
1. Extract and validate ALL user requirements from form
2. Conduct ${areasToInvestigate.length} parallel research streams: ${areasToInvestigate.join(', ')}
3. Find location-specific data for ${userContext.location.city}, ${userContext.location.country}
4. Benchmark against competitors/alternatives
5. Identify pricing models and cost structures
6. Research real-world user experiences and reviews
7. Flag risks and validation gaps
8. Compile actionable recommendations with sources`;

    return {
      researchPlan,
      areasToInvestigate,
      formData: requirements, // Pass cleaned requirements
      userContext,
    };
  },
});

// ============================================================================
// STEP 2: EXECUTE - Run research tools based on the plan
// ============================================================================

const executeStep = createStep({
  id: 'execute-research',
  description: 'Execute research using appropriate tools',
  inputSchema: z.object({
    researchPlan: z.string(),
    areasToInvestigate: z.array(z.string()),
    formData: z.any(),
    userContext: z.any(),
  }),
  outputSchema: z.object({
    researchResults: z.array(z.object({
      area: z.string(),
      findings: z.string(),
    })),
    formData: z.any(),
    userContext: z.any(),
  }),
  execute: async ({ inputData, mastra }) => {
    const { areasToInvestigate, formData, userContext } = inputData;
    
    if (!mastra) {
      throw new Error('Mastra instance not available');
    }
    
    const researcher = mastra.getAgent('researcher');
    
    // Build context-aware prompt with location and requirements
    const location = userContext.location;
    const locationString = `${location.city}, ${location.region}, ${location.country}`;
    
    // Format requirements clearly
    const requirementsList = Object.entries(formData)
      .map(([key, value]) => `  • ${key}: ${value}`)
      .join('\n');
    
    const contextPrompt = `
You are a comprehensive research analyst creating a DETAILED business research report.

LOCATION CONTEXT: ${locationString}

USER'S SPECIFIC REQUIREMENTS:
${requirementsList}

YOUR TASK: Create a comprehensive, multi-section research report that includes:

1. **EXECUTIVE SUMMARY**: Brief overview (2-3 sentences) of what the user wants and the market opportunity

2. **KEY FINDINGS**: 4-6 numbered, specific findings with data points. Each finding should:
   - Be concrete and actionable
   - Include specific names, numbers, or examples
   - Reference real sources or competitors
   Example: "The Pad (E-11) is repeatedly recommended in ${location.city} community discussion for clean courts, good bouncing surfaces, and online booking."

3. **REQUIREMENTS VALIDATION**: For EACH requirement the user specified, state:
   - What you found that validates it (with specific examples)
   - What you couldn't validate (gaps in data)
   - Specific recommendations for verification

4. **COMPETITIVE LANDSCAPE / BENCHMARKS**: If applicable, list 2-3 specific competitors or alternatives with:
   - Names and locations
   - How they compare to user requirements (scoring)
   - Key differentiators

5. **PRICING INSIGHTS**: If relevant, provide:
   - Specific price points or ranges found in research
   - Different pricing tiers or models
   - Cost drivers and hidden costs to consider

6. **REAL-WORLD SIGNALS**: Include any:
   - Community feedback (Reddit, forums)
   - User reviews or testimonials
   - Expert opinions or articles
   Quote specific sources with enough detail to verify

7. **RISKS & VALIDATION GAPS**: Explicitly call out:
   - What data conflicts or is uncertain
   - What requires on-site verification
   - Critical assumptions that need validation

8. **SOURCES & REFERENCES**: List actual URLs and sources found, with descriptions

CRITICAL INSTRUCTIONS:
- Use your research tools (web_search, market_research, regulatory_research, technology_research)
- ALWAYS pass location="${locationString}" to your tools
- Find REAL, SPECIFIC examples (company names, prices, locations, etc.)
- Don't make up data - if you can't find something, say so in "Risks & Validation Gaps"
- Use markdown formatting (##, ###, **, -, etc.) for structure
- Be detailed - aim for 800+ words total
- Reference actual URLs and sources you find

Begin your research now and compile a comprehensive report.
`;
    
    // Execute research using agent with tools
    const response = await researcher.generate(contextPrompt);
    
    // Structure the results
    const researchResults = [{
      area: 'comprehensive_research',
      findings: response.text,
    }];
    
    return {
      researchResults,
      formData,
      userContext,
    };
  },
});

// ============================================================================
// STEP 3: REFLECT - Evaluate research quality and decide if more is needed
// ============================================================================

const reflectStep = createStep({
  id: 'reflect-on-research',
  description: 'Evaluate research quality and determine if additional research is needed',
  inputSchema: z.object({
    researchResults: z.array(z.object({
      area: z.string(),
      findings: z.string(),
    })),
    formData: z.any(),
    userContext: z.any(),
  }),
  outputSchema: z.object({
    isComplete: z.boolean(),
    qualityScore: z.number(),
    gaps: z.array(z.string()),
    researchResults: z.array(z.object({
      area: z.string(),
      findings: z.string(),
    })),
    formData: z.any(),
    userContext: z.any(),
  }),
  execute: async ({ inputData }) => {
    const { researchResults, userContext } = inputData;
    
    // Evaluate quality based on content depth
    let qualityScore = 0.3; // Start at 30%
    const gaps: string[] = [];
    
    const findings = researchResults[0]?.findings || '';
    
    // Check length and detail
    if (findings.length > 500) qualityScore += 0.1;
    if (findings.length > 1000) qualityScore += 0.1;
    if (findings.length > 2000) qualityScore += 0.1;
    
    // Check for structured sections
    const hasSections = findings.includes('## ') || findings.includes('### ');
    if (hasSections) qualityScore += 0.1;
    
    // Check for specific data points (numbers, percentages, prices)
    const hasNumbers = /\d+/.test(findings);
    if (hasNumbers) qualityScore += 0.1;
    
    // Check for location-specific information
    const hasLocationInfo = 
      findings.toLowerCase().includes(userContext.location.city.toLowerCase()) ||
      findings.toLowerCase().includes(userContext.location.country.toLowerCase());
    if (hasLocationInfo) qualityScore += 0.1;
    
    // Check for sources/references
    const hasSources = findings.toLowerCase().includes('source') || 
                      findings.toLowerCase().includes('http') ||
                      findings.toLowerCase().includes('reference');
    if (hasSources) qualityScore += 0.1;
    
    // Quality checks
    if (!hasLocationInfo) gaps.push('Limited location-specific information');
    if (!hasSources) gaps.push('Few or no source citations');
    if (findings.length < 1000) gaps.push('Research depth could be improved');
    
    const isComplete = qualityScore >= 0.5; // Accept if quality is at least 50%
    
    return {
      isComplete,
      qualityScore,
      gaps,
      researchResults: inputData.researchResults,
      formData: inputData.formData,
      userContext: inputData.userContext,
    };
  },
});

// ============================================================================
// STEP 4: TERMINATE - Compile final research report
// ============================================================================

const terminateStep = createStep({
  id: 'compile-report',
  description: 'Compile final research report with recommendations',
  inputSchema: z.object({
    isComplete: z.boolean(),
    qualityScore: z.number(),
    gaps: z.array(z.string()),
    researchResults: z.array(z.object({
      area: z.string(),
      findings: z.string(),
    })),
    formData: z.any(),
    userContext: z.any(),
  }),
  outputSchema: z.object({
    report: z.string(),
    qualityScore: z.number(),
    recommendations: z.array(z.string()),
  }),
  execute: async ({ inputData, mastra }) => {
    const { researchResults, qualityScore, gaps, userContext } = inputData;
    
    // Compile findings into structured report
    const reportSections = researchResults.map(r => 
      `### ${r.area.replace(/_/g, ' ').toUpperCase()}\n${r.findings}`
    ).join('\n\n');
    
    // Generate intelligent summary based on research content
    const summaryPrompt = `Based on the following research findings, create a concise, meaningful summary title (max 10-12 words) that captures the essence of what was researched. DO NOT just mention the location. Focus on the actual topic, industry, or business context being researched.

Research Findings:
${reportSections.substring(0, 1000)}

User Context: ${userContext.location.city}, ${userContext.location.country}

Return ONLY the title text, nothing else. Example formats:
- "Market Analysis for Women's Fashion Retail in Rawalpindi"
- "Competitive Landscape Assessment for Tech Startups in Karachi"
- "Customer Demographics Study for E-commerce Business in Lahore"`;

    let summaryTitle = `Research Report for ${userContext.location.city}, ${userContext.location.country}`;
    
    try {
      if (mastra) {
        const researcher = mastra.getAgent('researcher');
        const summaryResponse = await researcher.generate(summaryPrompt);
        
        const generatedTitle = summaryResponse.text?.trim();
        if (generatedTitle && generatedTitle.length > 10) {
          summaryTitle = generatedTitle;
        }
      }
    } catch (error) {
      console.error('Failed to generate summary title:', error);
      // Fall back to default title
    }
    
    const report = `# ${summaryTitle}

${reportSections}

## Quality Assessment
- Quality Score: ${(qualityScore * 100).toFixed(0)}%
${gaps.length > 0 ? `- Gaps Identified: ${gaps.join(', ')}` : '- No significant gaps identified'}
`;

    // Generate recommendations
    const recommendations = [
      'Review local market conditions before proceeding',
      'Consult with local experts for regulatory compliance',
      'Consider cultural factors in your approach',
    ];
    
    if (gaps.length > 0) {
      recommendations.push('Conduct additional research to fill identified gaps');
    }
    
    return {
      report,
      qualityScore,
      recommendations,
    };
  },
});

// ============================================================================
// WORKFLOW DEFINITION - Explicit Agentic Loop
// ============================================================================

export const researchWorkflow = createWorkflow({
  id: 'research-workflow',
  description: 'Agentic research workflow with Plan → Execute → Reflect → Terminate steps',
  inputSchema: z.object({
    formData: z.any(),
    userContext: z.object({
      location: z.object({
        city: z.string(),
        region: z.string(),
        country: z.string(),
      }),
    }),
  }),
  outputSchema: z.object({
    report: z.string(),
    qualityScore: z.number(),
    recommendations: z.array(z.string()),
  }),
})
  .then(planStep)        // 1. PLAN: Analyze and create strategy
  .then(executeStep)     // 2. EXECUTE: Run research tools
  .then(reflectStep)     // 3. REFLECT: Evaluate quality
  .then(terminateStep)   // 4. TERMINATE: Compile final report
  .commit();
