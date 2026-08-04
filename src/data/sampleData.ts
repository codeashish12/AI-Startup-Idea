import { UserProfile, GoalCategory, SimulationResult } from '../types';

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Aarav Sharma',
  age: 28,
  education: 'B.Tech in Computer Science (Tier-1 Tech Institute)',
  skills: ['Full-Stack React & Node', 'Python LLM Chains', 'Product Design', 'Agile & Jira', 'System Architecture'],
  experience: '4 years as Senior Software Engineer at Bengaluru Tech Startup',
  income: '₹18,00,000 / year (₹18 LPA)',
  city: 'Bengaluru, Karnataka',
  availableTime: '15 hours / week (Weekends & Evenings)',
  riskTolerance: 'Moderate',
  goalsSummary: 'SDE se AI Product Lead me pivot karna hai ya fir micro-AI SaaS launch karni hai, zero income disruption ke saath.',
};

export const GOAL_CATEGORIES: { category: GoalCategory; icon: string; description: string; placeholderTitle: string; defaultDetails: string }[] = [
  {
    category: 'Career',
    icon: 'Briefcase',
    description: 'Promotions, career pivots, SDE se Product Manager switch, ya remote MNC jobs evaluate karein.',
    placeholderTitle: 'Senior SDE se AI Product Manager Transition',
    defaultDetails: 'Engineering role se AI Product Lead me switch karna hai Bengaluru/Gurugram tech market me upcoming 6-9 months me.',
  },
  {
    category: 'Business',
    icon: 'Rocket',
    description: 'Bootstrapping, D2C brand, Freelance agency, ya B2B AI SaaS launch ki viability test karein.',
    placeholderTitle: 'Launch B2B AI Workflow SaaS in India',
    defaultDetails: 'Indian SMEs & legal firms ke liye vertical AI SaaS build karke ₹2 Lakhs MRR achieve karna in 6 months.',
  },
  {
    category: 'Education',
    icon: 'GraduationCap',
    description: 'IIM Executive MBA, IIT Certifications, UpGrad executive courses, ya self-learning ka ROI compare karein.',
    placeholderTitle: 'IIM Executive MBA vs AI Executive Masterclass',
    defaultDetails: 'Determine karein ₹15 Lakhs ka MBA best ROI dega ya ₹50,000 specialized AI certification.',
  },
  {
    category: 'Finance',
    icon: 'TrendingUp',
    description: 'Capital allocation: Mutual Funds / Equity vs Startup Runway vs Real Estate.',
    placeholderTitle: 'Allocate ₹10 Lakhs Savings: SIPs vs Startup Runway',
    defaultDetails: 'Evaluate karein ₹10 Lakhs liquid savings ko conservative Mutual Funds me daalein ya bootstrapping runway me.',
  },
  {
    category: 'Skill Learning',
    icon: 'Brain',
    description: 'Generative AI, Agentic Workflows, PyTorch, ya System Design master karein.',
    placeholderTitle: 'Master Agentic AI & PyTorch in 6 Months',
    defaultDetails: 'End-to-end LLM Fine-tuning aur Agentic frameworks seekhna to command 2x CTC in Indian Tech market.',
  },
  {
    category: 'Custom Goal',
    icon: 'Target',
    description: 'Aapka custom life/career scenario: India return, Tier-2 city remote work, multi-income streams.',
    placeholderTitle: 'Bengaluru se Tier-2 City (Jaipur/Indore) Remote Shift',
    defaultDetails: 'Tier-1 city se Tier-2 move karke living cost reduce karna and remote job scaling test karna.',
  },
];

