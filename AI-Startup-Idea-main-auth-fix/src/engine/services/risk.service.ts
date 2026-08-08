import { RiskBreakdown, UserProfile, StrategyType } from '../../types';
import { FDF_CONFIG } from '../../config/fdfConfig';

export class RiskService {
  public calculateRisk(
    strategy: StrategyType,
    userProfile: UserProfile,
    budgetNeeded?: string
  ): RiskBreakdown {
    const strategyMultiplierConfig = FDF_CONFIG.STRATEGY_MULTIPLIERS[strategy as keyof typeof FDF_CONFIG.STRATEGY_MULTIPLIERS] 
      || FDF_CONFIG.STRATEGY_MULTIPLIERS.Balanced;
    
    const baseMultiplier = strategyMultiplierConfig.baseRiskMultiplier;
    const userRiskFactor = userProfile.riskTolerance === 'Low' ? 1.2 : userProfile.riskTolerance === 'High' ? 0.8 : 1.0;

    const financialRisk = Math.min(100, Math.round(35 * baseMultiplier * userRiskFactor));
    const timeRisk = Math.min(100, Math.round(30 * baseMultiplier));
    const executionRisk = Math.min(100, Math.round(40 * baseMultiplier));
    const competitionRisk = Math.min(100, Math.round(45 * (strategy === 'Aggressive' ? 0.7 : 1.1)));
    const technologyRisk = Math.min(100, Math.round(25 * baseMultiplier));
    const learningRisk = Math.min(100, Math.round(30 * baseMultiplier));
    const marketRisk = Math.min(100, Math.round(35 * baseMultiplier));

    const weights = FDF_CONFIG.FORMULAS.RISK;

    const overallRiskScore = Math.round(
      financialRisk * weights.FINANCIAL_WEIGHT +
      timeRisk * weights.TIME_WEIGHT +
      executionRisk * weights.EXECUTION_WEIGHT +
      competitionRisk * weights.COMPETITION_WEIGHT +
      technologyRisk * weights.TECHNOLOGY_WEIGHT +
      learningRisk * weights.LEARNING_WEIGHT +
      marketRisk * weights.MARKET_WEIGHT
    );

    let riskLevel: 'Low' | 'Moderate' | 'High' | 'Extreme' = 'Moderate';
    if (overallRiskScore <= FDF_CONFIG.RISK_THRESHOLDS.LOW_MAX) riskLevel = 'Low';
    else if (overallRiskScore <= FDF_CONFIG.RISK_THRESHOLDS.MODERATE_MAX) riskLevel = 'Moderate';
    else if (overallRiskScore <= FDF_CONFIG.RISK_THRESHOLDS.HIGH_MAX) riskLevel = 'High';
    else riskLevel = 'Extreme';

    const reasons: string[] = [];
    if (financialRisk > 50) reasons.push('High upfront capital or potential income pause required');
    if (executionRisk > 50) reasons.push('Demands strict time discipline alongside existing commitments');
    if (competitionRisk > 50) reasons.push('Competitive sector with active incumbent players');
    if (reasons.length === 0) reasons.push('De-risked execution structure with strong runway protection');

    const weightingBreakdown = {
      financial: Math.round(financialRisk * weights.FINANCIAL_WEIGHT),
      time: Math.round(timeRisk * weights.TIME_WEIGHT),
      execution: Math.round(executionRisk * weights.EXECUTION_WEIGHT),
      competition: Math.round(competitionRisk * weights.COMPETITION_WEIGHT),
      technology: Math.round(technologyRisk * weights.TECHNOLOGY_WEIGHT),
      learning: Math.round(learningRisk * weights.LEARNING_WEIGHT),
      market: Math.round(marketRisk * weights.MARKET_WEIGHT)
    };

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
      reasons,
      explainability: {
        score: overallRiskScore,
        formula: weights.EXPRESSION,
        weightingBreakdown,
        keyDrivers: [
          `Strategy Type: ${strategy} (Multiplier: ${baseMultiplier}x)`,
          `User Risk Tolerance: ${userProfile.riskTolerance} (Factor: ${userRiskFactor}x)`
        ],
        penaltiesOrBoosts: reasons,
        summary: `Risk score of ${overallRiskScore}/100 categorized as ${riskLevel} risk, driven primarily by execution and financial allocation.`
      }
    };
  }
}

export const riskService = new RiskService();
