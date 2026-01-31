# Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                           FORMVERSE                              │
│                    Production Architecture                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│   User Browser   │
│                  │
│  ┌────────────┐  │
│  │ Landing    │  │  ← Marketing Page
│  │ Page       │  │     (Static, Responsive)
│  └────────────┘  │
│        ↓         │
│  ┌────────────┐  │
│  │ App Page   │  │  ← Main Application
│  │ (State UI) │  │     (5 States)
│  └────────────┘  │
└────────┬─────────┘
         │ HTTP Requests
         ↓
┌─────────────────────────────────────────────────────────────────┐
│                     NEXT.JS SERVER (App Router)                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────────┐  │
│  │ /api/location  │  │  /api/chat     │  │  /api/research   │  │
│  │ (Geolocation)  │  │ (Form Builder) │  │ (Research Agent) │  │
│  └────────┬───────┘  └────────┬───────┘  └────────┬─────────┘  │
│           │                   │                    │             │
│           ↓                   ↓                    ↓             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              MASTRA AGENT ORCHESTRATION                  │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │                                                           │   │
│  │  ┌──────────────────┐      ┌──────────────────┐         │   │
│  │  │ Form Builder     │      │ Research Agent   │         │   │
│  │  │ Agent            │      │                  │         │   │
│  │  │                  │      │  ┌────────────┐  │         │   │
│  │  │ - Interviews     │      │  │ Agentic    │  │         │   │
│  │  │ - Generates      │      │  │ Loop:      │  │         │   │
│  │  │   Forms          │      │  │            │  │         │   │
│  │  │ - Conditional    │      │  │ Plan ──→   │  │         │   │
│  │  │   Logic          │      │  │ Execute ──→│  │         │   │
│  │  │                  │      │  │ Reflect ──→│  │         │   │
│  │  │ GPT-4 Turbo      │      │  │ Iterate    │  │         │   │
│  │  └──────────────────┘      │  └────────────┘  │         │   │
│  │                            │                  │         │   │
│  │                            │  ┌─────────────────┐       │   │
│  │                            │  │ Research Tools: │       │   │
│  │                            │  │ - web_search    │       │   │
│  │                            │  │ - market        │       │   │
│  │                            │  │ - regulatory    │       │   │
│  │                            │  │ - technology    │       │   │
│  │                            │  └─────────────────┘       │   │
│  │                            │                            │   │
│  │                            │  GPT-4 Turbo               │   │
│  │                            └────────────────────────────┘   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐      │
│  │ OpenAI API   │  │ ipapi.co     │  │ Context7 MCP     │      │
│  │ (GPT-4)      │  │ (Geolocation)│  │ (Optional)       │      │
│  └──────────────┘  └──────────────┘  └──────────────────┘      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## State Flow Diagram

```
User Journey Through 5 States:
─────────────────────────────────

START
  │
  ↓
┌─────────────────┐
│ 1. INTERVIEWING │ ← Agent chats with user
│                 │   Asks 2-4 questions
│   💬 Chat UI    │   Detects location
│                 │   Builds understanding
└────────┬────────┘
         │ Agent generates form
         ↓
┌─────────────────┐
│ 2. FORM_PREVIEW │ ← User reviews form
│                 │   Sees conditional fields
│   👁️ Review     │   Can edit or approve
│                 │   
└────────┬────────┘
         │ User approves
         │ (Can go back ←)
         ↓
┌─────────────────┐
│ 3. FORM_ACTIVE  │ ← User fills form
│                 │   Fields show/hide
│   ✍️ Fill Form  │   Validation works
│                 │   Conditional logic
└────────┬────────┘
         │ Submit form
         │ (Can go back ←)
         ↓
┌─────────────────┐
│ 4. RESEARCHING  │ ← Agent researches
│                 │   Plan → Execute
│   🔍 Research   │   Reflect → Iterate
│                 │   Uses 4 tools
└────────┬────────┘
         │ Research complete
         ↓
┌─────────────────┐
│ 5. PRESENTING   │ ← Results displayed
│                 │   Findings + Sources
│   📊 Results    │   Download option
│                 │   Start over ↻
└─────────────────┘
```

## Component Architecture

```
App Component Structure:
────────────────────────

app/page.tsx (Landing Page)
│
├─── Hero Section
├─── Features Grid
├─── How It Works
├─── Benefits
├─── CTA Section
└─── Footer

app/app/page.tsx (Main App)
│
├─── Header
│    ├─── Logo
│    ├─── Location Badge
│    └─── Start Over Button
│
├─── State Indicator
│    └─── Progress Bar (5 steps)
│
└─── Dynamic State Component
     │
     ├─── InterviewingState
     │    ├─── Message List
     │    └─── Input Form
     │
     ├─── FormPreviewState
     │    ├─── Form Display
     │    └─── Action Buttons
     │
     ├─── FormActiveState
     │    ├─── Dynamic Fields
     │    └─── Validation
     │
     ├─── ResearchingState
     │    ├─── Progress Bar
     │    └─── Step List
     │
     └─── PresentingState
          ├─── Findings
          ├─── Sources
          └─── Actions
```

