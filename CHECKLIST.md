# Pre-Submission Checklist

Before submitting your take-home assignment, verify all requirements are met:

## ✅ Functional Requirements

### Page 1: Marketing Landing Page
- [ ] Polished, professional design
- [ ] Clear typography hierarchy
- [ ] Consistent spacing (8px grid)
- [ ] Cohesive color palette with proper contrast
- [ ] Responsive layout (mobile, tablet, desktop)
- [ ] Smooth animations
- [ ] Working navigation to /app

### Page 2: App Functionality

#### State Flow (All 5 States)
- [ ] INTERVIEWING: Chat interface working
- [ ] FORM_PREVIEW: Generated form displays correctly
- [ ] FORM_ACTIVE: Form submission with validation
- [ ] RESEARCHING: Progress indication
- [ ] PRESENTING: Results with sources

#### Conversational Form Builder
- [ ] Agent asks clarifying questions
- [ ] Natural conversation flow
- [ ] Generates form with 3+ fields
- [ ] Conditional logic implemented
- [ ] User can request edits

#### Research Agent
- [ ] Takes form submission as input
- [ ] Uses multiple tools
- [ ] Agentic loop visible (plan → execute → reflect)
- [ ] Presents findings with sources
- [ ] Clean results UI

## ✅ Technical Requirements

### Mastra Implementation
- [ ] Proper agent definitions
- [ ] Clear system prompts
- [ ] Tool definitions with typed inputs/outputs
- [ ] Clean separation between agent logic and UI

### Dynamic User Context
- [ ] IP geolocation working
- [ ] Location context injected into agent
- [ ] Agent uses location to personalize
- [ ] User can override location

### State Machine
- [ ] Explicit states defined
- [ ] Clear transitions
- [ ] Handles backward navigation
- [ ] State changes logged

### Agentic Loop
- [ ] Planning phase
- [ ] Tool selection logic
- [ ] Execution with reflection
- [ ] Clear termination conditions
- [ ] Tool chaining demonstrated

### Conditional Form Logic
- [ ] Fields depend on previous answers
- [ ] Graph traversal works correctly
- [ ] No circular dependencies

### Frontend
- [ ] Consistent design across pages
- [ ] Form validation states
- [ ] Research progress indication
- [ ] Source attribution in results
- [ ] Responsive design

## ✅ Deliverables

### PROMPTS.md
- [ ] Form Builder Agent prompt documented
- [ ] Research Agent prompt documented
- [ ] Dynamic context injection explained
- [ ] Tool descriptions included
- [ ] Reasoning and edge cases covered

### Code Quality
- [ ] TypeScript used throughout
- [ ] No type errors
- [ ] Consistent code style
- [ ] Meaningful variable names
- [ ] Comments for complex logic

### Documentation
- [ ] README.md with setup instructions
- [ ] Environment variables documented
- [ ] Architecture explained
- [ ] Clear installation steps

## ✅ Testing

### Manual Testing
- [ ] Test full flow start to finish
- [ ] Try different research topics
- [ ] Test form validation
- [ ] Verify conditional logic
- [ ] Check responsive design
- [ ] Test error handling

### Edge Cases
- [ ] Empty/invalid inputs
- [ ] Network errors
- [ ] Missing API keys
- [ ] Location detection failure
- [ ] Agent timeout/errors

## ✅ Polish

### Design
- [ ] No visual bugs
- [ ] Consistent spacing
- [ ] Readable fonts
- [ ] Good color contrast
- [ ] Smooth transitions

### UX
- [ ] Loading states everywhere
- [ ] Clear error messages
- [ ] Intuitive navigation
- [ ] Helpful tooltips/hints
- [ ] Mobile-friendly

## ✅ Pre-Interview Prep

- [ ] Can explain agent architecture
- [ ] Understand prompt design choices
- [ ] Know how context injection works
- [ ] Can walk through state transitions
- [ ] Understand tool orchestration
- [ ] Familiar with all code written
- [ ] Can demo full flow confidently

## 🎯 Evaluation Criteria

| Category | Weight | Self-Score |
|----------|--------|------------|
| Mastra agent design & prompt quality | 30% | __/30 |
| State machine (explicit, handles edge cases) | 20% | __/20 |
| Form logic (conditional graph traversal) | 15% | __/15 |
| Frontend polish (typography, spacing, color) | 25% | __/25 |
| Code quality & documentation | 10% | __/10 |
| **Total** | **100%** | **__/100** |

## 📝 Final Steps

1. [ ] Run `npm run build` - ensure no errors
2. [ ] Run `npm run lint` - fix all issues
3. [ ] Run `npm run type-check` - no type errors
4. [ ] Test in production mode (`npm run build && npm start`)
5. [ ] Create `.env.local` from `.env.local.example`
6. [ ] Verify all documentation is complete
7. [ ] Practice demo for interview
8. [ ] Prepare answers to potential questions

## 🚀 Submission Ready!

Once all items are checked, your submission is ready!

**Good luck! 🎉**
