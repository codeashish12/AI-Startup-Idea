import { OpportunityBreakdown, StrategyType } from '../../types';
import { FDF_CONFIG } from '../../config/fdfConfig';

export class OpportunityService {
  public calculateOpportunity(strategy: StrategyType, goalCategory: string): OpportunityBreakdown {
    const strategyMultiplierConfig = FDF_CONFIG.STRATEGY_MULTIPLIERS[strategy as keyof typeof FDF_CONFIG.STRATEGY_MULTIPLIERS]
      || FDF_CONFIG.STRATEGY_MULTIPLIERS.Balanced;

    const multiplier = strategyMultiplierConfig.opportunityMultiplier;

    const incomePotential = Math.min(100, Math.round(70 * multiplier));
    const growthPotential = Math.min(100, Math.round(75 * multiplier));
    const learningValue = Math.min(100, Math.round(80 * (strategy === 'Conservative' ? 1.1 : 1.0)));
    const freedomFlexibility = Math.min(100, Math.round(65 * multiplier));
    const futureDemand = Math.min(100, Math.round(85));
    const networkingValue = Math.min(100, Math.round(75 * multiplier));

    const weights = FDF_CONFIG.FORMULAS.OPPORTUNITY;

    const overallOpportunityScore = Math.round(
      incomePotential * weights.INCOME_WEIGHT +
      growthPotential * weights.GROWTH_WEIGHT +
      learningValue * weights.LEARNING_WEIGHT +
      freedomFlexibility * weights.FREEDOM_WEIGHT +
      futureDemand * weights.DEMAND_WEIGHT +
      networkingValue * weights.NETWORKING_WEIGHT
    );

    const weightingBreakdown = {
      income: Math.round(incomePotential * weights.INCOME_WEIGHT),
      growth: Math.round(growthPotential * weights.GROWTH_WEIGHT),
      learning: Math.round(learningValue * weights.LEARNING_WEIGHT),
      freedom: Math.round(freedomFlexibility * weights.FREEDOM_WEIGHT),
      demand: Math.round(futureDemand * weights.DEMAND_WEIGHT),
      networking: Math.round(networkingValue * weights.NETWORKING_WEIGHT)
    };

    return {
      incomePotential,
      growthPotential,
      learningValue,
      freedomFlexibility,
      futureDemand,
      networkingValue,
      overallOpportunityScore,
      explainability: {
        score: overallOpportunityScore,
        formula: weights.EXPRESSION,
        weightingBreakdown,
        keyDrivers: [
          `Strategy Type: ${strategy} (Opportunity Multiplier: ${multiplier}x)`,
          `Domain Demand Index: High (${futureDemand}/100)`
        ],
        penaltiesOrBoosts: [
          `Income Potential: ${incomePotential}/100`,
          `Skill Learning Value: ${learningValue}/100`
        ],
        summary: `Opportunity score of ${overallOpportunityScore}/100 based on future demand, career growth trajectory, and income scaling potential.`
      }
    };
  }
}

export const opportunityService = new OpportunityService();