## Data Flow

```
Context Injection Flow:
──────────────────────

1. Page Load
   └─→ Detect IP
       └─→ Call /api/location
           └─→ getUserLocation()
               └─→ Return location data

2. User Context Created
   {
     location: {country, city, region...},
     sessionId: "session_xyz",
     timestamp: Date
   }
   └─→ Stored in Zustand

3. Agent Request
   └─→ Include userContext in API call
       └─→ Server formats context
           └─→ Inject into agent prompt
               └─→ Agent uses context

Agent Prompt Template:
─────────────────────

## User Context:
Location: Berlin, Germany (DE)
Timezone: Europe/Berlin
Currency: EUR

## Regional Context:
Consider German/EU market, GDPR, SEPA...

[Original Prompt Content]
```

## State Machine

```
State Transitions (Validated):
──────────────────────────────

INTERVIEWING
  ├─→ FORM_PREVIEW ✅

FORM_PREVIEW
  ├─→ INTERVIEWING ✅ (back)
  └─→ FORM_ACTIVE ✅

FORM_ACTIVE
  ├─→ FORM_PREVIEW ✅ (back)
  └─→ RESEARCHING ✅

RESEARCHING
  └─→ PRESENTING ✅

PRESENTING
  └─→ INTERVIEWING ✅ (start over)

Invalid transitions are blocked by state machine.
All transitions are logged for debugging.
```

## Tool Orchestration

```
Research Agent Tool Usage:
─────────────────────────

User submits form
  ↓
Agent Plans:
  1. What to research?
  2. Which tools to use?
  3. In what order?
  ↓
Execution Loop:
  │
  ├─→ Execute Tool 1 (e.g., web_search)
  │   └─→ Get Results
  │       └─→ Reflect: Sufficient? Need more?
  │
  ├─→ Execute Tool 2 (e.g., market_research)
  │   └─→ Get Results
  │       └─→ Reflect: Covers objectives?
  │
  ├─→ Execute Tool 3 (e.g., regulatory_research)
  │   └─→ Get Results
  │       └─→ Reflect: Comprehensive enough?
  │
  └─→ Termination Decision:
      ├─→ Have all answers? ✅ Stop
      ├─→ Diminishing returns? ✅ Stop
      ├─→ Need more info? ❌ Continue
      └─→ Max iterations? ⚠️ Stop

Present Findings
```

## Technology Stack

```
Frontend:
─────────
Next.js 15 (App Router)
  ├─→ React 19
  ├─→ TypeScript 5.7
  ├─→ Tailwind CSS 3.4
  └─→ Framer Motion 11

State Management:
────────────────
Zustand 5.0
  └─→ DevTools Integration

Agent Framework:
───────────────
Mastra 0.1.36
  ├─→ OpenAI SDK
  └─→ AI SDK 3.4

Validation:
──────────
Zod 3.24
  └─→ Type-safe schemas

Services:
────────
IP Geolocation (ipapi.co)
OpenAI API (GPT-4 Turbo)
Context7 MCP (Optional)
```

## Deployment Architecture

```
Production Deployment:
─────────────────────

GitHub Repo
  │
  ↓
Vercel CI/CD
  ├─→ Build (next build)
  ├─→ Type Check
  ├─→ Lint
  └─→ Deploy
      │
      ↓
Vercel Edge Network
  ├─→ Static Assets (CDN)
  ├─→ API Routes (Serverless)
  └─→ SSR Pages
      │
      ↓
Users Worldwide
  └─→ Fast, Global Access

Environment Variables:
──────────────────────
OPENAI_API_KEY (Secret)
NEXT_PUBLIC_BASE_URL (Public)
```

## Performance Optimizations

```
Build-Time:
──────────
✅ Code splitting (automatic)
✅ Tree shaking
✅ Minification
✅ Image optimization

Runtime:
────────
✅ React 19 optimizations
✅ Zustand (lightweight)
✅ Lazy loading components
✅ Streaming responses

Caching:
────────
✅ Static assets (CDN)
✅ API responses (SWR pattern possible)
✅ Build outputs
```

---

This architecture demonstrates:
- Clean separation of concerns
- Scalable design patterns
- Production-ready structure
- Type-safe implementation
- Comprehensive error handling

**Result**: Enterprise-grade application architecture ✅
