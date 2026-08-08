import { ScoreExplainability, RiskBreakdown, OpportunityBreakdown, ConfidenceLevel } from '../../types';
import { FDF_CONFIG } from '../../config/fdfConfig';

export interface DecisionExplanation extends ScoreExplainability {
  goalScore: number;
  riskScore: number;
  opportunityScore: number;
  confidenceLevel: ConfidenceLevel;
  confidenceScore: number; // 0-100 score
  breakdownComponents: {
    goalScoreContribution: number;
    opportunityScoreContribution: number;
    riskScorePenalty: number;
    baseOffset: number;
  };
  componentExplanations: {
    goalScoreAnalysis: string;
    riskScoreAnalysis: string;
    opportunityScoreAnalysis: string;
    confidenceAnalysis: string;
  };
}

export class ExplainabilityService {
  /**
   * Explains every Decision Score using Goal Score, Risk Score, Opportunity Score, and Confidence Level.
   * Provides deterministic math breakdowns, key drivers, penalty/boost matrices, and human-readable narratives.
   */
  public explainDecision(
    goalScore: number,
    risk: RiskBreakdown,
    opportunity: OpportunityBreakdown,
    confidenceLevel: ConfidenceLevel,
    calculatedDecisionScore: number
  ): DecisionExplanation {
    const weights = FDF_CONFIG.FORMULAS.DECISION;

    const goalScoreContribution = Math.round(goalScore * weights.GOAL_FIT_WEIGHT);
    const opportunityScoreContribution = Math.round(opportunity.overallOpportunityScore * weights.OPPORTUNITY_WEIGHT);
    const riskScorePenalty = Math.round(risk.overallRiskScore * weights.RISK_PENALTY_WEIGHT);
    const baseOffset = 15;

    // Calculate a deterministic confidence score metric (0-100)
    let confidenceScore = Math.max(10, Math.min(100, Math.round(100 - (risk.overallRiskScore * 0.6) + (goalScore * 0.2))));
    if (confidenceLevel === 'Low') confidenceScore = Math.min(confidenceScore, 45);
    else if (confidenceLevel === 'Medium') confidenceScore = Math.min(Math.max(confidenceScore, 50), 75);
    else confidenceScore = Math.max(confidenceScore, 80);

    // Goal score analysis
    let goalScoreAnalysis = `Goal Alignment Score is ${goalScore}/100. `;
    if (goalScore >= 85) {
      goalScoreAnalysis += `Demonstrates exceptional synergy with targeted objective, contributing +${goalScoreContribution} points.`;
    } else if (goalScore >= 70) {
      goalScoreAnalysis += `Reflects moderate alignment with user capabilities, adding +${goalScoreContribution} points.`;
    } else {
      goalScoreAnalysis += `Indicates capability gap or tight timeline constraint, contributing +${goalScoreContribution} points.`;
    }

    // Risk score analysis
    let riskScoreAnalysis = `Overall Risk Score is ${risk.overallRiskScore}/100 (${risk.riskLevel} Risk). `;
    riskScoreAnalysis += `Deducts -${riskScorePenalty} points from decision score based on a ${Math.round(weights.RISK_PENALTY_WEIGHT * 100)}% penalty weight. `;
    if (risk.reasons && risk.reasons.length > 0) {
      riskScoreAnalysis += `Primary risk factor: ${risk.reasons[0]}.`;
    }

    // Opportunity score analysis
    let opportunityScoreAnalysis = `Opportunity Upside Score is ${opportunity.overallOpportunityScore}/100. `;
    opportunityScoreAnalysis += `Contributes +${opportunityScoreContribution} points based on upside weight of ${Math.round(weights.OPPORTUNITY_WEIGHT * 100)}%. `;
    opportunityScoreAnalysis += `Key drivers: Income Potential (${opportunity.incomePotential}/100) & Growth Potential (${opportunity.growthPotential}/100).`;

    // Confidence analysis
    let confidenceAnalysis = `Confidence Level is rated as ${confidenceLevel} (${confidenceScore}/100 certainty metric). `;
    if (confidenceLevel === 'High') {
      confidenceAnalysis += `Risk parameters remain within safe operational bounds with strong execution certainty.`;
    } else if (confidenceLevel === 'Medium') {
      confidenceAnalysis += `Moderate uncertainty regarding timeline or external market factors requires active mitigation.`;
    } else {
      confidenceAnalysis += `Elevated risk concentration or tight resource buffers reduce execution predictability.`;
    }

    const keyDrivers = [
      `Goal Score Contribution: +${goalScoreContribution} pts (${goalScore}/100 at 35% weight)`,
      `Opportunity Upside Contribution: +${opportunityScoreContribution} pts (${opportunity.overallOpportunityScore}/100 at 35% weight)`,
      `Confidence Index: ${confidenceLevel} (${confidenceScore}/100 certainty metric)`
    ];

    const penaltiesOrBoosts = [
      `Risk Deduction Penalty: -${riskScorePenalty} pts (${risk.overallRiskScore}/100 risk at 30% penalty weight)`,
      `Normalized Positive Base Offset: +${baseOffset} pts`
    ];

    const summary = `Decision Score of ${calculatedDecisionScore}/100 is derived from Goal Alignment (+${goalScoreContribution} pts) and Opportunity Upside (+${opportunityScoreContribution} pts), balanced against a Risk Deduction (-${riskScorePenalty} pts) with a ${confidenceLevel} confidence rating (${confidenceScore}% certainty).`;

    return {
      score: calculatedDecisionScore,
      formula: weights.EXPRESSION,
      goalScore,
      riskScore: risk.overallRiskScore,
      opportunityScore: opportunity.overallOpportunityScore,
      confidenceLevel,
      confidenceScore,
      weightingBreakdown: {
        goalScoreContribution,
        opportunityScoreContribution,
        riskScorePenalty: -riskScorePenalty,
        baseOffset
      },
      breakdownComponents: {
        goalScoreContribution,
        opportunityScoreContribution,
        riskScorePenalty,
        baseOffset
      },
      componentExplanations: {
        goalScoreAnalysis,
        riskScoreAnalysis,
        opportunityScoreAnalysis,
        confidenceAnalysis
      },
      keyDrivers,
      penaltiesOrBoosts,
      summary
    };
  }
}

export const explainabilityService = new ExplainabilityService();
