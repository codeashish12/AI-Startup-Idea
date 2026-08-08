import { db } from './index.ts';
import { users, profiles } from './schema.ts';
import { eq } from 'drizzle-orm';
import { User, Profile } from '../server/authService';

export async function getOrCreateDbUser(uid: string, email: string, name?: string, passwordHash?: string): Promise<User> {
  try {
    const existing = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    if (existing.length > 0) {
      const u = existing[0];
      return {
        id: u.uid,
        email: u.email,
        name: u.name || name || '',
        passwordHash: u.passwordHash || '',
        createdAt: u.createdAt ? u.createdAt.toISOString() : new Date().toISOString(),
        updatedAt: u.updatedAt ? u.updatedAt.toISOString() : new Date().toISOString()
      };
    }

    const inserted = await db.insert(users).values({
      uid,
      email,
      name: name || '',
      passwordHash: passwordHash || ''
    }).onConflictDoUpdate({
      target: users.uid,
      set: { email, name: name || '' }
    }).returning();

    const u = inserted[0];
    return {
      id: u.uid,
      email: u.email,
      name: u.name || name || '',
      passwordHash: u.passwordHash || '',
      createdAt: u.createdAt ? u.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: u.updatedAt ? u.updatedAt.toISOString() : new Date().toISOString()
    };
  } catch (error) {
    console.error('getOrCreateDbUser error:', error);
    throw new Error('Failed to get or create user in database', { cause: error });
  }
}

export async function findDbUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
    if (result.length === 0) return null;
    const u = result[0];
    return {
      id: u.uid,
      email: u.email,
      name: u.name || '',
      passwordHash: u.passwordHash || '',
      createdAt: u.createdAt ? u.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: u.updatedAt ? u.updatedAt.toISOString() : new Date().toISOString()
    };
  } catch (error) {
    console.error('findDbUserByEmail error:', error);
    return null;
  }
}

export async function findDbUserById(uid: string): Promise<User | null> {
  try {
    const result = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    if (result.length === 0) return null;
    const u = result[0];
    return {
      id: u.uid,
      email: u.email,
      name: u.name || '',
      passwordHash: u.passwordHash || '',
      createdAt: u.createdAt ? u.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: u.updatedAt ? u.updatedAt.toISOString() : new Date().toISOString()
    };
  } catch (error) {
    console.error('findDbUserById error:', error);
    return null;
  }
}

export async function getDbProfile(userId: string): Promise<Profile | null> {
  try {
    const result = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
    if (result.length === 0) return null;
    const p = result[0];
    return {
      userId: p.userId,
      name: p.name || '',
      age: p.age || 28,
      education: p.education || '',
      skills: (p.skills as string[]) || [],
      experience: p.experience || '',
      income: p.income || '',
      savings: p.savings || '',
      city: p.city || '',
      availableTime: p.availableTime || '',
      riskTolerance: (p.riskTolerance as any) || 'Moderate',
      goalsSummary: p.goalsSummary || '',
      interests: (p.interests as string[]) || [],
      updatedAt: p.updatedAt ? p.updatedAt.toISOString() : new Date().toISOString()
    };
  } catch (error) {
    console.error('getDbProfile error:', error);
    return null;
  }
}

export async function saveOrUpdateDbProfile(userId: string, profileData: Partial<Profile>): Promise<Profile> {
  try {
    const existing = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
    
    if (existing.length === 0) {
      const inserted = await db.insert(profiles).values({
        userId,
        name: profileData.name || '',
        age: profileData.age || 25,
        education: profileData.education || '',
        skills: profileData.skills || [],
        experience: profileData.experience || '',
        income: profileData.income || '',
        savings: profileData.savings || '',
        city: profileData.city || '',
        availableTime: profileData.availableTime || '',
        riskTolerance: profileData.riskTolerance || 'Moderate',
        goalsSummary: profileData.goalsSummary || '',
        interests: profileData.interests || []
      }).returning();

      const p = inserted[0];
      return {
        userId: p.userId,
        name: p.name || '',
        age: p.age || 28,
        education: p.education || '',
        skills: (p.skills as string[]) || [],
        experience: p.experience || '',
        income: p.income || '',
        savings: p.savings || '',
        city: p.city || '',
        availableTime: p.availableTime || '',
        riskTolerance: (p.riskTolerance as any) || 'Moderate',
        goalsSummary: p.goalsSummary || '',
        interests: (p.interests as string[]) || [],
        updatedAt: p.updatedAt ? p.updatedAt.toISOString() : new Date().toISOString()
      };
    } else {
      const updated = await db.update(profiles).set({
        name: profileData.name !== undefined ? profileData.name : existing[0].name,
        age: profileData.age !== undefined ? profileData.age : existing[0].age,
        education: profileData.education !== undefined ? profileData.education : existing[0].education,
        skills: profileData.skills !== undefined ? profileData.skills : existing[0].skills,
        experience: profileData.experience !== undefined ? profileData.experience : existing[0].experience,
        income: profileData.income !== undefined ? profileData.income : existing[0].income,
        savings: profileData.savings !== undefined ? profileData.savings : existing[0].savings,
        city: profileData.city !== undefined ? profileData.city : existing[0].city,
        availableTime: profileData.availableTime !== undefined ? profileData.availableTime : existing[0].availableTime,
        riskTolerance: profileData.riskTolerance !== undefined ? profileData.riskTolerance : existing[0].riskTolerance,
        goalsSummary: profileData.goalsSummary !== undefined ? profileData.goalsSummary : existing[0].goalsSummary,
        interests: profileData.interests !== undefined ? profileData.interests : existing[0].interests,
        updatedAt: new Date()
      }).where(eq(profiles.userId, userId)).returning();

      const p = updated[0];
      return {
        userId: p.userId,
        name: p.name || '',
        age: p.age || 28,
        education: p.education || '',
        skills: (p.skills as string[]) || [],
        experience: p.experience || '',
        income: p.income || '',
        savings: p.savings || '',
        city: p.city || '',
        availableTime: p.availableTime || '',
        riskTolerance: (p.riskTolerance as any) || 'Moderate',
        goalsSummary: p.goalsSummary || '',
        interests: (p.interests as string[]) || [],
        updatedAt: p.updatedAt ? p.updatedAt.toISOString() : new Date().toISOString()
      };
    }
  } catch (error) {
    console.error('saveOrUpdateDbProfile error:', error);
    throw new Error('Failed to save profile to database', { cause: error });
  }
}
