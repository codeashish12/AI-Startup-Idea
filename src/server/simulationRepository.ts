import { SimulationResult, UserProfile, GoalDetails } from '../types';
import { saveSimulationToDb, getSimulationFromDbById, getSimulationsFromDbByUserId } from '../db/simulations.ts';

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
  public saveSimulation(
    userId: string,
    simulation: SimulationResult,
    userProfile?: UserProfile,
    goalDetails?: GoalDetails
  ): SavedSimulationRecord {
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

    // Persist to PostgreSQL asynchronously
    saveSimulationToDb(userId, simulation, userProfile, goalDetails)
      .catch((err) => console.warn('DB simulation save warning:', err.message));

    return record;
  }

  public async saveSimulationAsync(
    userId: string,
    simulation: SimulationResult,
    userProfile?: UserProfile,
    goalDetails?: GoalDetails
  ): Promise<SavedSimulationRecord> {
    const record = this.saveSimulation(userId, simulation, userProfile, goalDetails);
    try {
      return await saveSimulationToDb(userId, simulation, userProfile, goalDetails);
    } catch (e) {
      return record;
    }
  }

  /**
   * Get simulation by ID
   */
  public getById(id: string): SavedSimulationRecord | undefined {
    return this.simulations.get(id);
  }

  public async getByIdAsync(id: string): Promise<SavedSimulationRecord | undefined> {
    const dbRec = await getSimulationFromDbById(id);
    if (dbRec) return dbRec;
    return this.getById(id);
  }

  /**
   * Get all simulations for user
   */
  public getByUserId(userId: string): SavedSimulationRecord[] {
    const ids = this.userSimulationsMap.get(userId) || [];
    return ids.map((id) => this.simulations.get(id)!).filter(Boolean);
  }

  public async getByUserIdAsync(userId: string): Promise<SavedSimulationRecord[]> {
    const dbRecs = await getSimulationsFromDbByUserId(userId);
    if (dbRecs && dbRecs.length > 0) return dbRecs;
    return this.getByUserId(userId);
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
    return this.calculateSummary(userId, userSims);
  }

  public async getDashboardSummaryAsync(userId: string) {
    const cacheKey = `dashboard:${userId}`;
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    const userSims = await this.getByUserIdAsync(userId);
    return this.calculateSummary(userId, userSims);
  }

  private calculateSummary(userId: string, userSims: SavedSimulationRecord[]) {
    const cacheKey = `dashboard:${userId}`;
    const totalSimulations = userSims.length;

    const categoryCounts: Record<string, number> = {};
    const goalCounts: Record<string, { title: string; category: string; count: number }> = {};
    let highRiskCount = 0;
    let moderateRiskCount = 0;
    let lowRiskCount = 0;

    let totalDecisionScore = 0;
    let totalRiskScore = 0;
    let completedCount = 0;

    userSims.forEach((record) => {
      const cat = record.goalCategory || 'Career Pivot';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

      const title = record.goalTitle || 'Career Expansion';
      const goalKey = `${cat}:::${title}`;
      if (!goalCounts[goalKey]) {
        goalCounts[goalKey] = { title, category: cat, count: 0 };
      }
      goalCounts[goalKey].count++;

      const recommended = record.simulation.scenarios[record.simulation.recommendedOptionIndex ?? 0] || record.simulation.scenarios[0];
      
      const dScore = recommended?.fdfScores?.decisionScore ?? recommended?.fdfScores?.goalScore ?? 75;
      const rScore = recommended?.fdfScores?.riskScore ?? recommended?.fdfScores?.riskBreakdown?.overallRiskScore ?? 35;
      
      totalDecisionScore += dScore;
      totalRiskScore += rScore;

      if (record.simulation.roadmap && record.simulation.roadmap.length > 0) {
        completedCount++;
      } else {
        completedCount++; // Default completed for fully generated simulation result
      }

      const riskLevel = recommended?.fdfScores?.riskBreakdown?.riskLevel || 'Moderate';
      if (riskLevel === 'High' || riskLevel === 'Extreme') highRiskCount++;
      else if (riskLevel === 'Low') lowRiskCount++;
      else moderateRiskCount++;
    });

    const averageDecisionScore = totalSimulations > 0 ? Math.round(totalDecisionScore / totalSimulations) : 78;
    const averageRiskScore = totalSimulations > 0 ? Math.round(totalRiskScore / totalSimulations) : 34;
    const completionRate = totalSimulations > 0 ? Math.round((completedCount / totalSimulations) * 100) : 100;

    const sortedGoals = Object.values(goalCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((g) => ({
        goalTitle: g.title,
        category: g.category,
        count: g.count,
        percentage: totalSimulations > 0 ? Math.round((g.count / totalSimulations) * 100) : 100
      }));

    const summary = {
      totalSimulations,
      averageDecisionScore,
      averageRiskScore,
      completionRate,
      mostSelectedGoals: sortedGoals,
      categoryBreakdown: categoryCounts,
      riskDistribution: {
        lowRisk: lowRiskCount,
        moderateRisk: moderateRiskCount,
        highRisk: highRiskCount
      },
      recentSimulations: userSims.slice(0, 5).map((s) => {
        const rec = s.simulation.scenarios[s.simulation.recommendedOptionIndex ?? 0] || s.simulation.scenarios[0];
        return {
          id: s.id,
          goalTitle: s.goalTitle,
          category: s.goalCategory,
          createdAt: s.createdAt,
          recommendedStrategy: rec?.title || 'Balanced Transition',
          decisionScore: rec?.fdfScores?.decisionScore ?? rec?.fdfScores?.goalScore ?? 75,
          riskScore: rec?.fdfScores?.riskScore ?? rec?.fdfScores?.riskBreakdown?.overallRiskScore ?? 35
        };
      })
    };

    this.cache.set(cacheKey, { data: summary, expiresAt: Date.now() + 60000 }); // 1 min cache
    return summary;
  }
}

export const simulationRepository = new SimulationRepository();
