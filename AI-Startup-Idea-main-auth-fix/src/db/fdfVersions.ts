import { db } from './index.ts';
import { fdfVersions } from './schema.ts';
import { eq, desc } from 'drizzle-orm';
import { FDF_CONFIG } from '../config/fdfConfig';

export interface FdfVersionRecord {
  id: number;
  version: string;
  name: string;
  description: string;
  config: any;
  createdAt: string;
}

export async function saveFdfVersionToDb(
  version: string,
  name: string,
  description: string,
  config: any
): Promise<FdfVersionRecord> {
  try {
    const inserted = await db.insert(fdfVersions).values({
      version,
      name,
      description,
      config
    }).onConflictDoUpdate({
      target: fdfVersions.version,
      set: {
        name,
        description,
        config
      }
    }).returning();

    const record = inserted[0];
    return {
      id: record.id,
      version: record.version,
      name: record.name,
      description: record.description || '',
      config: record.config,
      createdAt: record.createdAt ? record.createdAt.toISOString() : new Date().toISOString()
    };
  } catch (error) {
    console.error('saveFdfVersionToDb error:', error);
    throw new Error('Failed to save FDF version to PostgreSQL', { cause: error });
  }
}

export async function getLatestFdfVersionFromDb(): Promise<FdfVersionRecord | null> {
  try {
    const results = await db.select().from(fdfVersions).orderBy(desc(fdfVersions.id)).limit(1);
    if (results.length === 0) return null;
    const record = results[0];
    return {
      id: record.id,
      version: record.version,
      name: record.name,
      description: record.description || '',
      config: record.config,
      createdAt: record.createdAt ? record.createdAt.toISOString() : new Date().toISOString()
    };
  } catch (error) {
    console.error('getLatestFdfVersionFromDb error:', error);
    return null;
  }
}

export async function getAllFdfVersionsFromDb(): Promise<FdfVersionRecord[]> {
  try {
    const results = await db.select().from(fdfVersions).orderBy(desc(fdfVersions.id));
    return results.map((record) => ({
      id: record.id,
      version: record.version,
      name: record.name,
      description: record.description || '',
      config: record.config,
      createdAt: record.createdAt ? record.createdAt.toISOString() : new Date().toISOString()
    }));
  } catch (error) {
    console.error('getAllFdfVersionsFromDb error:', error);
    return [];
  }
}

export async function ensureDefaultFdfVersionInDb() {
  try {
    const latest = await getLatestFdfVersionFromDb();
    if (!latest) {
      await saveFdfVersionToDb(
        FDF_CONFIG.SYSTEM.VERSION,
        FDF_CONFIG.SYSTEM.NAME,
        'Initial production release of Future Decision Framework scoring algorithms and parameters',
        FDF_CONFIG
      );
    }
  } catch (err) {
    console.warn('Could not seed default FDF version in DB:', err);
  }
}
