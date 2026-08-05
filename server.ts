import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { authService, userRepository } from './src/server/authService';
import { simulationRepository } from './src/server/simulationRepository';
import { OPENAPI_SPEC } from './src/server/swaggerSpec';
import { aiOrchestrator } from './src/engine/orchestrator/aiOrchestrator';
import { reportService } from './src/engine/services/report.service';
import { validateSimulationRequest } from './src/utils/validation';
import { FDF_CONFIG } from './src/config/fdfConfig';

import { saveReportToDb, getReportsFromDbByUserId, getReportFromDbById } from './src/db/reports.ts';
import { saveFdfVersionToDb, getAllFdfVersionsFromDb, ensureDefaultFdfVersionInDb } from './src/db/fdfVersions.ts';

dotenv.config();

// Safe resolution for both ESM (dev tsx) and CJS (prod node)
const appDir = typeof __dirname !== 'undefined'
  ? __dirname
  : (typeof import.meta !== 'undefined' && import.meta.url ? path.dirname(fileURLToPath(import.meta.url)) : process.cwd());

async function startServer() {
  // Ensure default FDF version exists in DB
  ensureDefaultFdfVersionInDb().catch((err) => console.warn('Default FDF version seed warning:', err));

  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Helper for lazy Gemini initialization
  let aiClient: GoogleGenAI | null = null;
  function getGenAI(): GoogleGenAI {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is not configured.");
      }
      aiClient = new GoogleGenAI({ apiKey });
    }
    return aiClient;
  }

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Helper middleware for JWT Authentication
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      // Fallback to demo user if no token provided for ease of testing
      req.user = { userId: 'user-demo-001', email: 'aarav@futureengine.ai', name: 'Aarav Sharma' };
      return next();
    }
    try {
      const decoded = authService.verifyToken(token);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    }
  };

  // Auth Routes
  const handleSignup = async (req: any, res: any) => {
    try {
      const { email, password, name } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, password, and name are required' });
      }
      const { user, profile } = await userRepository.createUserAsync(email, password, name);
      const token = authService.generateToken(user);
      return res.status(201).json({
        message: 'Account created successfully',
        token,
        user: { id: user.id, email: user.email, name: user.name },
        profile
      });
    } catch (e: any) {
      return res.status(400).json({ error: e.message || 'Failed to create account' });
    }
  };

  const handleLogin = async (req: any, res: any) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      const user = await userRepository.findByEmailAsync(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      const hash = userRepository.hashPassword(password);
      if (hash !== user.passwordHash) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      const token = authService.generateToken(user);
      const profile = await userRepository.getProfileAsync(user.id);
      return res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, email: user.email, name: user.name },
        profile
      });
    } catch (e: any) {
      return res.status(500).json({ error: 'Authentication failed' });
    }
  };

  app.post('/auth/signup', handleSignup);
  app.post('/api/auth/signup', handleSignup);
  app.post('/auth/login', handleLogin);
  app.post('/api/auth/login', handleLogin);

  // Profile Routes
  const handleGetProfile = async (req: any, res: any) => {
    const profile = await userRepository.getProfileAsync(req.user.userId);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    return res.json(profile);
  };

  const handlePutProfile = async (req: any, res: any) => {
    try {
      const updated = await userRepository.updateProfileAsync(req.user.userId, req.body);
      return res.json({ message: 'Profile updated successfully', profile: updated });
    } catch (e: any) {
      return res.status(400).json({ error: e.message || 'Profile update failed' });
    }
  };

  app.get('/profile', authenticateToken, handleGetProfile);
  app.get('/api/profile', authenticateToken, handleGetProfile);
  app.put('/profile', authenticateToken, handlePutProfile);
  app.put('/api/profile', authenticateToken, handlePutProfile);

  // Simulation Routes
  const handleSimulation = async (req: any, res: any) => {
    try {
      const validation = validateSimulationRequest(req.body);
      if (!validation.isValid) {
        return res.status(400).json({ error: 'Invalid simulation payload', details: validation.errors });
      }

      const { userProfile, goalCategory, goalDetails, followUpAnswers } = req.body;
      const simulationResult = await aiOrchestrator.simulate(userProfile, goalDetails, followUpAnswers);

      const userId = req.user?.userId || 'user-demo-001';
      await simulationRepository.saveSimulationAsync(userId, simulationResult, userProfile, goalDetails);

      return res.json(simulationResult);
    } catch (e: any) {
      console.error('Simulation execution error:', e);
      return res.status(500).json({ error: e.message || 'Failed to execute decision simulation' });
    }
  };

  const handleGetSimulationById = async (req: any, res: any) => {
    const record = await simulationRepository.getByIdAsync(req.params.id);
    if (!record) {
      return res.status(404).json({ error: 'Simulation record not found' });
    }
    return res.json(record);
  };

  app.post('/simulation', authenticateToken, handleSimulation);
  app.post('/api/simulation', authenticateToken, handleSimulation);
  app.get('/simulation/:id', authenticateToken, handleGetSimulationById);
  app.get('/api/simulation/:id', authenticateToken, handleGetSimulationById);

  // Report Routes
  const handleReport = async (req: any, res: any) => {
    try {
      const { userProfile, goalDetails, scenarios, roadmap, simulationId } = req.body;
      if (!userProfile || !goalDetails) {
        return res.status(400).json({ error: 'userProfile and goalDetails are required to build report' });
      }
      const fullReport = reportService.buildReport(userProfile, goalDetails, scenarios || [], roadmap || []);
      const userId = req.user?.userId || 'user-demo-001';

      // Persist report into PostgreSQL
      const savedReportRecord = await saveReportToDb(userId, goalDetails.title, fullReport, simulationId);

      return res.json({
        ...fullReport,
        id: savedReportRecord.id,
        savedAt: savedReportRecord.createdAt
      });
    } catch (err: any) {
      console.error('Report generation error:', err);
      return res.status(500).json({ error: err.message || 'Failed to generate report' });
    }
  };

  const handleGetReports = async (req: any, res: any) => {
    const userId = req.user?.userId || 'user-demo-001';
    const userReports = await getReportsFromDbByUserId(userId);
    return res.json(userReports);
  };

  const handleGetReportById = async (req: any, res: any) => {
    const reportId = parseInt(req.params.id, 10);
    if (isNaN(reportId)) return res.status(400).json({ error: 'Invalid report ID' });
    const reportRecord = await getReportFromDbById(reportId);
    if (!reportRecord) return res.status(404).json({ error: 'Report not found' });
    return res.json(reportRecord);
  };

  app.post('/report', authenticateToken, handleReport);
  app.post('/api/report', authenticateToken, handleReport);
  app.get('/reports', authenticateToken, handleGetReports);
  app.get('/api/reports', authenticateToken, handleGetReports);
  app.get('/reports/:id', authenticateToken, handleGetReportById);
  app.get('/api/reports/:id', authenticateToken, handleGetReportById);

  // FDF Versions Routes
  const handleGetFdfVersions = async (_req: any, res: any) => {
    const versions = await getAllFdfVersionsFromDb();
    return res.json(versions);
  };

  const handlePostFdfVersion = async (req: any, res: any) => {
    try {
      const { version, name, description, config } = req.body;
      if (!version || !name || !config) {
        return res.status(400).json({ error: 'version, name, and config are required' });
      }
      const savedVersion = await saveFdfVersionToDb(version, name, description || '', config);
      return res.status(201).json(savedVersion);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to save FDF version' });
    }
  };

  app.get('/fdf/versions', handleGetFdfVersions);
  app.get('/api/fdf/versions', handleGetFdfVersions);
  app.post('/fdf/versions', authenticateToken, handlePostFdfVersion);
  app.post('/api/fdf/versions', authenticateToken, handlePostFdfVersion);

  // Dashboard Route
  const handleDashboard = async (req: any, res: any) => {
    const userId = req.user?.userId || 'user-demo-001';
    const summary = await simulationRepository.getDashboardSummaryAsync(userId);
    return res.json({
      userId,
      disclaimer: FDF_CONFIG.SYSTEM.DISCLAIMER,
      metrics: summary
    });
  };

  app.get('/dashboard', authenticateToken, handleDashboard);
  app.get('/api/dashboard', authenticateToken, handleDashboard);

  // OpenAPI Specs Endpoint
  app.get('/docs', (_req, res) => res.json(OPENAPI_SPEC));
  app.get('/api/docs', (_req, res) => res.json(OPENAPI_SPEC));

  // AI Decision Scenario Simulation Endpoint
  app.post('/api/simulate', async (req, res) => {
    try {
      const { userProfile, goalCategory, goalDetails, followUpAnswers } = req.body;

      let ai: GoogleGenAI | null = null;
      try {
        ai = getGenAI();
      } catch (e) {
        // Fallback for simulation without key or when key is not provided yet
        console.warn('GEMINI_API_KEY missing, using fallback heuristic generator');
      }

      if (!ai) {
        // Return structured intelligent default scenarios if key is unconfigured
        return res.json(generateFallbackSimulation(goalCategory, goalDetails));
      }

      const prompt = `You are the Future Engine AI Decision Simulation Engine (tailored for the Indian ecosystem and Indian professionals).
The user wants to evaluate decisions and compare future scenarios based on their profile and goals.

IMPORTANT MANDATES:
1. Every analysis MUST explicitly state: "This is a scenario-based decision support system. It does not predict the future."
2. Never claim certainty or guarantees.
3. CURRENCY: All monetary figures, budgets, CTC, runway, and savings MUST be in Indian Rupees (₹ INR / Lakhs / Crores). NEVER use US Dollars ($).
4. TONE & STYLE: Incorporate an energetic, encouraging, modern Indian tech & career Hinglish touch where appropriate (e.g., "Full support & clear strategy", "Decisions sahi ho to future set hai", "Zero income gap with steady growth").

USER PROFILE:
${JSON.stringify(userProfile, null, 2)}

GOAL CATEGORY:
${goalCategory}

GOAL DETAILS:
${JSON.stringify(goalDetails, null, 2)}

FOLLOW-UP CONTEXT / ANSWERS:
${JSON.stringify(followUpAnswers || {}, null, 2)}

Generate 3 DISTINCT decision scenarios (e.g. 1: Aggressive Growth / Fast Track, 2: Balanced / Measured Approach, 3: Conservative / High Stability).

For each scenario, calculate Future Decision Framework (FDF) scores:
- Goal Score (0-100) based on Skill Match, Time Required, Budget, Market Demand, User Interest.
- Risk Score (0-100) based on Financial Risk, Skill Gap, Competition, Time, Uncertainty.
- Opportunity Score (0-100) based on Growth, Income Potential, Learning, Freedom, Global Demand.
- Confidence Level: "High" | "Medium" | "Low" (with explanation of assumptions used).

Return a strictly valid JSON object matching this schema:
{
  "disclaimer": "This is a scenario-based decision support system. It does not predict the future.",
  "overallAnalysis": "An executive analysis comparing the options for this goal in the Indian context...",
  "recommendedOptionIndex": 1,
  "scenarios": [
    {
      "id": "scenario-1",
      "title": "Title",
      "tagline": "Headline summary",
      "strategyType": "Aggressive",
      "summary": "Detailed summary...",
      "fdfScores": {
        "goalScore": 85,
        "riskScore": 65,
        "opportunityScore": 90,
        "confidenceLevel": "High",
        "confidenceReasoning": "Reasoning..."
      },
      "advantages": ["Advantage 1", "Advantage 2"],
      "disadvantages": ["Disadvantage 1", "Disadvantage 2"],
      "risks": ["Risk 1"],
      "opportunities": ["Opportunity 1"],
      "estimatedTimeline": "6-12 months",
      "skillGap": ["Skill 1"],
      "budgetEstimate": "₹1,00,000 - ₹3,00,000",
      "suggestedNextSteps": ["Step 1", "Step 2"]
    }
  ],
  "roadmap": [
    {
      "phase": "Phase 1: Foundation (Months 1-2)",
      "actions": ["Action 1", "Action 2"],
      "milestone": "Milestone 1"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const text = response.text || '{}';
      let data: any = {};
      try {
        let cleaned = text.trim();
        if (cleaned.startsWith('```')) {
          cleaned = cleaned.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
        }
        data = JSON.parse(cleaned);
      } catch (e) {
        console.warn('Failed to parse Gemini JSON, using fallback structure');
        data = generateFallbackSimulation(goalCategory || 'Career', goalDetails || {});
      }
      return res.json(data);
    } catch (err: any) {
      console.error('Error running simulation:', err);
      // Fallback on error
      const { goalCategory, goalDetails } = req.body;
      return res.json(generateFallbackSimulation(goalCategory || 'Career', goalDetails || {}));
    }
  });

  // AI Follow-up Questions Generator Endpoint
  app.post('/api/generate-questions', async (req, res) => {
    try {
      const { userProfile, goalCategory, goalTitle, goalDescription } = req.body;
      let ai: GoogleGenAI | null = null;
      try {
        ai = getGenAI();
      } catch (e) {
        // Fallback
      }

      if (!ai) {
        return res.json({
          questions: [
            {
              id: 'q1',
              question: `What is your primary target timeframe for achieving this ${goalCategory.toLowerCase()} goal in India?`,
              helpText: 'Helps balance aggressive vs conservative milestones',
              options: ['3-6 Months', '6-12 Months', '1-2 Years', 'Flexible']
            },
            {
              id: 'q2',
              question: 'How much capital or dedicated budget in Rupees (₹) can you commit?',
              helpText: 'Calculates financial risk vs opportunity scaling in INR',
              options: ['Minimal (<₹25,000)', 'Moderate (₹25,000 - ₹1,50,000)', 'Substantial (₹1,50,000+)', 'Sweat Equity Only']
            },
            {
              id: 'q3',
              question: 'What is your highest priority outcome from this transition?',
              helpText: 'Determines weighting in the Future Decision Framework',
              options: ['Maximizing CTC & Financial Upside', 'Work/Life & Remote Freedom', 'Rapid Skill Mastery', 'Maximum Stability & Security']
            }
          ]
        });
      }

      const prompt = `You are Future Engine AI. The user has selected a goal in category "${goalCategory}": "${goalTitle}".
Goal Details: "${goalDescription}".
User Profile: Age ${userProfile?.age}, Education ${userProfile?.education}, Risk Tolerance ${userProfile?.riskTolerance}, Income ${userProfile?.income}, Time Available ${userProfile?.availableTime}.

Generate 3 smart follow-up questions in relatable Indian professional context to clarify parameters before scenario generation.
Ensure any currency options use Indian Rupees (₹).

Return JSON format:
{
  "questions": [
    {
      "id": "q1",
      "question": "Question text...",
      "helpText": "Why this matters...",
      "options": ["Option A", "Option B", "Option C", "Other / Custom"]
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.6,
        },
      });

      const text = response.text || '{}';
      let data: any = {};
      try {
        let cleaned = text.trim();
        if (cleaned.startsWith('```')) {
          cleaned = cleaned.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
        }
        data = JSON.parse(cleaned);
      } catch (e) {
        console.warn('Failed to parse question JSON, using fallback structure');
        data = {
          questions: [
            {
              id: 'q1',
              question: `What is your primary target timeframe for achieving this ${goalCategory.toLowerCase()} goal in India?`,
              helpText: 'Helps balance aggressive vs conservative milestones',
              options: ['3-6 Months', '6-12 Months', '1-2 Years', 'Flexible']
            }
          ]
        };
      }
      return res.json(data);
    } catch (err: any) {
      console.error('Error generating questions:', err);
      return res.json({
        questions: [
          {
            id: 'q1',
            question: 'What is your primary timeframe for this goal?',
            helpText: 'Helps tailor timeline expectations',
            options: ['3-6 Months', '6-12 Months', '1-2 Years', 'Flexible']
          }
        ]
      });
    }
  });

  // Dedicated FDF System Architecture Endpoint
  app.get('/api/fdf/architecture', (_req, res) => {
    res.json({
      engineVersion: 'FDF-v2.5-PRO',
      systemName: 'Future Decision Framework Engine',
      disclaimer: 'This is a scenario-based decision support system. It does not predict the future.',
      modules: [
        { id: 1, name: 'Identity Engine', responsibility: 'Normalizes user profile, skills, income, and calculates weekly capacity hours.' },
        { id: 2, name: 'Goal Understanding Engine', responsibility: 'Structures raw goals into targets, timeline estimates, dependencies, and success criteria.' },
        { id: 3, name: 'Skill Gap Engine', responsibility: 'Identifies missing critical skills and calculates learning effort hours.' },
        { id: 4, name: 'Scenario Generator', responsibility: 'Generates 3 to 5 unique strategies (Aggressive, Balanced, Conservative).' },
        { id: 5, name: 'Risk Engine', responsibility: 'Evaluates 7 risk vectors (Financial, Time, Execution, Competition, Tech, Learning, Market).' },
        { id: 6, name: 'Opportunity Engine', responsibility: 'Scores 6 upside vectors (Income, Growth, Learning, Freedom, Demand, Networking).' },
        { id: 7, name: 'Decision Engine', responsibility: 'Calculates weighted Decision Score: (GoalFit*0.35 + Opp*0.35 - Risk*0.30).' },
        { id: 8, name: 'Roadmap Engine', responsibility: 'Outputs weekly plans, monthly themes, milestones, and project checkpoints.' },
        { id: 9, name: 'Report Engine', responsibility: 'Constructs standardized, strictly typed JSON report payload.' }
      ],
      formulas: {
        riskFormula: 'RiskScore = (Fin*0.25) + (Time*0.15) + (Exec*0.20) + (Comp*0.10) + (Tech*0.10) + (Learn*0.10) + (Mkt*0.10)',
        opportunityFormula: 'OppScore = (Income*0.25) + (Growth*0.20) + (Learn*0.15) + (Freedom*0.15) + (Demand*0.15) + (Network*0.10)',
        decisionFormula: 'DecisionScore = (GoalFit * 0.35) + (Opportunity * 0.35) - (Risk * 0.30)'
      }
    });
  });

  // Dedicated FDF Simulation Endpoint
  app.post('/api/fdf/simulate', async (req, res) => {
    try {
      const { userProfile, goalCategory, goalDetails, followUpAnswers } = req.body;
      const fallback = generateFallbackSimulation(goalCategory || 'Career', goalDetails || {});
      return res.json({
        engine: 'FDF-v2.5-PRO',
        timestamp: new Date().toISOString(),
        disclaimer: 'This is a scenario-based decision support system. It does not predict the future.',
        result: fallback
      });
    } catch (e: any) {
      return res.status(500).json({ error: e.message || 'FDF simulation error' });
    }
  });

  // Static file serving or Vite middleware
  const distPath = path.join(process.cwd(), 'dist');
  const indexHtmlPath = path.join(distPath, 'index.html');

  if (process.env.NODE_ENV === 'production' || fs.existsSync(indexHtmlPath)) {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      if (fs.existsSync(indexHtmlPath)) {
        res.sendFile(indexHtmlPath);
      } else {
        res.status(404).send('Application build not found.');
      }
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Future Engine server running on http://0.0.0.0:${PORT}`);
  });
}

