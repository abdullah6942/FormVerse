# PROMPTS.md

This document contains all AI agent prompts used in the ResearchForm AI application, along with design rationale, edge case handling, and implementation details.

---

## Table of Contents

1. [Form Builder Agent](#form-builder-agent)
2. [Research Agent](#research-agent)
3. [Dynamic Context Injection](#dynamic-context-injection)
4. [Tool Descriptions](#tool-descriptions)

---

## Form Builder Agent

### System Prompt

**Location**: `src/agents/prompts/form-builder.ts`

**Purpose**: Guide the agent to interview users conversationally and generate dynamic research forms with conditional logic.

### Full Prompt

\`\`\`
You are an expert research form designer AI assistant. Your role is to interview users conversationally to understand what they want to research, then generate a comprehensive, well-structured form.

## Your Objectives:

1. **Interview the User**: Ask clarifying questions to understand:
   - What topic they want to research
   - What specific aspects they're interested in
   - What level of detail they need
   - Any constraints or preferences they have

2. **Generate Dynamic Forms**: Create forms with:
   - Appropriate field types (text, select, multiselect, number, etc.)
   - Clear, descriptive labels
   - Helpful placeholder text and help text
   - Smart conditional logic (fields that appear based on previous answers)
   - Proper validation rules

3. **Adapt to User Context**: Use the provided user location and context to:
   - Suggest region-specific fields when relevant
   - Consider local market dynamics
   - Include region-appropriate options
   - Tailor questions to local regulations/standards
\`\`\`

### Design Rationale

#### 1. Conversational Approach
- **Why**: Natural language interface lowers barriers to entry
- **How**: Agent asks 2-4 targeted questions before generating form
- **Benefit**: Captures nuanced requirements that structured forms miss

#### 2. Field Type Selection Strategy
```
TEXT → Short answers (names, titles, brief descriptions)
TEXTAREA → Detailed responses (explanations, requirements)
SELECT → Single choice from clear alternatives
MULTISELECT → Multiple valid selections
NUMBER → Quantitative data (budgets, sizes, metrics)
RADIO → Important binary or few-option choices
CHECKBOX → Opt-in preferences
```

**Reasoning**: Match field type to expected answer format for better UX

#### 3. Conditional Logic Design
- **Pattern**: Simple dependencies only (avoid circular refs)
- **Example**: Show "Budget range" only if "Have budget" = "Yes"
- **Implementation**: Each condition specifies fieldId, operator, and value
- **Benefit**: Forms adapt dynamically, reducing cognitive load

#### 4. Validation Rules
- Pattern validation for emails, URLs, etc.
- Min/max for numbers
- Length constraints for text fields
- Required field enforcement

### Edge Case Handling

| Edge Case | Handling Strategy |
|-----------|------------------|
| **Unclear request** | Ask for clarification rather than assume |
| **Too broad** | Narrow scope with targeted questions |
| **Too narrow** | Suggest expanding if critical aspects missing |
| **Contradictions** | Point out conflicts politely, ask for resolution |
| **Missing context** | Proactively ask about critical info |
| **Complex dependencies** | Break into simpler conditional chains |
| **Non-research intent** | Redirect to research-focused questions |

### Context Injection Template

```typescript
## User Context:

Location: {city}, {region}, {country} ({countryCode})
Timezone: {timezone}
Currency: {currency}
Languages: {languages}

## Regional Context:

{regionalContext}  // e.g., "Consider EU GDPR compliance, SEPA payments..."
```

**Dynamic Behavior**:
- Germany user researching payments → Suggests SEPA, Giropay, EU regulations
- US user researching payments → Suggests ACH, Stripe, US state tax considerations
- India user researching payments → Suggests UPI, RBI regulations, GST

### Output Format

JSON structure with validation:
```json
{
  "ready": true,
  "form": {
    "title": "Clear form title",
    "description": "Brief explanation",
    "fields": [
      {
        "id": "unique_id",
        "type": "text|select|...",
        "label": "Field label",
        "required": true|false,
        "options": ["..."],
        "validation": {...},
        "conditions": [...]
      }
    ]
  }
}
```

---

## Research Agent

### System Prompt

**Location**: `src/agents/prompts/research-agent.ts`

**Purpose**: Conduct comprehensive research using an agentic loop with tool selection, execution, and reflection.

### Full Prompt

\`\`\`
You are an expert research AI agent with access to powerful research tools. Your role is to conduct thorough, accurate, and insightful research based on the user's form submission.

## Your Research Process (Agentic Loop):

### 1. PLANNING Phase
Analyze the form submission and:
- Identify key research objectives
- Determine which tools to use and in what order
- Break down complex questions into researchable components
- Consider the user's location context for region-specific research

### 2. EXECUTION Phase
Execute your plan by:
- Using tools strategically and efficiently
- Chaining tool outputs (use results from one tool to inform the next)
- Gathering comprehensive information from multiple sources
- Adapting your approach based on intermediate results

### 3. REFLECTION Phase
After each tool execution:
- Evaluate if the results are sufficient and relevant
- Determine if you need more information
- Decide whether to continue researching or conclude
- Consider alternative approaches if results are unsatisfactory

### 4. TERMINATION
Stop researching when:
- You have comprehensive answers to all research objectives
- Additional tool calls would provide diminishing returns
- You've exhausted relevant research avenues
- You've reached a logical conclusion with well-supported findings
\`\`\`

### Mastra Workflow Implementation

**IMPORTANT**: The Research Agent uses a Mastra Workflow to implement an explicit agentic loop with graph-based execution. This satisfies the task requirement for "Workflow or graph-based execution where appropriate."

#### Workflow Structure (Plan → Execute → Reflect → Terminate)

**Location**: `src/agents/workflows/research-workflow.ts`

The research process is implemented as a 4-step Mastra Workflow:

1. **PLAN Step** (`plan-research`):
   - Analyzes form data structure
   - Identifies research areas (market, regulatory, technology, web search)
   - Creates research plan based on location context
   - Outputs: `researchPlan`, `areasToInvestigate`

2. **EXECUTE Step** (`execute-research`):
   - Builds context-aware prompt from plan
   - Calls Research Agent with tools
   - Executes research using appropriate tools
   - Outputs: `researchResults` (array of findings by area)

3. **REFLECT Step** (`reflect-on-research`):
   - Evaluates research quality (qualityScore 0-1)
   - Checks for location-specific information
   - Identifies gaps in research
   - Determines if research is complete
   - Outputs: `isComplete`, `qualityScore`, `gaps`

4. **TERMINATE Step** (`compile-report`):
   - Compiles findings into structured report
   - Generates recommendations
   - Formats final output
   - Outputs: `report`, `qualityScore`, `recommendations`

**Workflow Registration**:
```typescript
// src/agents/index.ts
export const mastra = new Mastra({
  agents: { formBuilder, researcher },
  workflows: { researchWorkflow },
});
```

**API Usage**:
```typescript
// src/app/api/research/route.ts
const workflow = mastra.getWorkflow('researchWorkflow');
const run = await workflow.createRun();
const result = await run.start({
  inputData: { formData, userContext }
});
```

**Benefits of Workflow Approach**:
- ✅ Explicit state transitions (no implicit loops)
- ✅ Each step has defined input/output schemas (type-safe)
- ✅ Clear separation of concerns (Plan, Execute, Reflect, Terminate)
- ✅ Observable execution (each step can be monitored)
- ✅ Resumable execution (can suspend/resume at any step)
- ✅ Time-travel debugging support
- ✅ Production-grade error handling

### Agentic Loop Structure (Legacy Documentation)

**Note**: The following describes the conceptual agentic loop. The actual implementation uses the Mastra Workflow described above.

#### Planning → Execution → Reflection → Iterate/Terminate

**Example Flow**:

1. **Planning**: "Research best CRM for 15-person remote team"
   - Objectives: Find suitable CRM, consider pricing, check features
   - Tools: web_search → technology_research → market_research
   - Context: User in Germany → Consider GDPR compliance

2. **Execution Round 1**:
   - Tool: `web_search("best CRM for remote teams 2026")`
   - Result: 3 popular solutions identified
   - **Reflection**: Good start, need deeper technical comparison

3. **Execution Round 2**:
   - Tool: `technology_research("CRM for remote teams")`
   - Result: Detailed pros/cons, pricing
   - **Reflection**: Have technical details, missing market trends

4. **Execution Round 3**:
   - Tool: `market_research("CRM software", "Germany")`
   - Result: EU market trends, GDPR considerations
   - **Reflection**: Comprehensive view achieved

5. **Termination**: All objectives met, ready to present findings

### Tool Selection Strategy

| Research Need | Primary Tool | Secondary Tool |
|--------------|--------------|----------------|
| General info | `web_search` | - |
| Market analysis | `market_research` | `web_search` |
| Legal/compliance | `regulatory_research` | `web_search` |
| Technical solutions | `technology_research` | `web_search` |

**Chaining Example**:
1. `web_search` to identify candidates
2. `technology_research` for detailed comparison
3. `regulatory_research` for compliance check
4. `market_research` for market position

### Termination Logic

**Stop when**:
- ✅ All research questions answered
- ✅ Multiple corroborating sources found
- ✅ Region-specific insights gathered
- ✅ Actionable recommendations formed
- ❌ Diminishing returns on additional queries
- ❌ Repeated information from tools
- ❌ Maximum iteration limit approaching (10 steps)

**Don't stop if**:
- ❌ Only one source found
- ❌ Conflicting information unresolved
- ❌ Missing critical regional context
- ❌ Gaps in research objectives

### Edge Case Handling

| Edge Case | Handling |
|-----------|----------|
| **Tool failure** | Try alternative tool or rephrase query |
| **Insufficient data** | Acknowledge limitation, recommend manual research |
| **Conflicting info** | Present multiple perspectives with sources |
| **Scope creep** | Stay focused on original objectives |
| **Over-research** | Know when to stop (quality > perfect) |

### Output Format

```json
{
  "summary": "2-3 sentence overview",
  "findings": [
    {
      "section": "Section Title",
      "content": "Detailed findings",
      "sources": ["Source 1", "Source 2"]
    }
  ],
  "recommendations": [
    "Actionable recommendation 1",
    "Actionable recommendation 2"
  ],
  "regionalInsights": "Location-specific insights",
  "nextSteps": [
    "Suggested next step 1"
  ]
}
```

---

## Dynamic Context Injection

### How Location Context Flows

**1. Detection** (Client → Server)
- IP geolocation on first page load
- Stored in Zustand state
- User can override if incorrect

**2. Injection** (Agent Initialization)
- Context appended to system prompt
- Formatted as structured data
- Includes regional business context

**3. Agent Usage** (During Conversation)
- Agent references context naturally
- Suggests region-appropriate options
- Considers local regulations/markets

### Context Template Variables

```typescript
{
  city: string           // "Berlin"
  region: string         // "Berlin"
  country: string        // "Germany"
  countryCode: string    // "DE"
  timezone: string       // "Europe/Berlin"
  currency?: string      // "EUR"
  languages?: string[]   // ["de", "en"]
}
```

### Regional Context Examples

**Germany (DE)**:
```
Consider German/EU market context, GDPR, strict data protection laws, 
and European business practices. Important: SEPA payments, EU data residency,
German-language support, VAT handling.
```

**United States (US)**:
```
Consider US market dynamics, federal/state regulations, North American 
business practices. Important: ACH/Wire transfers, state-specific laws,
sales tax variations, US data centers.
```

**India (IN)**:
```
Consider Indian market dynamics, RBI regulations, GST, South Asian business
context. Important: UPI payments, Indian rupee, local compliance, regional
language support.
```

### Override Handling

**User Override Flow**:
1. User clicks location badge
2. Modal allows manual entry
3. `isOverridden: true` flag set
4. Agent acknowledges user-specified location

**Prompt Injection**:
```
Location: San Francisco, California, United States (US)
(User-specified location)
```

---

## Tool Descriptions

### 1. Web Search Tool

**ID**: `web_search`

**Description**: Search the web for information on a specific topic

**Input Schema**:
```typescript
{
  query: string           // Search query
  maxResults?: number     // Default: 5
}
```

**Output Schema**:
```typescript
{
  results: Array<{
    title: string
    url: string
    snippet: string
    relevance: number     // 0-1 score
  }>
}
```

**When to Use**: General information, current trends, product research

---

### 2. Market Research Tool

**ID**: `market_research`

**Description**: Conduct market research on industries, products, or services

**Input Schema**:
```typescript
{
  topic: string          // Market/industry to research
  region?: string        // Geographic focus
}
```

**Output Schema**:
```typescript
{
  marketSize: string
  trends: string[]
  competitors: string[]
  opportunities: string[]
}
```

**When to Use**: Market analysis, competitive landscape, growth opportunities

---

### 3. Regulatory Research Tool

**ID**: `regulatory_research`

**Description**: Research regulations and compliance requirements

**Input Schema**:
```typescript
{
  industry: string       // Industry to research
  region: string         // Geographic region
}
```

**Output Schema**:
```typescript
{
  regulations: Array<{
    name: string
    description: string
    authority: string
  }>
  compliance: string[]
}
```

**When to Use**: Legal requirements, compliance checks, regulatory frameworks

---

### 4. Technology Research Tool

**ID**: `technology_research`

**Description**: Research technologies, frameworks, tools, and solutions

**Input Schema**:
```typescript
{
  useCase: string        // Use case or requirement
  category?: string      // Technology category
}
```

**Output Schema**:
```typescript
{
  recommendations: Array<{
    name: string
    description: string
    pros: string[]
    cons: string[]
    useCase: string
  }>
}
```

**When to Use**: Technology selection, tool comparison, technical solutions

---

## Interview Preparation

When demonstrating this project in the interview, be prepared to discuss:

### 1. Agent Architecture
- **Question**: "How did you structure your Mastra agents and workflows?"
- **Answer**: Two specialized agents (Form Builder + Research), tool-based architecture, stateless API design, clear separation of concerns

### 2. Prompt Design
- **Question**: "Why did you write the prompts the way you did?"
- **Answer**: Conversational for UX, structured output for parsing, context-aware for regional relevance, explicit termination logic for efficiency

### 3. Context Injection
- **Question**: "How does dynamic context flow into the agent?"
- **Answer**: IP geolocation → Zustand store → API request → Prompt interpolation → Agent reasoning

### 4. State Management
- **Question**: "How do states transition? How do you handle errors?"
- **Answer**: Explicit state machine with validation, transition logging, error boundaries, backward navigation support

### 5. Tool Orchestration
- **Question**: "How does the agent decide which tools to use and when to stop?"
- **Answer**: Agentic loop with planning phase, tool chaining strategy, reflection after each execution, termination criteria based on completeness

---

## Conclusion

These prompts are designed to create a production-grade AI research assistant that:
- ✅ Interviews users naturally
- ✅ Generates intelligent, adaptive forms
- ✅ Conducts thorough research with proper planning
- ✅ Adapts to user location automatically
- ✅ Uses tools efficiently with clear termination
- ✅ Provides comprehensive, source-attributed results

The system demonstrates advanced prompt engineering, agentic workflows, and thoughtful UX design.
