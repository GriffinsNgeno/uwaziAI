# transparencyAI Quick Start Guide

## 🚀 Get Started in 5 Minutes

This guide will help you get the transparencyAI project running on your local machine quickly.

## 📋 Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm 9+** - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)

## 🏃‍♂️ Quick Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd transparencyAI
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Servers
```bash
npm run dev
```

### 4. Open Your Browser
Navigate to `http://localhost:3000` to see the dashboard!

## 🎯 What You'll See

- **Dashboard**: Overview of budget data with key metrics
- **Sample Data**: 20 Kenyan government budget items
- **AI Insights**: Automated analysis and recommendations
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🛠️ Development Workflow

### Available Scripts
```bash
npm run dev          # Start all development servers
npm run build        # Build all packages and apps
npm run test         # Run tests across the monorepo
npm run lint         # Lint all code
npm run clean        # Clean build artifacts
npm run format       # Format code with Prettier
```

### Package Development
```bash
# Work on a specific package
cd packages/types
npm run dev          # Watch mode for TypeScript compilation

# Work on the web app
cd apps/web
npm run dev          # Start Next.js development server
```

## 📁 Project Structure

```
transparencyAI/
├── apps/web/                 # Main dashboard (Next.js)
├── packages/types/           # Shared TypeScript types
├── packages/utils/           # Common utility functions
├── packages/ai-engine/       # AI analysis engine
└── data/                     # Sample budget datasets
```

## 🔧 Key Technologies

- **Frontend**: Next.js 14 + React + TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Chart.js, D3.js, Plotly
- **AI**: TensorFlow.js, OpenAI API
- **Build**: Turbo (monorepo management)

## 📊 Sample Data

The project includes sample Kenyan government budget data:
- **20 budget items** across different departments
- **Categories**: Infrastructure, Healthcare, Education, Agriculture
- **Total Budget**: KES 25.5 billion
- **Time Period**: 2025 Q1

## 🎨 Customization

### Adding New Budget Items
Edit `data/sample_budget_2025.csv` or use the dashboard interface.

### Modifying AI Analysis
Update `packages/ai-engine/src/index.ts` to customize analysis algorithms.

### Styling Changes
Modify `apps/web/tailwind.config.js` for theme customization.

## 🚨 Common Issues

### Port Already in Use
If port 3000 is busy, Next.js will automatically use the next available port.

### TypeScript Errors
Run `npm run build` to check for type errors across the monorepo.

### Missing Dependencies
If you see import errors, run `npm install` in the root directory.

## 🔍 Next Steps

### For Frontend Developers
1. Explore `apps/web/src/app/page.tsx` - Main dashboard
2. Check `apps/web/src/app/globals.css` - Global styles
3. Review `packages/types/src/index.ts` - Data models

### For Backend Developers
1. Review `packages/ai-engine/src/index.ts` - AI analysis logic
2. Check `packages/utils/src/index.ts` - Utility functions
3. Plan API endpoints in `apps/api/`

### For Data Scientists
1. Examine `packages/ai-engine/src/index.ts` - ML algorithms
2. Review sample data in `data/sample_budget_2025.csv`
3. Plan additional analysis features

## 📚 Learning Resources

- **Next.js**: [Tutorial](https://nextjs.org/learn)
- **TypeScript**: [Handbook](https://www.typescriptlang.org/docs/)
- **Tailwind CSS**: [Documentation](https://tailwindcss.com/docs)
- **Chart.js**: [Examples](https://www.chartjs.org/docs/latest/samples/)

## 🤝 Team Collaboration

### Git Workflow
1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "Add your feature"`
3. Push and create pull request: `git push origin feature/your-feature`

### Code Standards
- Use TypeScript for all new code
- Follow existing naming conventions
- Add JSDoc comments for complex functions
- Test your changes before committing

## 🎉 You're Ready!

You now have a working transparencyAI development environment. Start exploring the code, making changes, and building amazing features for budget transparency!

---

**Need help? Check the main documentation in `docs/PROJECT_OVERVIEW.md` or ask your team members.**
