import { RiskBreakdown, OpportunityBreakdown, ConfidenceLevel } from '../../types';
import { FDF_CONFIG } from '../../config/fdfConfig';

export interface DecisionEvaluation {
  decisionScore: number;
  confidenceLevel: ConfidenceLevel;
  reasoning: string;
  assumptions: string[];
  tradeOffs: string[];
  explainability: {
    score: number;
    formula: string;
    weightingBreakdown: Record<string, number>;
    keyDrivers: string[];
    penaltiesOrBoosts: string[];
    summary: string;
  };
}

export class DecisionService {
  public evaluateScenario(
    goalFit: number,
    risk: RiskBreakdown,
    opportunity: OpportunityBreakdown
  ): DecisionEvaluation {
    const weights = FDF_CONFIG.FORMULAS.DECISION;

    const goalFitComponent = goalFit * weights.GOAL_FIT_WEIGHT;
    const opportunityComponent = opportunity.overallOpportunityScore * weights.OPPORTUNITY_WEIGHT;
    const riskPenaltyComponent = risk.overallRiskScore * weights.RISK_PENALTY_WEIGHT;

    const rawScore = goalFitComponent + opportunityComponent - riskPenaltyComponent;
    const decisionScore = Math.max(0, Math.min(100, Math.round(rawScore + 15))); // Normalized positive range

    let confidenceLevel: ConfidenceLevel = 'High';
    if (risk.overallRiskScore > FDF_CONFIG.CONFIDENCE_THRESHOLDS.MEDIUM_RISK_MAX) {
      confidenceLevel = 'Low';
    } else if (risk.overallRiskScore > FDF_CONFIG.CONFIDENCE_THRESHOLDS.HIGH_RISK_MAX) {
      confidenceLevel = 'Medium';
    }

    const reasoning = `Decision score of ${decisionScore}/100 combines goal alignment (${goalFit}/100, +${Math.round(goalFitComponent)} pts) and upside (${opportunity.overallOpportunityScore}/100, +${Math.round(opportunityComponent)} pts) with a risk deduction (-${Math.round(riskPenaltyComponent)} pts).`;

    const assumptions = [
      'Weekly time commitment remains consistent at planned capacity',
      'Target market demand and domain dynamics remain stable over timeframe',
      'No sudden external emergency requiring complete liquidity preservation'
    ];

    const tradeOffs = [
      'Allocating personal leisure time for structured goal execution',
      'Short-term opportunity cost versus long-term skill & income leverage'
    ];

    return {
      decisionScore,
      confidenceLevel,
      reasoning,
      assumptions,
      tradeOffs,
      explainability: {
        score: decisionScore,
        formula: weights.EXPRESSION,
        weightingBreakdown: {
          goalFitWeighted: Math.round(goalFitComponent),
          opportunityWeighted: Math.round(opportunityComponent),
          riskPenaltyDeduction: -Math.round(riskPenaltyComponent)
        },
        keyDrivers: [
          `Goal Alignment: ${goalFit}/100`,
          `Opportunity Score: ${opportunity.overallOpportunityScore}/100`
        ],
        penaltiesOrBoosts: [
          `Risk Penalty Deducted: -${Math.round(riskPenaltyComponent)} pts`
        ],
        summary: reasoning
      }
    };
  }
}

export const decisionService = new DecisionService();
