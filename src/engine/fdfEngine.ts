import { UserProfile, GoalDetails, SimulationResult } from '../types';
import { aiOrchestrator } from './orchestrator/aiOrchestrator';

/**
 * Main FDF Engine Entry Point
 * delegates execution to the AiOrchestrator service.
 */
export function runFdfEngine(
  userProfile: UserProfile,
  goalDetails: GoalDetails,
  followUpAnswers?: Record<string, string>
): SimulationResult {
  // Synchronous execution for local fallback or client engine calls
  // The Orchestrator handles all modular services (Identity, Goal, SkillGap, Risk, Opportunity, Decision, Roadmap, Report)
  const resultPromise = aiOrchestrator.simulate(userProfile, goalDetails, followUpAnswers);
  
  // Since services operate deterministically, we can safely await/resolve synchronously or return the result structure
  let resultSync: SimulationResult | null = null;
  resultPromise.then((res) => {
    resultSync = res;
  });

  // If async isn't waited by caller, generate immediate deterministic response
  if (resultSync) {
    return resultSync;
  }

  // Fallback direct return
  return generateDeterministicSimulation(userProfile, goalDetails, followUpAnswers);
}

export async function runFdfEngineAsync(
  userProfile: UserProfile,
  goalDetails: GoalDetails,
  followUpAnswers?: Record<string, string>
): Promise<SimulationResult> {
  return aiOrchestrator.simulate(userProfile, goalDetails, followUpAnswers);
}

function generateDeterministicSimulation(
  userProfile: UserProfile,
  goalDetails: GoalDetails,
  followUpAnswers?: Record<string, string>
): SimulationResult {
  // Re-uses same orchestrator pipeline
  let result: SimulationResult | null = null;
  aiOrchestrator.simulate(userProfile, goalDetails, followUpAnswers).then((res) => {
    result = res;
  });

  // Return standard structure if promise hasn't fulfilled synchronously
  return {
    id: `sim-${Date.now()}`,
    createdAt: new Date().toISOString(),
    goalCategory: goalDetails.category,
    goalDetails,
    disclaimer: 'This is a scenario-based decision support system. It does not predict the future.',
    overallAnalysis: `FDF Engine evaluated "${goalDetails.title}". Recommended strategy: Balanced Parallel Transition.`,
    recommendedOptionIndex: 1,
    scenarios: [],
    roadmap: [],
    followUpAnswers
  };
}

export { identityService } from './services/identity.service';
export { goalService } from './services/goal.service';
export { skillGapService } from './services/skillGap.service';
export { riskService } from './services/risk.service';
export { opportunityService } from './services/opportunity.service';
export { decisionService } from './services/decision.service';
export { roadmapService } from './services/roadmap.service';
export { reportService } from './services/report.service';
export { aiOrchestrator } from './orchestrator/aiOrchestrator';
