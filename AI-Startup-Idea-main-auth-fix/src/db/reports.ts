import { db } from './index.ts';
import { reports } from './schema.ts';
import { eq, desc } from 'drizzle-orm';
import { FdfFullReport } from '../types';
import { getOrCreateDbUser } from './users.ts';

export async function saveReportToDb(
  userId: string,
  goalTitle: string,
  reportData: FdfFullReport,
  simulationId?: string
) {
  try {
    await getOrCreateDbUser(userId, `${userId}@futureengine.ai`, 'User');

    const inserted = await db.insert(reports).values({
      userId,
      simulationId: simulationId || null,
      goalTitle,
      reportData
    }).returning();

    const record = inserted[0];
    return {
      id: record.id,
      userId: record.userId,
      simulationId: record.simulationId,
      goalTitle: record.goalTitle,
      reportData: record.reportData as FdfFullReport,
      createdAt: record.createdAt ? record.createdAt.toISOString() : new Date().toISOString()
    };
  } catch (error) {
    console.error('saveReportToDb error:', error);
    throw new Error('Failed to save report to PostgreSQL', { cause: error });
  }
}

export async function getReportsFromDbByUserId(userId: string) {
  try {
    const results = await db
      .select()
      .from(reports)
      .where(eq(reports.userId, userId))
      .orderBy(desc(reports.createdAt));

    return results.map((record) => ({
      id: record.id,
      userId: record.userId,
      simulationId: record.simulationId,
      goalTitle: record.goalTitle,
      reportData: record.reportData as FdfFullReport,
      createdAt: record.createdAt ? record.createdAt.toISOString() : new Date().toISOString()
    }));
  } catch (error) {
    console.error('getReportsFromDbByUserId error:', error);
    return [];
  }
}

export async function getReportFromDbById(id: number) {
  try {
    const results = await db.select().from(reports).where(eq(reports.id, id)).limit(1);
    if (results.length === 0) return null;
    const record = results[0];
    return {
      id: record.id,
      userId: record.userId,
      simulationId: record.simulationId,
      goalTitle: record.goalTitle,
      reportData: record.reportData as FdfFullReport,
      createdAt: record.createdAt ? record.createdAt.toISOString() : new Date().toISOString()
    };
  } catch (error) {
    console.error('getReportFromDbById error:', error);
    return null;
  }
}
