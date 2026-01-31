# Quick Setup Guide

Get your ResearchForm AI application running in 5 minutes!

## Prerequisites Check

Before starting, ensure you have:

- ✅ Node.js 18+ installed (`node --version`)
- ✅ npm/yarn/pnpm installed
- ✅ OpenAI API key ready
- ✅ Terminal/Command Prompt open

## 🚀 Quick Start (5 minutes)

### Step 1: Install Dependencies (2 min)

```bash
npm install
```

**What this does**: Installs Next.js, Mastra, TypeScript, and all dependencies

### Step 2: Configure Environment (1 min)

```bash
# Windows (PowerShell)
Copy-Item .env.local.example .env.local

# Mac/Linux
cp .env.local.example .env.local
```

Now open `.env.local` and add your OpenAI API key:

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
```

**Getting OpenAI API Key**:
1. Go to https://platform.openai.com
2. Sign in or create account
3. Go to API Keys section
4. Create new secret key
5. Copy and paste above

### Step 3: Run Development Server (30 sec)

```bash
npm run dev
```

**Expected output**:
```
> research-form-builder@1.0.0 dev
> next dev

  ▲ Next.js 15.1.3
  - Local:        http://localhost:3000
  - Ready in 2.3s
```

### Step 4: Open Browser (30 sec)

Visit: http://localhost:3000

You should see the marketing landing page!

### Step 5: Test the App (1 min)

1. Click "Try It Free" or "Start Researching"
2. You should see the chat interface
3. Type: "I want to research CRM software for my startup"
4. The agent should respond!

---

## ✅ Verification

If everything works, you should see:

- ✅ Marketing page loads with nice design
- ✅ Can navigate to /app
- ✅ Chat interface is visible
- ✅ Location badge shows your region
- ✅ Agent responds to messages

---

## ❌ Troubleshooting

### "Cannot find module" errors

**Solution**: Delete `node_modules` and reinstall

```bash
# Windows
Remove-Item -Recurse -Force node_modules
npm install

# Mac/Linux
rm -rf node_modules
npm install
```

### "OpenAI API key not found"

**Solution**: Check `.env.local` file

1. Ensure file is named exactly `.env.local` (not `.env.local.txt`)
2. Verify `OPENAI_API_KEY=sk-...` is present
3. Restart dev server (`Ctrl+C`, then `npm run dev`)

### Port 3000 already in use

**Solution**: Use different port

```bash
PORT=3001 npm run dev
```

Then visit http://localhost:3001

### Agent not responding

**Checklist**:
1. ✅ OpenAI API key is valid
2. ✅ Have OpenAI API credits
3. ✅ Internet connection working
4. ✅ No firewall blocking requests

**Test API key**:
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer sk-your-key-here"
```

Should return list of models.

### TypeScript errors

**Solution**: 

```bash
npm run type-check
```

Fix any errors shown.

### Build errors

**Solution**:

```bash
# Clean Next.js cache
Remove-Item -Recurse -Force .next  # Windows
rm -rf .next                        # Mac/Linux

# Rebuild
npm run build
```

---

## 🎨 Optional: Add Your Own Branding

### Change App Name

Edit [src/app/page.tsx](src/app/page.tsx#L20):

```tsx
<span className="text-xl font-bold">Your Company Name</span>
```

### Change Colors

Edit [tailwind.config.ts](tailwind.config.ts#L13):

```typescript
primary: {
  500: '#YOUR_COLOR',
  600: '#YOUR_DARKER_COLOR',
}
```

---

## 📊 Feature Testing

### Test Conversational Form Builder

1. Go to http://localhost:3000/app
2. Say: "I want to research project management tools"
3. Agent should ask questions
4. Answer them
5. Form should be generated

### Test Conditional Logic

1. Generate a form with a yes/no question
2. Fill out the form
3. Notice fields appear/disappear based on answers

### Test Research

1. Complete a form
2. Submit
3. Watch research progress
4. View results with sources

### Test Location Awareness

1. Check location badge in header
2. Agent should reference your region
3. Click badge to override location

---

## 🚢 Production Build

When ready to deploy:

```bash
# Build for production
npm run build

# Test production build locally
npm start
```

Visit http://localhost:3000

---

## 📚 Next Steps

Once setup is complete:

1. Read [README.md](README.md) for full documentation
2. Review [PROMPTS.md](PROMPTS.md) for agent details
3. Check [CHECKLIST.md](CHECKLIST.md) before submission
4. Practice demo for interview

---

## 🆘 Getting Help

- **Documentation**: See README.md
- **Agent Prompts**: See PROMPTS.md
- **Context7 Setup**: See CONTEXT7_SETUP.md
- **Common Issues**: Check Troubleshooting section above

---

## 🎉 Success!

You now have a production-grade AI research form builder running locally!

**What you can do**:
- ✅ Build custom research forms through conversation
- ✅ Generate forms with conditional logic
- ✅ Conduct AI-powered research
- ✅ Get location-aware insights
- ✅ Download research results

**Time spent**: ~5 minutes  
**Result**: Fully functional AI application

Ready to impress! 🚀
