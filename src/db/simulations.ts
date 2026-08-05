import { db } from './index.ts';
import { simulations } from './schema.ts';
import { eq, desc } from 'drizzle-orm';
import { SavedSimulationRecord } from '../server/simulationRepository';
import { SimulationResult, UserProfile, GoalDetails } from '../types';
import { getOrCreateDbUser } from './users.ts';

export async function saveSimulationToDb(
  userId: string,
  simulation: SimulationResult,
  userProfile?: UserProfile,
  goalDetails?: GoalDetails
): Promise<SavedSimulationRecord> {
  try {
    // Ensure user exists in db
    await getOrCreateDbUser(userId, `${userId}@futureengine.ai`, 'User');

    const inserted = await db.insert(simulations).values({
      id: simulation.id,
      userId,
      goalCategory: simulation.goalCategory,
      goalTitle: simulation.goalDetails.title,
      goalDetails: goalDetails || simulation.goalDetails,
      userProfile: userProfile || null,
      simulationResult: simulation
    }).onConflictDoUpdate({
      target: simulations.id,
      set: {
        simulationResult: simulation,
        goalCategory: simulation.goalCategory,
        goalTitle: simulation.goalDetails.title
      }
    }).returning();

    const record = inserted[0];
    return {
      id: record.id,
      userId: record.userId,
      goalCategory: record.goalCategory,
      goalTitle: record.goalTitle,
      simulation: record.simulationResult as SimulationResult,
      createdAt: record.createdAt ? record.createdAt.toISOString() : new Date().toISOString()
    };
  } catch (error) {
    console.error('saveSimulationToDb error:', error);
    throw new Error('Failed to save simulation to PostgreSQL', { cause: error });
  }
}

export async function getSimulationFromDbById(id: string): Promise<SavedSimulationRecord | null> {
  try {
    const result = await db.select().from(simulations).where(eq(simulations.id, id)).limit(1);
    if (result.length === 0) return null;
    const record = result[0];
    return {
      id: record.id,
      userId: record.userId,
      goalCategory: record.goalCategory,
      goalTitle: record.goalTitle,
      simulation: record.simulationResult as SimulationResult,
      createdAt: record.createdAt ? record.createdAt.toISOString() : new Date().toISOString()
    };
  } catch (error) {
    console.error('getSimulationFromDbById error:', error);
    return null;
  }
}

export async function getSimulationsFromDbByUserId(userId: string): Promise<SavedSimulationRecord[]> {
  try {
    const records = await db
      .select()
      .from(simulations)
      .where(eq(simulations.userId, userId))
      .orderBy(desc(simulations.createdAt));

    return records.map((record) => ({
      id: record.id,
      userId: record.userId,
      goalCategory: record.goalCategory,
      goalTitle: record.goalTitle,
      simulation: record.simulationResult as SimulationResult,
      createdAt: record.createdAt ? record.createdAt.toISOString() : new Date().toISOString()
    }));
  } catch (error) {
    console.error('getSimulationsFromDbByUserId error:', error);
    return [];
  }
}
