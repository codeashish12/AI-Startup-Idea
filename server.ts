import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
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
