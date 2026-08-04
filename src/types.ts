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
}

export type GoalCategory = 'Career' | 'Business' | 'Education' | 'Finance' | 'Skill Learning' | 'Custom Goal';

export interface GoalDetails {
  category: GoalCategory;
  title: string;
  description: string;
  targetTimeframe: string;
  targetBudget: string;
  keyPriority: string;
}

export interface FollowUpQuestion {
  id: string;
  question: string;
  helpText: string;
  options: string[];
}

export interface FdfScores {
  goalScore: number; // 0-100
  riskScore: number; // 0-100
  opportunityScore: number; // 0-100
  confidenceLevel: ConfidenceLevel;
  confidenceReasoning: string;
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
}

export interface RoadmapPhase {
  phase: string;
  actions: string[];
  milestone: string;
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
}

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    email: string;
    name: string;
  } | null;
}
