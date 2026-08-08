import { GoogleGenAI } from '@google/genai';
import { UserProfile, GoalDetails, SimulationResult, Scenario } from '../../types';
import { identityService } from '../services/identity.service';
import { goalService } from '../services/goal.service';
import { skillGapService } from '../services/skillGap.service';
import { riskService } from '../services/risk.service';
import { opportunityService } from '../services/opportunity.service';
import { decisionService } from '../services/decision.service';
import { roadmapService } from '../services/roadmap.service';
import { reportService } from '../services/report.service';
import { FDF_CONFIG } from '../../config/fdfConfig';

export class AiOrchestrator {
  private ai: GoogleGenAI | null = null;

  constructor() {
    if (process.env.GEMINI_API_KEY) {
      try {
        this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      } catch (e) {
        console.warn('AiOrchestrator: Gemini initialization skipped or failed:', e);
      }
    }
  }

  /**
   * Main Orchestration Entry Point
   * Coordinates Identity, Goal, Skill Gap, Risk, Opportunity, Decision, Roadmap, and Report services.
   */
  public async simulate(
    rawProfile: UserProfile,
    rawGoal: GoalDetails,
    followUpAnswers?: Record<string, string>
  ): Promise<SimulationResult> {
    const startTime = Date.now();

    // 1. Identity Engine Analysis
    const identity = identityService.analyzeProfile(rawProfile);

    // 2. Goal Understanding Engine Analysis
    const goal = goalService.parseGoal(rawGoal);

    // 3. Skill Gap Engine Analysis
    const skillGap = skillGapService.analyzeSkillGap(identity.normalizedProfile.skills, goal.title);

    // 4. Generate Core Strategic Scenarios via Engine Services
    const strategies: Array<'Aggressive' | 'Balanced' | 'Conservative'> = ['Aggressive', 'Balanced', 'Conservative'];

    const scenarios: Scenario[] = strategies.map((strategy, idx) => {
      const risk = riskService.calculateRisk(strategy, identity.normalizedProfile, goal.targetBudget);
      const opportunity = opportunityService.calculateOpportunity(strategy, goal.category);

      let goalFitScore = 85;
      if (strategy === 'Balanced') goalFitScore = 94;
      if (strategy === 'Aggressive') goalFitScore = 88;
      if (strategy === 'Conservative') goalFitScore = 76;

      const decision = decisionService.evaluateScenario(goalFitScore, risk, opportunity);
      const strategyConfig = FDF_CONFIG.STRATEGY_MULTIPLIERS[strategy];

      return {
        id: `scen-${idx + 1}`,
        title: strategy === 'Aggressive'
          ? 'Aggressive Fast-Track Path'
          : strategy === 'Balanced'
            ? 'Balanced Parallel Transition'
            : 'Conservative Foundation-First Route',
        tagline: strategy === 'Aggressive'
          ? 'High speed, maximum growth, rapid execution.'
          : strategy === 'Balanced'
            ? 'Step-by-step progress while keeping existing income safe.'
            : 'Prioritizes maximum safety buffers and education first.',
        strategyType: strategy,
        summary: `${strategy} strategy tailored for ${goal.title}. Focuses on ${
          strategy === 'Aggressive'
            ? 'rapid milestone execution and high networking'
            : strategy === 'Balanced'
              ? 'consistent weekly focus blocks without current job disruption'
              : 'foundational upskilling and emergency buffer building'
        }.`,
        fdfScores: {
          goalScore: goalFitScore,
          riskScore: risk.overallRiskScore,
          opportunityScore: opportunity.overallOpportunityScore,
          decisionScore: decision.decisionScore,
          confidenceLevel: decision.confidenceLevel,
          confidenceReasoning: decision.reasoning,
          assumptions: decision.assumptions,
          tradeOffs: decision.tradeOffs,
          riskBreakdown: risk,
          opportunityBreakdown: opportunity,
          skillGapAnalysis: skillGap,
          explainability: decision.explainability
        },
        advantages: strategy === 'Aggressive'
          ? ['Maximum immediate leverage and title progression', 'Fastest milestone achievement', 'Steep learning curve']
          : strategy === 'Balanced'
            ? ['Zero risk of income loss', 'High emotional stability', 'Steady skill validation']
            : ['Lowest financial downside risk', 'Builds strong safety buffer', 'Comprehensive foundational knowledge'],
        disadvantages: strategy === 'Aggressive'
          ? ['Higher personal stress', 'Upfront time/capital investment']
          : strategy === 'Balanced'
            ? ['Slower momentum than full immersion']
            : ['Longer timeline to reach main target'],
        risks: risk.reasons,
        opportunities: [
          `Income scaling potential: ${opportunity.incomePotential}/100`,
          `Domain demand factor: ${opportunity.futureDemand}/100`
        ],
        estimatedTimeline: strategyConfig.defaultTimeline,
        skillGap: skillGap.criticalSkills,
        budgetEstimate: strategyConfig.defaultBudget,
        suggestedNextSteps: [
          `Lock ${identity.weeklyCapacityHours} hrs/week for core goal execution`,
          `Focus first on mastering ${skillGap.criticalSkills[0] || 'domain fundamentals'}`,
          'Draft initial milestone roadmap checkpoint'
        ]
      };
    });

    // 5. Roadmap Engine Generation
    const roadmap = roadmapService.generateRoadmap(goal.title, 'Balanced');

    // 6. Report Engine Construction
    const fullReport = reportService.buildReport(identity.normalizedProfile, goal, scenarios, roadmap);

    const executionTimeMs = Date.now() - startTime;

    return {
      id: `sim-${Date.now()}`,
      createdAt: new Date().toISOString(),
      goalCategory: goal.category,
      goalDetails: goal,
      disclaimer: FDF_CONFIG.SYSTEM.DISCLAIMER,
      overallAnalysis: `FDF AI Orchestrator evaluated "${goal.title}" across 3 strategic pathways. Identity capacity (${identity.weeklyCapacityHours} hrs/wk) aligned with Balanced parallel transition for optimal risk-adjusted growth.`,
      recommendedOptionIndex: 1, // Balanced pathway
      scenarios,
      roadmap,
      fullReport,
      followUpAnswers
    };
  }
}

export const aiOrchestrator = new AiOrchestrator();
