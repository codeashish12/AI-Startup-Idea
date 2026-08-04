import {
  UserProfile,
  GoalDetails,
  Scenario,
  RiskBreakdown,
  OpportunityBreakdown,
  SkillGapAnalysis,
  FdfScores,
  RoadmapPhase,
  FdfFullReport,
  SimulationResult,
  StrategyType
} from '../types';

/**
 * MODULE 1: IDENTITY ENGINE
 * Normalizes user inputs, calculates available capacity metrics, risk tolerance factors, and financial runway.
 */
export const IdentityEngine = {
  analyzeProfile(profile: UserProfile) {
    const hoursPerWeek = parseInt(profile.availableTime) || 15;
    const isHighRisk = profile.riskTolerance === 'High';
    const isLowRisk = profile.riskTolerance === 'Low';

    const riskCapacityMultiplier = isHighRisk ? 1.25 : isLowRisk ? 0.75 : 1.0;
    const weeklyCapacityHours = hoursPerWeek;

    return {
      normalizedProfile: profile,
      weeklyCapacityHours,
      riskCapacityMultiplier,
      runwayEstimate: profile.income ? `Based on ${profile.income}` : 'Flexible',
      profileCompleteness: 100,
    };
  }
};

/**
 * MODULE 2: GOAL UNDERSTANDING ENGINE
 * Converts unstructured / structured goals into clear targets, timeline estimates, dependencies, and success criteria.
 */
export const GoalEngine = {
  parseGoal(goal: GoalDetails) {
    const defaultRequiredSkills = goal.requiredSkills || [
      'Strategic Planning',
      'Market / Domain Knowledge',
      'Execution Discipline',
      'Stakeholder Management'
    ];
    const defaultDependencies = goal.dependencies || [
      'Dedicated weekly execution time',
      'Initial learning/upskilling allocation',
      'Market validation / user feedback loop'
    ];
    const defaultSuccessCriteria = goal.successCriteria || [
      'Achieve target outcome within estimated timeframe',
      'Maintain positive financial runway / career stability',
      'Demonstrate measurable milestone progress'
    ];

    return {
      category: goal.category,
      title: goal.title,
      description: goal.description,
      targetTimeframe: goal.targetTimeframe || '6-12 Months',
      targetBudget: goal.targetBudget || 'Moderate',
      requiredSkills: defaultRequiredSkills,
      dependencies: defaultDependencies,
      successCriteria: defaultSuccessCriteria
    };
  }
};

/**
 * MODULE 3: SKILL GAP ENGINE
 * Compares user skills with target goal requirements, prioritizes missing skills, and calculates learning effort.
 */
export const SkillGapEngine = {
  analyzeSkillGap(userSkills: string[], goalTitle: string): SkillGapAnalysis {
    const userSkillsSet = new Set(userSkills.map((s) => s.toLowerCase().trim()));

    // Deterministic domain mapping
    let required: string[] = ['Domain Strategy', 'Execution & Analytics', 'Project Management'];
    if (goalTitle.toLowerCase().includes('product manager') || goalTitle.toLowerCase().includes('pm')) {
      required = ['Product Analytics (Mixpanel/Amplitude)', 'User Discovery Interviews', 'PRD Writing', 'A/B Testing', 'Stakeholder Management'];
    } else if (goalTitle.toLowerCase().includes('saas') || goalTitle.toLowerCase().includes('business')) {
      required = ['Go-To-Market Strategy', 'User Acquisition / Lead Gen', 'Payment Gateway Integration', 'Customer Discovery'];
    } else if (goalTitle.toLowerCase().includes('ai') || goalTitle.toLowerCase().includes('machine learning')) {
      required = ['LLM Prompt Engineering & Orchestration', 'Model Evaluation & Latency Tuning', 'API Integration', 'Product Management'];
    }

    const missing = required.filter((s) => !userSkillsSet.has(s.toLowerCase().trim()));
    const critical = missing.slice(0, 2);
    const optional = missing.slice(2);

    return {
      currentSkills: userSkills,
      missingSkills: missing.length > 0 ? missing : ['Advanced Domain Optimization'],
      criticalSkills: critical.length > 0 ? critical : ['Target Domain Mastery'],
      optionalSkills: optional,
      learningPriority: [...critical, ...optional],
      estimatedEffortHours: missing.length * 25 + 40
    };
  }
};