export const INITIAL_SAMPLE_SIMULATION: SimulationResult = {
  id: 'sim-sample-101',
  createdAt: new Date().toISOString(),
  goalCategory: 'Career',
  goalDetails: {
    category: 'Career',
    title: 'Transition from Senior SDE to AI Product Manager (Bengaluru Ecosystem)',
    description: 'Full-stack software engineering se AI Product Management me switch in a high-growth tech scaleup or AI startup in Bengaluru/NCR.',
    targetTimeframe: '6 - 9 Months',
    targetBudget: '₹1,00,000 - ₹3,00,000',
    keyPriority: 'Maximizing Long-term Career Leverage & CTC Growth',
  },
  disclaimer: 'This is a scenario-based decision support system. It does not predict the future.',
  overallAnalysis: 'Senior SDE se AI Product Manager me switch karna Indian tech market me super strategic & high-reward move hai. Technical background hone ki wajah se LLMs, latency aur APIs ki samajh solid hai. Bus product analytics, user discovery interviews aur PRDs ki grip banani hai. Decisions sahi ho to future set hai!',
  recommendedOptionIndex: 1,
  scenarios: [
    {
      id: 'scen-1',
      title: 'Internal Lateral Shift & AI Champion Role',
      tagline: 'Current company me tenure leverage karke internal AI features spearhead karo aur PM title claim karo.',
      strategyType: 'Balanced',
      summary: 'Current tech company me internal AI feature sprint lead karne ka proposal do. 50% dev time technical PM specs and prompt architecture me dedicate karo under an executive sponsor.',
      fdfScores: {
        goalScore: 94,
        riskScore: 24,
        opportunityScore: 86,
        confidenceLevel: 'High',
        confidenceReasoning: 'Current company domain knowledge risk ko minimum kar deti hai aur external job hunting stress hatati hai.',
      },
      advantages: [
        'Zero risk of salary pause or income loss during transition',
        'Immediate hands-on AI product ownership with real active users',
        'Builds internal executive championship and promotion leverage'
      ],
      disadvantages: [
        'Compensation adjustment may lag external market rates',
        'May retain lingering legacy development responsibilities'
      ],
      risks: [
        'Internal budget cuts or pivot away from AI initiatives',
        'Overlaps with day-to-day engineering deliverables'
      ],
      opportunities: [
        'First-mover title bump to AI Product Lead within 6 months',
        'Build real-world case studies for future senior roles'
      ],
      estimatedTimeline: '4–6 Months',
      skillGap: ['User Discovery Interviews', 'Product Analytics (Mixpanel/Amplitude)', 'PRD Writing'],
      budgetEstimate: '₹40,000 – ₹1,00,000 (Courses & Upskilling)',
      suggestedNextSteps: [
        'Draft an AI enhancement proposal for current company flagship product',
        'Schedule a 1-on-1 with VP of Product to discuss internal lateral pathway',
        'Enroll in Executive Product Management or AI Product Leadership course'
      ]
    },
    {
      id: 'scen-2',
      title: 'Aggressive Market Switch to High-Growth AI Startup',
      tagline: 'Series A/B AI-first startup me Technical PM position par direct switch target karo with high CTC hike.',
      strategyType: 'Aggressive',
      summary: 'Public portfolio banao with 3 working AI agent prototypes & detailed PRDs. Fast-growing Indian AI scaleups & startups me direct Technical PM roles ke liye apply karo.',
      fdfScores: {
        goalScore: 89,
        riskScore: 68,
        opportunityScore: 96,
        confidenceLevel: 'Medium',
        confidenceReasoning: 'Higher external hiring competition and startup market volatility.',
      },
      advantages: [
        'Highest immediate CTC jump (+30-50% including ESOPs)',
        '100% focused on cutting-edge AI product culture from day one',
        'Rapid network expansion in top-tier Indian AI ecosystem'
      ],
      disadvantages: [
        'Intense recruitment process and portfolio requirements',
        'Higher startup burn rate and position instability'
      ],
      risks: [
        'Job market delays requiring 3-6 months of interviewing',
        'High pressure environment with tight runway'
      ],
      opportunities: [
        'High-upside equity package in high-growth startup',
        'Accelerated path to VP of Product'
      ],
      estimatedTimeline: '3–6 Months',
      skillGap: ['Formal PM Interview Prep', 'Product Metrics', 'Stakeholder Management'],
      budgetEstimate: '₹1,50,000 – ₹3,00,000 (Interview Coaching & Certs)',
      suggestedNextSteps: [
        'Publish 2 teardowns of popular AI products on LinkedIn/Substack',
        'Apply to 15 curated Series A/B AI startups in Bengaluru/NCR',
        'Practice mock PM interviews twice weekly'
      ]
    },
    {
      id: 'scen-3',
      title: 'Part-Time Bootstrapped AI SaaS + Consulting',
      tagline: 'Niche AI SaaS build karo evenings & weekends me while consulting as an AI Advisor.',
      strategyType: 'Conservative',
      summary: 'Current job maintain rakho and evenings me niche Indian SME AI product launch karo. PM experience builder ki tarah founder-PM role se gain karo.',
      fdfScores: {
        goalScore: 78,
        riskScore: 32,
        opportunityScore: 82,
        confidenceLevel: 'High',
        confidenceReasoning: 'Complete autonomy with proven developer capability to execute software.',
      },
      advantages: [
        'Full creative freedom and 100% equity ownership',
        'Direct experience in pricing, user acquisition, and retention',
        'Generates passive or recurring revenue potential in ₹ Rupees'
      ],
      disadvantages: [
        'High personal workload (15-20 extra hours per week)',
        'Distribution and marketing will be steep learning curve'
      ],
      risks: [
        'Slow user traction or low willingness-to-pay',
        'Work-life balance strain'
      ],
      opportunities: [
        'Can grow into full-time venture or serve as ultimate portfolio flex',
        'Recurring revenue diversification in Indian & Global market'
      ],
      estimatedTimeline: '6–12 Months',
      skillGap: ['Go-To-Market Strategy', 'User Acquisition', 'Razorpay/Stripe Integration'],
      budgetEstimate: '₹50,000 – ₹1,50,000 (API costs & infrastructure)',
      suggestedNextSteps: [
        'Identify 3 specific pain points in developer/legal workflow in India',
        'Build MVP in 2-week sprint and launch on Twitter/Product Hunt',
        'Track active user conversion and feedback loops'
      ]
    }
  ],
  roadmap: [
    {
      phase: 'Phase 1: Foundation & Skill Alignment (Months 1–2)',
      actions: [
        'Complete targeted Product Management course (PRDs, metrics, roadmapping)',
        'Audit current company product roadmap for high-value AI insertion points',
        'Draft first public AI product case study teardown'
      ],
      milestone: 'Portfolio & internal pitch deck finalized'
    },
    {
      phase: 'Phase 2: Active Pitch & Portfolio Build (Months 3–4)',
      actions: [
        'Present AI product proposal to VP of Product / CTO internally',
        'Deploy 1 working open-source AI agent project with user analytics',
        'Begin selective external interviews with Series A/B AI scale-ups'
      ],
      milestone: 'First internal AI PM project assignment or initial job offers'
    },
    {
      phase: 'Phase 3: Transition & Optimization (Months 5–8)',
      actions: [
        'Formalize new title transition to AI Product Lead',
        'Establish quarterly KPI tracking for model latency, user retention, and feature adoption',
        'Mentor junior developers interested in product workflows'
      ],
      milestone: 'Full transition completed with documented AI product launches'
    }
  ]
};

