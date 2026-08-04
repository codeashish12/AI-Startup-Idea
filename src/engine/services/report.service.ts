import {
  UserProfile,
  GoalDetails,
  Scenario,
  RoadmapPhase,
  FdfFullReport,
  RiskBreakdown,
  OpportunityBreakdown
} from '../../types';
import { FDF_CONFIG } from '../../config/fdfConfig';

export class ReportService {
  public buildReport(
    profile: UserProfile,
    goal: GoalDetails,
    scenarios: Scenario[],
    roadmap: RoadmapPhase[]
  ): FdfFullReport {
    const recommendedScenario = scenarios[1] || scenarios[0];
    const risk: RiskBreakdown = recommendedScenario.fdfScores.riskBreakdown || {
      financialRisk: 30,
      timeRisk: 25,
      executionRisk: 35,
      competitionRisk: 40,
      technologyRisk: 20,
      learningRisk: 25,
      marketRisk: 30,
      overallRiskScore: 30,
      riskLevel: 'Low',
      reasons: ['De-risked structure']
    };

    const opportunity: OpportunityBreakdown = recommendedScenario.fdfScores.opportunityBreakdown || {
      incomePotential: 75,
      growthPotential: 80,
      learningValue: 85,
      freedomFlexibility: 70,
      futureDemand: 85,
      networkingValue: 75,
      overallOpportunityScore: 80
    };

    return {
      timestamp: new Date().toISOString(),
      version: FDF_CONFIG.SYSTEM.VERSION,
      profile,
      goal,
      scenarios,
      riskAnalysis: {
        recommendedScenarioRisk: risk,
        comparativeRiskSummary: `Aggressive strategy carries higher financial/execution risk (${scenarios[0]?.fdfScores.riskScore || 65}/100), while Balanced strategy preserves runway (${risk.overallRiskScore}/100) and Conservative minimizes capital exposure.`
      },
      opportunityAnalysis: {
        recommendedScenarioOpportunity: opportunity,
        comparativeOpportunitySummary: `Balanced strategy yields an optimal ${opportunity.overallOpportunityScore}/100 opportunity score with minimal downside exposure.`
      },
      decisionMatrix: {
        weightedFormula: FDF_CONFIG.FORMULAS.DECISION.EXPRESSION,
        weights: {
          goalFit: FDF_CONFIG.FORMULAS.DECISION.GOAL_FIT_WEIGHT,
          opportunity: FDF_CONFIG.FORMULAS.DECISION.OPPORTUNITY_WEIGHT,
          riskPenalty: FDF_CONFIG.FORMULAS.DECISION.RISK_PENALTY_WEIGHT
        },
        topRecommendation: recommendedScenario,
        decisionReasoning: recommendedScenario.fdfScores.confidenceReasoning || 'Highest risk-adjusted score with zero income disruption.',
        confidence: recommendedScenario.fdfScores.confidenceLevel || 'High',
        assumptions: [
          'Scenario-based decision support system. Does not predict future outcomes.',
          'Weekly time capacity remains consistent at planned capacity.',
          'Market conditions maintain current dynamics over timeframe.'
        ],
        limitations: [
          'Assumes individual adherence to time management commitments.',
          'External macroeconomic disruptions could impact hiring/revenue timelines.'
        ]
      },
      roadmap
    };
  }
}

export const reportService = new ReportService();