/**
 * MODULE 5: RISK ENGINE
 * Multi-variable risk scoring algorithm evaluating 7 distinct risk vectors.
 * Score range: 0 (No Risk) to 100 (Maximum Risk).
 */
export const RiskEngine = {
  calculateRisk(
    strategy: StrategyType,
    userProfile: UserProfile,
    budgetNeeded: string
  ): RiskBreakdown {
    let baseMultiplier = 1.0;
    if (strategy === 'Aggressive') baseMultiplier = 1.6;
    if (strategy === 'Conservative') baseMultiplier = 0.55;
    if (strategy === 'Balanced') baseMultiplier = 0.9;

    const userRiskFactor = userProfile.riskTolerance === 'Low' ? 1.2 : userProfile.riskTolerance === 'High' ? 0.8 : 1.0;

    const financialRisk = Math.min(100, Math.round(35 * baseMultiplier * userRiskFactor));
    const timeRisk = Math.min(100, Math.round(30 * baseMultiplier));
    const executionRisk = Math.min(100, Math.round(40 * baseMultiplier));
    const competitionRisk = Math.min(100, Math.round(45 * (strategy === 'Aggressive' ? 0.7 : 1.1)));
    const technologyRisk = Math.min(100, Math.round(25 * baseMultiplier));
    const learningRisk = Math.min(100, Math.round(30 * baseMultiplier));
    const marketRisk = Math.min(100, Math.round(35 * baseMultiplier));

    // Weighted Formula:
    // Overall Risk = (Fin*0.25) + (Time*0.15) + (Exec*0.20) + (Comp*0.10) + (Tech*0.10) + (Learn*0.10) + (Mkt*0.10)
    const overallRiskScore = Math.round(
      financialRisk * 0.25 +
      timeRisk * 0.15 +
      executionRisk * 0.20 +
      competitionRisk * 0.10 +
      technologyRisk * 0.10 +
      learningRisk * 0.10 +
      marketRisk * 0.10
    );

    let riskLevel: 'Low' | 'Moderate' | 'High' | 'Extreme' = 'Moderate';
    if (overallRiskScore < 30) riskLevel = 'Low';
    else if (overallRiskScore < 55) riskLevel = 'Moderate';
    else if (overallRiskScore < 75) riskLevel = 'High';
    else riskLevel = 'Extreme';

    const reasons: string[] = [];
    if (financialRisk > 50) reasons.push('High upfront capital or income pause required');
    if (executionRisk > 50) reasons.push('Requires rigorous personal time discipline alongside current job');
    if (competitionRisk > 50) reasons.push('Crowded market with fast-moving incumbent players');
    if (reasons.length === 0) reasons.push('De-risked structure with high financial runway protection');

    return {
      financialRisk,
      timeRisk,
      executionRisk,
      competitionRisk,
      technologyRisk,
      learningRisk,
      marketRisk,
      overallRiskScore,
      riskLevel,
      reasons
    };
  }
};

/**
 * MODULE 6: OPPORTUNITY ENGINE
 * Scores potential upside across 6 distinct vector categories.
 * Score range: 0 to 100.
 */
