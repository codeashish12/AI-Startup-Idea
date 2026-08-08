/**
 * FUTURE DECISION FRAMEWORK (FDF) CONFIGURATION
 * Production-ready SaaS configuration file for FDF Engine parameters, formula weights,
 * risk thresholds, currency standards, and AI orchestrator settings.
 */

export const FDF_CONFIG = {
  SYSTEM: {
    NAME: 'Future Decision Framework Engine',
    VERSION: 'FDF-v2.5-PRO',
    DISCLAIMER: 'This is a scenario-based decision support system. It does not predict the future.',
    CURRENCY: {
      CODE: 'INR',
      SYMBOL: '₹',
      FORMAT: 'Indian Rupees'
    }
  },

  FORMULAS: {
    RISK: {
      FINANCIAL_WEIGHT: 0.25,
      TIME_WEIGHT: 0.15,
      EXECUTION_WEIGHT: 0.20,
      COMPETITION_WEIGHT: 0.10,
      TECHNOLOGY_WEIGHT: 0.10,
      LEARNING_WEIGHT: 0.10,
      MARKET_WEIGHT: 0.10,
      EXPRESSION: 'RiskScore = (Fin*0.25) + (Time*0.15) + (Exec*0.20) + (Comp*0.10) + (Tech*0.10) + (Learn*0.10) + (Mkt*0.10)'
    },
    OPPORTUNITY: {
      INCOME_WEIGHT: 0.25,
      GROWTH_WEIGHT: 0.20,
      LEARNING_WEIGHT: 0.15,
      FREEDOM_WEIGHT: 0.15,
      DEMAND_WEIGHT: 0.15,
      NETWORKING_WEIGHT: 0.10,
      EXPRESSION: 'OppScore = (Income*0.25) + (Growth*0.20) + (Learn*0.15) + (Freedom*0.15) + (Demand*0.15) + (Network*0.10)'
    },
    DECISION: {
      GOAL_FIT_WEIGHT: 0.35,
      OPPORTUNITY_WEIGHT: 0.35,
      RISK_PENALTY_WEIGHT: 0.30,
      EXPRESSION: 'DecisionScore = (GoalFit * 0.35) + (Opportunity * 0.35) - (Risk * 0.30)'
    }
  },

  STRATEGY_MULTIPLIERS: {
    Aggressive: {
      baseRiskMultiplier: 1.6,
      opportunityMultiplier: 1.35,
      defaultTimeline: '3–6 Months',
      defaultBudget: '₹1,50,000 – ₹3,50,000'
    },
    Balanced: {
      baseRiskMultiplier: 0.9,
      opportunityMultiplier: 1.05,
      defaultTimeline: '6–12 Months',
      defaultBudget: '₹40,000 – ₹1,00,000'
    },
    Conservative: {
      baseRiskMultiplier: 0.55,
      opportunityMultiplier: 0.8,
      defaultTimeline: '12–18 Months',
      defaultBudget: '₹10,000 – ₹30,000'
    }
  },

  RISK_THRESHOLDS: {
    LOW_MAX: 30,
    MODERATE_MAX: 55,
    HIGH_MAX: 75,
    // >75 is Extreme
  },

  CONFIDENCE_THRESHOLDS: {
    HIGH_RISK_MAX: 65,
    MEDIUM_RISK_MAX: 80,
  },

  AI_ORCHESTRATOR: {
    PRIMARY_MODEL: 'gemini-2.5-flash',
    FALLBACK_MODEL: 'gemini-2.5-flash',
    TIMEOUT_MS: 12000,
    TEMPERATURE: 0.7,
    CACHE_TTL_MS: 300000 // 5 minutes cache
  }
} as const;

export type FdfConfig = typeof FDF_CONFIG;
