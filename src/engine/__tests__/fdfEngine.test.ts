import { describe, it, expect } from 'vitest';
import { identityService } from '../services/identity.service';
import { goalService } from '../services/goal.service';
import { skillGapService } from '../services/skillGap.service';
import { riskService } from '../services/risk.service';
import { opportunityService } from '../services/opportunity.service';
import { decisionService } from '../services/decision.service';
import { aiOrchestrator } from '../orchestrator/aiOrchestrator';
import { validateSimulationRequest } from '../../utils/validation';

describe('Future Decision Framework (FDF) Engine Test Suite', () => {
  const sampleProfile = {
    name: 'Aarav Sharma',
    age: 28,
    education: 'B.Tech Computer Science',
    skills: ['React', 'Node.js', 'TypeScript', 'SQL'],
    experience: '4 years as Senior Frontend Engineer',
    income: '₹18,00,000 / year',
    city: 'Bengaluru',
    availableTime: '15 hours / week',
    riskTolerance: 'Moderate' as const,
    goalsSummary: 'Pivot to AI Product Manager'
  };

  const sampleGoal = {
    category: 'Career' as const,
    title: 'AI Product Manager Transition',
    description: 'Transition from Senior Engineer to AI PM at a growth-stage SaaS startup in Bengaluru.',
    targetTimeframe: '6–12 Months',
    targetBudget: '₹1,00,000',
    keyPriority: 'Maximizing Growth & Income Potential'
  };

  it('Identity Service normalizes user profile correctly', () => {
    const analysis = identityService.analyzeProfile(sampleProfile);
    expect(analysis.weeklyCapacityHours).toBe(15);
    expect(analysis.riskCapacityMultiplier).toBe(1.0);
    expect(analysis.profileCompleteness).toBeGreaterThan(80);
    expect(analysis.currencySymbol).toBe('₹');
  });

  it('Goal Service parses and injects default required skills and criteria', () => {
    const goal = goalService.parseGoal(sampleGoal);
    expect(goal.title).toBe('AI Product Manager Transition');
    expect(goal.requiredSkills.length).toBeGreaterThan(0);
    expect(goal.dependencies.length).toBeGreaterThan(0);
    expect(goal.successCriteria.length).toBeGreaterThan(0);
  });

  it('Skill Gap Service calculates missing skills and effort hours', () => {
    const skillGap = skillGapService.analyzeSkillGap(sampleProfile.skills, sampleGoal.title);
    expect(skillGap.missingSkills.length).toBeGreaterThan(0);
    expect(skillGap.estimatedEffortHours).toBeGreaterThan(0);
    expect(skillGap.explainability).toBeDefined();
    expect(skillGap.explainability?.formula).toContain('SkillMatchScore');
  });

  it('Risk Service computes deterministic risk scores with explainability', () => {
    const risk = riskService.calculateRisk('Balanced', sampleProfile, '₹1,00,000');
    expect(risk.overallRiskScore).toBeGreaterThanOrEqual(0);
    expect(risk.overallRiskScore).toBeLessThanOrEqual(100);
    expect(risk.riskLevel).toBeDefined();
    expect(risk.explainability).toBeDefined();
    expect(risk.explainability?.formula).toBeDefined();
  });

  it('Opportunity Service calculates growth and income potential', () => {
    const opportunity = opportunityService.calculateOpportunity('Aggressive', 'Career');
    expect(opportunity.overallOpportunityScore).toBeGreaterThan(0);
    expect(opportunity.incomePotential).toBeGreaterThan(0);
    expect(opportunity.explainability).toBeDefined();
  });

  it('Decision Service evaluates scenarios using mathematical weighted formulas', () => {
    const risk = riskService.calculateRisk('Balanced', sampleProfile);
    const opportunity = opportunityService.calculateOpportunity('Balanced', 'Career');
    const decision = decisionService.evaluateScenario(90, risk, opportunity);

    expect(decision.decisionScore).toBeGreaterThanOrEqual(0);
    expect(decision.decisionScore).toBeLessThanOrEqual(100);
    expect(decision.confidenceLevel).toBeDefined();
    expect(decision.tradeOffs.length).toBeGreaterThan(0);
    expect(decision.explainability.weightingBreakdown).toBeDefined();
  });

  it('AI Orchestrator produces full simulation payload with required keys', async () => {
    const simulation = await aiOrchestrator.simulate(sampleProfile, sampleGoal);
    expect(simulation.disclaimer).toContain('scenario-based decision support system');
    expect(simulation.scenarios.length).toBe(3);
    expect(simulation.roadmap.length).toBeGreaterThan(0);
    expect(simulation.fullReport).toBeDefined();
    expect(simulation.fullReport?.riskAnalysis).toBeDefined();
  });

  it('Validation utility enforces schema constraints strictly', () => {
    const validResult = validateSimulationRequest({
      userProfile: sampleProfile,
      goalCategory: 'Career',
      goalDetails: sampleGoal
    });
    expect(validResult.isValid).toBe(true);

    const invalidResult = validateSimulationRequest({
      userProfile: { age: 10 },
      goalCategory: 'InvalidCategory'
    });
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.errors.length).toBeGreaterThan(0);
  });
});