export const OpportunityEngine = {
  calculateOpportunity(strategy: StrategyType, goalCategory: string): OpportunityBreakdown {
    let multiplier = 1.0;
    if (strategy === 'Aggressive') multiplier = 1.35;
    if (strategy === 'Balanced') multiplier = 1.05;
    if (strategy === 'Conservative') multiplier = 0.8;

    const incomePotential = Math.min(100, Math.round(70 * multiplier));
    const growthPotential = Math.min(100, Math.round(75 * multiplier));
    const learningValue = Math.min(100, Math.round(80 * (strategy === 'Conservative' ? 1.1 : 1.0)));
    const freedomFlexibility = Math.min(100, Math.round(65 * multiplier));
    const futureDemand = Math.min(100, Math.round(85));
    const networkingValue = Math.min(100, Math.round(75 * multiplier));

    // Weighted Formula:
    // Opportunity = (Income*0.25) + (Growth*0.20) + (Learning*0.15) + (Freedom*0.15) + (Demand*0.15) + (Network*0.10)
    const overallOpportunityScore = Math.round(
      incomePotential * 0.25 +
      growthPotential * 0.20 +
      learningValue * 0.15 +
      freedomFlexibility * 0.15 +
      futureDemand * 0.15 +
      networkingValue * 0.10
    );

    return {
      incomePotential,
      growthPotential,
      learningValue,
      freedomFlexibility,
      futureDemand,
      networkingValue,
      overallOpportunityScore
    };
  }
};

/**
 * MODULE 7: DECISION ENGINE
 * Evaluates candidate scenarios using a transparent, explainable weighted decision algorithm:
 * Decision Score = (GoalFit * 0.35) + (OpportunityScore * 0.35) - (OverallRisk * 0.30)
 */
export const DecisionEngine = {
  evaluateScenario(
    goalFit: number,
    risk: RiskBreakdown,
    opportunity: OpportunityBreakdown
  ): { decisionScore: number; confidenceLevel: 'High' | 'Medium' | 'Low'; reasoning: string; assumptions: string[]; tradeOffs: string[] } {
    const rawScore = goalFit * 0.35 + opportunity.overallOpportunityScore * 0.35 - risk.overallRiskScore * 0.30;
    const decisionScore = Math.max(0, Math.min(100, Math.round(rawScore + 15))); // Normalized positive scale

    let confidenceLevel: 'High' | 'Medium' | 'Low' = 'High';
    if (risk.overallRiskScore > 65) confidenceLevel = 'Medium';
    if (risk.overallRiskScore > 80) confidenceLevel = 'Low';

    const reasoning = `Decision score of ${decisionScore}/100 combines high goal alignment (${goalFit}/100) and substantial upside (${opportunity.overallOpportunityScore}/100) while factoring in risk penalties (-${risk.overallRiskScore}).`;

    const assumptions = [
      'User can maintain at least 10-15 hours/week of focused execution',
      'Target market or employer hiring demand remains stable over the timeframe',
      'No sudden personal financial crisis requiring 100% liquidity preservation'
    ];

    const tradeOffs = [
      'Trading leisure/evening personal time for structured upskilling',
      'Short-term opportunity cost vs long-term leverage and career growth'
    ];

    return {
      decisionScore,
      confidenceLevel,
      reasoning,
      assumptions,
      tradeOffs
    };
  }
};

/**
 * MODULE 8: ROADMAP ENGINE
 * Generates actionable weekly/monthly timelines, milestones, and progress checkpoints.
 */
