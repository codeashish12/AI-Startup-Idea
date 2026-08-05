import { SimulationResult } from '../types';

export interface SavedSimulationRecord {
  id: string;
  userId: string;
  goalCategory: string;
  goalTitle: string;
  simulation: SimulationResult;
  createdAt: string;
}

export class SimulationRepository {
  private simulations: Map<string, SavedSimulationRecord> = new Map();
  private userSimulationsMap: Map<string, string[]> = new Map(); // userId -> simulationIds
  private cache: Map<string, { data: any; expiresAt: number }> = new Map();

  /**
   * Save simulation result
   */
  public saveSimulation(userId: string, simulation: SimulationResult): SavedSimulationRecord {
    const record: SavedSimulationRecord = {
      id: simulation.id,
      userId,
      goalCategory: simulation.goalCategory,
      goalTitle: simulation.goalDetails.title,
      simulation,
      createdAt: simulation.createdAt || new Date().toISOString()
    };

    this.simulations.set(simulation.id, record);

    const userList = this.userSimulationsMap.get(userId) || [];
    userList.unshift(simulation.id);
    this.userSimulationsMap.set(userId, userList);

    // Evict old cache for user dashboard
    this.cache.delete(`dashboard:${userId}`);

    return record;
  }

  /**
   * Get simulation by ID
   */
  public getById(id: string): SavedSimulationRecord | undefined {
    return this.simulations.get(id);
  }

  /**
   * Get all simulations for user
   */
  public getByUserId(userId: string): SavedSimulationRecord[] {
    const ids = this.userSimulationsMap.get(userId) || [];
    return ids.map((id) => this.simulations.get(id)!).filter(Boolean);
  }

  /**
   * Dashboard statistics summary
   */
  public getDashboardSummary(userId: string) {
    const cacheKey = `dashboard:${userId}`;
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    const userSims = this.getByUserId(userId);
    const totalSimulations = userSims.length;

    const categoryCounts: Record<string, number> = {};
    let highRiskCount = 0;
    let moderateRiskCount = 0;
    let lowRiskCount = 0;

    userSims.forEach((record) => {
      categoryCounts[record.goalCategory] = (categoryCounts[record.goalCategory] || 0) + 1;
      const recommended = record.simulation.scenarios[record.simulation.recommendedOptionIndex || 1];
      const riskLevel = recommended?.fdfScores?.riskBreakdown?.riskLevel || 'Moderate';
      if (riskLevel === 'High' || riskLevel === 'Extreme') highRiskCount++;
      else if (riskLevel === 'Low') lowRiskCount++;
      else moderateRiskCount++;
    });

    const summary = {
      totalSimulations,
      categoryBreakdown: categoryCounts,
      riskDistribution: {
        lowRisk: lowRiskCount,
        moderateRisk: moderateRiskCount,
        highRisk: highRiskCount
      },
      recentSimulations: userSims.slice(0, 5).map((s) => ({
        id: s.id,
        goalTitle: s.goalTitle,
        category: s.goalCategory,
        createdAt: s.createdAt,
        recommendedStrategy: s.simulation.scenarios[s.simulation.recommendedOptionIndex || 1]?.title || 'Balanced Transition'
      }))
    };

    this.cache.set(cacheKey, { data: summary, expiresAt: Date.now() + 60000 }); // 1 min cache
    return summary;
  }
}

export const simulationRepository = new SimulationRepository();