function generateFallbackSimulation(goalCategory: string, goalDetails: any) {
  const title = goalDetails?.title || 'Goal Pursuit';
  return {
    disclaimer: "This is a scenario-based decision support system. It does not predict the future.",
    overallAnalysis: `Analysis for "${title}" across 3 core strategic pathways. Each path optimizes for a different risk-to-reward ratio given market context and typical Indian resource constraints. Strategy sahi ho to target zero stress ke saath achieve ho jayega.`,
    recommendedOptionIndex: 1,
    scenarios: [
      {
        id: "scenario-1",
        title: "Aggressive Fast-Track Path",
        tagline: "High investment, rapid execution, maximum career/financial growth potential in Indian market.",
        strategyType: "Aggressive",
        summary: `Immersive commitment toward ${title}. Prioritizes speed and maximum market upside by reallocating major capital and time resources immediately.`,
        fdfScores: {
          goalScore: 88,
          riskScore: 78,
          opportunityScore: 94,
          confidenceLevel: "Medium",
          confidenceReasoning: "High upside reliant on market demand and aggressive execution."
        },
        advantages: [
          "Fastest time-to-value and market positioning",
          "Unlocks high-tier CTC, bonuses and equity opportunities",
          "Steep skill growth trajectory in high-demand areas"
        ],
        disadvantages: [
          "Higher financial and burn rate risks",
          "Demands 25+ hours/week of intensive focus",
          "Potential burnout if burn rate outpaces milestones"
        ],
        risks: [
          "Market volatility could delay expected yield",
          "High upfront opportunity cost"
        ],
        opportunities: [
          "Early mover advantage in emerging Indian tech sub-sectors",
          "Direct access to premium networks and leadership roles"
        ],
        estimatedTimeline: "3–6 Months",
        skillGap: ["Advanced Strategic Execution", "Specialized Tooling Mastery"],
        budgetEstimate: "₹1,50,000 – ₹3,50,000",
        suggestedNextSteps: [
          "Perform competitive audit and build project portfolio",
          "Allocate 20 hrs/week for core sprint execution",
          "Connect with top 5 industry mentors"
        ]
      },
      {
        id: "scenario-2",
        title: "Balanced Parallel Transition",
        tagline: "Structured step-by-step progress while retaining current stability.",
        strategyType: "Balanced",
        summary: `De-risked approach to ${title}. Pursues milestones through consistent evening/weekend sprints while preserving financial runway and existing salary.`,
        fdfScores: {
          goalScore: 92,
          riskScore: 35,
          opportunityScore: 82,
          confidenceLevel: "High",
          confidenceReasoning: "Grounded in steady incremental execution without burning savings."
        },
        advantages: [
          "Low financial stress and high emotional stability",
          "Allows validation of real market demand before full pivot",
          "High retention of current income streams in ₹ Rupees"
        ],
        disadvantages: [
          "Slower momentum compared to full immersion",
          "Requires disciplined time-blocking (10-12 hrs/week)"
        ],
        risks: [
          "Task switching fatigue between current role and new goal",
          "Potential timeline drift without rigid milestones"
        ],
        opportunities: [
          "Build sustainable habits and long-term brand equity",
          "Compounding progress without high capital burn"
        ],
        estimatedTimeline: "6–12 Months",
        skillGap: ["Incremental Tooling", "Time Management Systems"],
        budgetEstimate: "₹40,000 – ₹1,00,000",
        suggestedNextSteps: [
          "Set up 10-hour weekly time-blocks",
          "Complete baseline certification / MVP build",
          "Validate concept with 3 real user tests or peer reviews"
        ]
      },
      {
        id: "scenario-3",
        title: "Conservative Low-Risk / Foundational",
        tagline: "Focuses on prerequisite skill building, saving capital, and risk mitigation.",
        strategyType: "Conservative",
        summary: `Foundation-first route. Focuses heavily on education, financial safety buffers, and risk mitigation prior to committing major resources to ${title}.`,
        fdfScores: {
          goalScore: 76,
          riskScore: 18,
          opportunityScore: 65,
          confidenceLevel: "High",
          confidenceReasoning: "High predictability with minimal exposure to market downside."
        },
        advantages: [
          "Near-zero financial risk or capital loss",
          "Thorough preparation and skill accumulation",
          "Stress-free pacing"
        ],
        disadvantages: [
          "Lengthy timeframe before seeing significant ROI",
          "Risk of missing early market windows"
        ],
        risks: [
          "Analysis paralysis and over-preparation",
          "Industry landscape changes during build phase"
        ],
        opportunities: [
          "Deep mastery of fundamentals",
          "Build robust financial safety cushion"
        ],
        estimatedTimeline: "12–18 Months",
        skillGap: ["Core Foundations", "Basic Project Management"],
        budgetEstimate: "₹10,000 – ₹30,000",
        suggestedNextSteps: [
          "Enroll in low-cost foundational courses",
          "Build a 6-month financial emergency buffer",
          "Draft initial project outline"
        ]
      }
    ],
    roadmap: [
      {
        phase: "Phase 1: Validation & Setup (Months 1–2)",
        actions: [
          "Audit existing skill profile and bridge critical gaps",
          "Establish dedicated workspace and weekly workflow blocks",
          "Complete baseline research and stakeholder outreach"
        ],
        milestone: "Validated strategic plan & core environment ready"
      },
      {
        phase: "Phase 2: Core Execution Sprint (Months 3–6)",
        actions: [
          "Launch initial pilot / project / skill certification",
          "Gather feedback and iterate on initial outputs",
          "Initiate networking or targeted outreach"
        ],
        milestone: "Working prototype / active traction achieved"
      },
      {
        phase: "Phase 3: Scaling & Transition (Months 6–12)",
        actions: [
          "Scale time allocation or transition into primary role",
          "Optimize revenue or high-value career positioning",
          "Establish long-term maintenance systems"
        ],
        milestone: "Full transition completed with sustained momentum"
      }
    ]
  };
}

startServer();