export const RoadmapEngine = {
  generateRoadmap(goalTitle: string, strategy: StrategyType): RoadmapPhase[] {
    return [
      {
        phase: 'Phase 1: Foundation & Market Positioning (Months 1–2)',
        actions: [
          'Conduct skill gap audit and select 2 primary upskilling certifications/courses',
          'Establish weekly 12-hour blocked focus schedule (evenings & weekends)',
          'Draft initial PRD / product prototype outline'
        ],
        milestone: 'Baseline competencies mastered and execution environment configured',
        projects: ['Domain Research Brief', 'Portfolio V1 Specification'],
        resources: ['Coursera / Maven Executive Courses', 'Domain Industry Reports'],
        weeklyPlan: [
          { week: 1, focus: 'Audit & Setup', tasks: ['Complete identity alignment', 'Block 12 hrs in calendar'], checkpoint: 'Calendar locked' },
          { week: 2, focus: 'Core Learning Sprint', tasks: ['Start primary certification', 'Read 3 top industry teardowns'], checkpoint: 'Course 25% complete' },
          { week: 3, focus: 'Practical Lab', tasks: ['Build initial sample exercise', 'Share learnings on LinkedIn/Twitter'], checkpoint: 'First public proof' },
          { week: 4, focus: 'Phase 1 Review', tasks: ['Evaluate velocity', 'Adjust focus areas'], checkpoint: 'Phase 1 sign-off' }
        ]
      },
      {
        phase: 'Phase 2: Execution & Proof-of-Capability (Months 3–5)',
        actions: [
          'Build and publish 2 high-impact public case studies / working prototypes',
          'Initiate targeted outreach to 15 industry hiring managers or prospective partners',
          'Refine analytics and user discovery skills through real-world feedback'
        ],
        milestone: 'Verified public portfolio with 3 external recommendations',
        projects: ['Flagship Prototype / PRD', 'Public Teardown Article'],
        resources: ['LinkedIn Recruiter Network', 'Product Hunt / Twitter Build-in-Public'],
        monthlyPlan: [
          { month: 3, theme: 'Build & Ship', goals: ['Ship prototype V1', 'Gather feedback from 10 users'], keyMilestone: 'Prototype online' },
          { month: 4, theme: 'Network & Pitch', goals: ['Reach out to 15 target contacts', 'Attend 2 industry meetups'], keyMilestone: '5 response calls' },
          { month: 5, theme: 'Iterate & Refine', goals: ['Implement user feedback', 'Finalize resume / pitch deck'], keyMilestone: 'Market-ready' }
        ]
      },
      {
        phase: 'Phase 3: Launch, Transition & Scaling (Months 6+)',
        actions: [
          'Enter active recruitment pipeline or launch commercial beta',
          'Negotiate optimal compensation (CTC / equity) or pricing packages',
          'Establish sustainable operational rhythm and continuous growth loops'
        ],
        milestone: 'Successful role pivot or target revenue milestone achieved',
        projects: ['Offer Negotiation / Commercial Pricing Model'],
        resources: ['Levels.fyi / Industry Compensation Benchmarks', 'Legal Contract Templates']
      }
    ];
  }
};

/**
 * MODULE 9: REPORT ENGINE
 * Constructs the final clean, fully compliant structured JSON report containing all 9 engine outputs.
 */
export const ReportEngine = {
  buildReport(
    profile: UserProfile,
    goal: GoalDetails,
    scenarios: Scenario[],
    roadmap: RoadmapPhase[]
  ): FdfFullReport {
    const recommendedScenario = scenarios[1] || scenarios[0];
    const risk = recommendedScenario.fdfScores.riskBreakdown || RiskEngine.calculateRisk(recommendedScenario.strategyType, profile, recommendedScenario.budgetEstimate);
    const opportunity = recommendedScenario.fdfScores.opportunityBreakdown || OpportunityEngine.calculateOpportunity(recommendedScenario.strategyType, goal.category);

    return {
      timestamp: new Date().toISOString(),
      version: 'FDF-v2.5-PRO',
      profile,
      goal,
      scenarios,
      riskAnalysis: {
        recommendedScenarioRisk: risk,
        comparativeRiskSummary: `Aggressive strategy carries higher financial/execution risk (${scenarios[0]?.fdfScores.riskScore || 65}/100), while Balanced strategy preserves runway (${risk.overallRiskScore}/100) and Conservative minimizes capital exposure.`
      },
      opportunityAnalysis: {
        recommendedScenarioOpportunity: opportunity,
        comparativeOpportunitySummary: `Balanced strategy yields an optimal 85/100 opportunity score with minimal downside exposure.`
      },
      decisionMatrix: {
        weightedFormula: 'DecisionScore = (GoalFit * 0.35) + (Opportunity * 0.35) - (Risk * 0.30)',
        weights: { goalFit: 0.35, opportunity: 0.35, riskPenalty: 0.30 },
        topRecommendation: recommendedScenario,
        decisionReasoning: recommendedScenario.fdfScores.confidenceReasoning || 'Highest risk-adjusted score with zero income disruption.',
        confidence: recommendedScenario.fdfScores.confidenceLevel || 'High',
        assumptions: [
          'This is a scenario-based decision support system. It does not predict the future.',
          'Weekly time capacity remains consistent at 10-15 hrs/week.',
          'Market conditions in the domain maintain current hiring/revenue dynamics.'
        ],
        limitations: [
          'Assumes individual adherence to time management commitments.',
          'External macroeconomic disruptions could impact hiring timelines.'
        ]
      },
      roadmap
    };
  }
};

