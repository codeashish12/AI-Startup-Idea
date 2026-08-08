export type StrategyType = 'Aggressive' | 'Balanced' | 'Conservative' | 'Custom';
export type ConfidenceLevel = 'High' | 'Medium' | 'Low';

export interface UserProfile {
  name: string;
  age: number;
  education: string;
  skills: string[];
  experience: string;
  income: string;
  city: string;
  availableTime: string; // e.g. "15 hrs/week"
  riskTolerance: 'Low' | 'Moderate' | 'High';
  goalsSummary: string;
  savings?: string;
  interests?: string[];
}

export type GoalCategory = 'Career' | 'Business' | 'Education' | 'Finance' | 'Skill Learning' | 'Custom Goal';

export interface GoalDetails {
  category: GoalCategory;
  title: string;
  description: string;
  targetTimeframe: string;
  targetBudget: string;
  keyPriority: string;
  requiredSkills?: string[];
  dependencies?: string[];
  successCriteria?: string[];
}

export interface FollowUpQuestion {
  id: string;
  question: string;
  helpText: string;
  options: string[];
}

export interface ScoreExplainability {
  score: number;
  formula: string;
  weightingBreakdown: Record<string, number>;
  keyDrivers: string[];
  penaltiesOrBoosts: string[];
  summary: string;
}

export interface RiskBreakdown {
  financialRisk: number; // 0-100
  timeRisk: number; // 0-100
  executionRisk: number; // 0-100
  competitionRisk: number; // 0-100
  technologyRisk: number; // 0-100
  learningRisk: number; // 0-100
  marketRisk: number; // 0-100
  overallRiskScore: number; // 0-100
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Extreme';
  reasons: string[];
  explainability?: ScoreExplainability;
}

export interface OpportunityBreakdown {
  incomePotential: number; // 0-100
  growthPotential: number; // 0-100
  learningValue: number; // 0-100
  freedomFlexibility: number; // 0-100
  futureDemand: number; // 0-100
  networkingValue: number; // 0-100
  overallOpportunityScore: number; // 0-100
  explainability?: ScoreExplainability;
}

export interface SkillGapAnalysis {
  currentSkills: string[];
  missingSkills: string[];
  criticalSkills: string[];
  optionalSkills: string[];
  learningPriority: string[];
  estimatedEffortHours: number;
  explainability?: ScoreExplainability;
}

export interface FdfScores {
  goalScore: number; // 0-100 (Goal Fit)
  riskScore: number; // 0-100
  opportunityScore: number; // 0-100
  decisionScore?: number; // Weighted composite: (GoalFit*0.35 + Opp*0.35 - Risk*0.30)
  confidenceLevel: ConfidenceLevel;
  confidenceReasoning: string;
  assumptions?: string[];
  tradeOffs?: string[];
  riskBreakdown?: RiskBreakdown;
  opportunityBreakdown?: OpportunityBreakdown;
  skillGapAnalysis?: SkillGapAnalysis;
  explainability?: ScoreExplainability;
}

export interface Scenario {
  id: string;
  title: string;
  tagline: string;
  strategyType: StrategyType;
  summary: string;
  fdfScores: FdfScores;
  advantages: string[];
  disadvantages: string[];
  risks: string[];
  opportunities: string[];
  estimatedTimeline: string;
  skillGap: string[];
  budgetEstimate: string;
  suggestedNextSteps: string[];
  dependencies?: string[];
  successFactors?: string[];
}

export interface RoadmapWeeklyPlan {
  week: number;
  focus: string;
  tasks: string[];
  checkpoint: string;
}

export interface RoadmapMonthlyPlan {
  month: number;
  theme: string;
  goals: string[];
  keyMilestone: string;
}

export interface RoadmapPhase {
  phase: string;
  actions: string[];
  milestone: string;
  weeklyPlan?: RoadmapWeeklyPlan[];
  monthlyPlan?: RoadmapMonthlyPlan[];
  projects?: string[];
  resources?: string[];
}

export interface FdfFullReport {
  timestamp: string;
  version: string;
  profile: UserProfile;
  goal: GoalDetails;
  scenarios: Scenario[];
  riskAnalysis: {
    recommendedScenarioRisk: RiskBreakdown;
    comparativeRiskSummary: string;
  };
  opportunityAnalysis: {
    recommendedScenarioOpportunity: OpportunityBreakdown;
    comparativeOpportunitySummary: string;
  };
  decisionMatrix: {
    weightedFormula: string;
    weights: { goalFit: number; opportunity: number; riskPenalty: number };
    topRecommendation: Scenario;
    decisionReasoning: string;
    confidence: ConfidenceLevel;
    assumptions: string[];
    limitations: string[];
  };
  roadmap: RoadmapPhase[];
}

export interface SimulationResult {
  id: string;
  createdAt: string;
  goalCategory: GoalCategory;
  goalDetails: GoalDetails;
  disclaimer: string;
  overallAnalysis: string;
  recommendedOptionIndex: number;
  scenarios: Scenario[];
  roadmap: RoadmapPhase[];
  followUpAnswers?: Record<string, string>;
  fullReport?: FdfFullReport;
}

export interface MostSelectedGoal {
  goalTitle: string;
  category: string;
  count: number;
  percentage: number;
}

export interface AnalyticsDashboardSummary {
  totalSimulations: number;
  averageDecisionScore: number;
  averageRiskScore: number;
  completionRate: number;
  mostSelectedGoals: MostSelectedGoal[];
  categoryBreakdown: Record<string, number>;
  riskDistribution: {
    lowRisk: number;
    moderateRisk: number;
    highRisk: number;
  };
  recentSimulations: {
    id: string;
    goalTitle: string;
    category: string;
    createdAt: string;
    recommendedStrategy: string;
    decisionScore?: number;
    riskScore?: number;
  }[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    email: string;
    name: string;
  } | null;
  token?: string | null;
}