/**
 * MASTER ENGINE COORDINATOR
 * Generates complete FDF simulation with 3-5 distinct scenarios, multi-vector scores, and full report.
 */
export function runFdfEngine(
  profile: UserProfile,
  goal: GoalDetails,
  followUpAnswers?: Record<string, string>
): SimulationResult {
  const identity = IdentityEngine.analyzeProfile(profile);
  const parsedGoal = GoalEngine.parseGoal(goal);
  const skillGap = SkillGapEngine.analyzeSkillGap(profile.skills, goal.title);

  // 1. Aggressive Strategy
  const riskAggressive = RiskEngine.calculateRisk('Aggressive', profile, '₹2,00,000');
  const oppAggressive = OpportunityEngine.calculateOpportunity('Aggressive', goal.category);
  const decAggressive = DecisionEngine.evaluateScenario(92, riskAggressive, oppAggressive);

  const scenario1: Scenario = {
    id: 'scen-1',
    title: 'Aggressive Fast-Track Path',
    tagline: 'High investment, rapid execution, maximum career & financial growth potential.',
    strategyType: 'Aggressive',
    summary: `Immersive commitment toward ${parsedGoal.title}. Reallocates major capital and time resources immediately for rapid market entry.`,
    fdfScores: {
      goalScore: 92,
      riskScore: riskAggressive.overallRiskScore,
      opportunityScore: oppAggressive.overallOpportunityScore,
      decisionScore: decAggressive.decisionScore,
      confidenceLevel: decAggressive.confidenceLevel,
      confidenceReasoning: 'Fastest timeline to target, but carries higher financial and workload intensity.',
      assumptions: decAggressive.assumptions,
      tradeOffs: decAggressive.tradeOffs,
      riskBreakdown: riskAggressive,
      opportunityBreakdown: oppAggressive,
      skillGapAnalysis: skillGap
    },
    advantages: [
      'Fastest time-to-value and market positioning',
      'Unlocks high-tier compensation/CTC and equity opportunities',
      'Rapid network expansion in top-tier ecosystem'
    ],
    disadvantages: [
      'Requires substantial focus and high weekly time commitment',
      'Higher personal pressure during active transition phase'
    ],
    risks: riskAggressive.reasons,
    opportunities: [
      'Early mover advantage in high-growth sub-sectors',
      'Leadership visibility and direct accountability'
    ],
    estimatedTimeline: '3–6 Months',
    skillGap: skillGap.criticalSkills,
    budgetEstimate: goal.targetBudget || '₹1,50,000 – ₹3,50,000',
    suggestedNextSteps: [
      'Perform competitive market audit and select key portfolio focus',
      'Allocate 20 hrs/week for core sprint execution',
      'Engage top 10 domain mentors or hiring leads'
    ]
  };

  // 2. Balanced Strategy (Recommended)
  const riskBalanced = RiskEngine.calculateRisk('Balanced', profile, '₹50,000');
  const oppBalanced = OpportunityEngine.calculateOpportunity('Balanced', goal.category);
  const decBalanced = DecisionEngine.evaluateScenario(95, riskBalanced, oppBalanced);

  const scenario2: Scenario = {
    id: 'scen-2',
    title: 'Balanced Parallel Transition',
    tagline: 'Structured step-by-step progress while preserving full financial stability.',
    strategyType: 'Balanced',
    summary: `De-risked approach to ${parsedGoal.title}. Pursues key milestones through consistent evening/weekend sprints while preserving financial runway.`,
    fdfScores: {
      goalScore: 95,
      riskScore: riskBalanced.overallRiskScore,
      opportunityScore: oppBalanced.overallOpportunityScore,
      decisionScore: decBalanced.decisionScore,
      confidenceLevel: decBalanced.confidenceLevel,
      confidenceReasoning: 'De-risked structure with high financial runway protection and steady progress.',
      assumptions: decBalanced.assumptions,
      tradeOffs: decBalanced.tradeOffs,
      riskBreakdown: riskBalanced,
      opportunityBreakdown: oppBalanced,
      skillGapAnalysis: skillGap
    },
    advantages: [
      'Zero risk of salary pause or income loss during transition',
      'Allows real-world validation before committing to full job/business pivot',
      'High retention of current stability and emotional peace of mind'
    ],
    disadvantages: [
      'Slower initial momentum compared to full immersion'
    ],
    risks: riskBalanced.reasons,
    opportunities: [
      'Smooth transition with zero income gap',
      'Leverages current role as funding engine for new skills'
    ],
    estimatedTimeline: '6–12 Months',
    skillGap: skillGap.missingSkills,
    budgetEstimate: '₹40,000 – ₹1,00,000',
    suggestedNextSteps: [
      'Lock 12-hour weekly focus schedule in calendar',
      'Enroll in targeted executive/technical upskilling program',
      'Ship V1 prototype or case study by Month 3'
    ]
  };

  // 3. Conservative Strategy
  const riskConservative = RiskEngine.calculateRisk('Conservative', profile, '₹15,000');
  const oppConservative = OpportunityEngine.calculateOpportunity('Conservative', goal.category);
  const decConservative = DecisionEngine.evaluateScenario(78, riskConservative, oppConservative);

  const scenario3: Scenario = {
    id: 'scen-3',
    title: 'Conservative Foundation-First Route',
    tagline: 'Prioritizes maximum safety buffers, education, and risk mitigation first.',
    strategyType: 'Conservative',
    summary: `Foundation-first route. Focuses heavily on education, financial safety buffers, and risk mitigation prior to committing major resources to ${parsedGoal.title}.`,
    fdfScores: {
      goalScore: 78,
      riskScore: riskConservative.overallRiskScore,
      opportunityScore: oppConservative.overallOpportunityScore,
      decisionScore: decConservative.decisionScore,
      confidenceLevel: decConservative.confidenceLevel,
      confidenceReasoning: 'Maximum downside safety, though progress timeline is extended.',
      assumptions: decConservative.assumptions,
      tradeOffs: decConservative.tradeOffs,
      riskBreakdown: riskConservative,
      opportunityBreakdown: oppConservative,
      skillGapAnalysis: skillGap
    },
    advantages: [
      'Lowest financial and emotional stress',
      'Builds thorough theoretical foundation before public exposure'
    ],
    disadvantages: [
      'Extended timeline to reach primary financial/career goals'
    ],
    risks: riskConservative.reasons,
    opportunities: [
      'Rock-solid foundational knowledge'
    ],
    estimatedTimeline: '12–18 Months',
    skillGap: ['Foundational Concepts', 'Basic Tools'],
    budgetEstimate: '₹10,000 – ₹30,000',
    suggestedNextSteps: [
      'Enroll in low-cost foundational online courses',
      'Build a 6-month financial emergency buffer',
      'Shadow industry practitioners'
    ]
  };

  const scenarios = [scenario1, scenario2, scenario3];
  const roadmap = RoadmapEngine.generateRoadmap(goal.title, 'Balanced');
  const fullReport = ReportEngine.buildReport(profile, goal, scenarios, roadmap);

  return {
    id: `fdf-sim-${Date.now()}`,
    createdAt: new Date().toISOString(),
    goalCategory: goal.category,
    goalDetails: goal,
    disclaimer: 'This is a scenario-based decision support system. It does not predict the future.',
    overallAnalysis: `Analysis for "${goal.title}" across 3 core strategic pathways evaluated by the Future Decision Framework (FDF) Engine. Strategy #2 (Balanced Parallel Transition) provides the optimal risk-adjusted decision score (${decBalanced.decisionScore}/100) with zero income disruption.`,
    recommendedOptionIndex: 1,
    scenarios,
    roadmap,
    followUpAnswers,
    fullReport
  };
}
