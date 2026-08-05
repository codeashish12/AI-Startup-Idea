import crypto from 'crypto';

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  userId: string;
  name: string;
  age: number;
  education: string;
  skills: string[];
  experience: string;
  income: string;
  savings?: string;
  city: string;
  availableTime: string;
  riskTolerance: 'Low' | 'Moderate' | 'High';
  goalsSummary: string;
  interests?: string[];
  updatedAt: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'future_engine_production_jwt_secret_2026_key';

// In-Memory Repository with PostgreSQL fallback
import { getOrCreateDbUser, findDbUserByEmail, findDbUserById, getDbProfile, saveOrUpdateDbProfile } from '../db/users.ts';

export class InMemoryUserRepository {
  private users: Map<string, User> = new Map();
  private profiles: Map<string, Profile> = new Map();

  constructor() {
    // Seed default demo user for instant out-of-the-box testing
    const demoId = 'user-demo-001';
    const demoPasswordHash = this.hashPassword('DemoPassword123!');
    const demoUser: User = {
      id: demoId,
      email: 'aarav@futureengine.ai',
      name: 'Aarav Sharma',
      passwordHash: demoPasswordHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.users.set(demoId, demoUser);
    this.users.set('aarav@futureengine.ai', demoUser); // key by email as well

    const demoProfile: Profile = {
      userId: demoId,
      name: 'Aarav Sharma',
      age: 28,
      education: 'B.Tech Computer Science',
      skills: ['React', 'TypeScript', 'Node.js', 'System Design'],
      experience: '4 years as Senior Software Engineer',
      income: '₹18,00,000 / year',
      savings: '₹5,00,000',
      city: 'Bengaluru',
      availableTime: '15 hours / week',
      riskTolerance: 'Moderate',
      goalsSummary: 'Pivot to AI Product Manager or SaaS Founder in Bengaluru',
      interests: ['AI & LLMs', 'Product Strategy', 'Fintech'],
      updatedAt: new Date().toISOString()
    };
    this.profiles.set(demoId, demoProfile);

    // Asynchronously sync seed user to DB
    getOrCreateDbUser(demoId, demoUser.email, demoUser.name, demoPasswordHash)
      .then(() => saveOrUpdateDbProfile(demoId, demoProfile))
      .catch((err) => console.warn('Demo user DB sync warning:', err.message));
  }

  public hashPassword(password: string): string {
    return crypto.createHmac('sha256', JWT_SECRET).update(password).digest('hex');
  }

  public createUser(email: string, password: string, name: string): { user: User; profile: Profile } {
    const existing = this.users.get(email.toLowerCase());
    if (existing) {
      throw new Error('User with this email already exists');
    }

    const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const user: User = {
      id,
      email: email.toLowerCase(),
      name,
      passwordHash: this.hashPassword(password),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const profile: Profile = {
      userId: id,
      name,
      age: 25,
      education: 'Bachelor Degree',
      skills: ['Strategic Planning', 'Execution'],
      experience: '3 years experience',
      income: '₹10,00,000 / year',
      city: 'Mumbai',
      availableTime: '10 hours / week',
      riskTolerance: 'Moderate',
      goalsSummary: 'Career growth & skill expansion',
      updatedAt: new Date().toISOString()
    };

    this.users.set(id, user);
    this.users.set(email.toLowerCase(), user);
    this.profiles.set(id, profile);

    // Sync to PostgreSQL DB asynchronously
    getOrCreateDbUser(id, user.email, name, user.passwordHash)
      .then(() => saveOrUpdateDbProfile(id, profile))
      .catch((err) => console.warn('DB user creation sync warning:', err.message));

    return { user, profile };
  }

  public async createUserAsync(email: string, password: string, name: string): Promise<{ user: User; profile: Profile }> {
    const dbExisting = await findDbUserByEmail(email);
    if (dbExisting) {
      throw new Error('User with this email already exists');
    }

    const res = this.createUser(email, password, name);
    try {
      await getOrCreateDbUser(res.user.id, res.user.email, name, res.user.passwordHash);
      await saveOrUpdateDbProfile(res.user.id, res.profile);
    } catch (e) {
      console.warn('createUserAsync DB error, using in-memory user:', e);
    }
    return res;
  }

  public findByEmail(email: string): User | undefined {
    return this.users.get(email.toLowerCase());
  }

  public async findByEmailAsync(email: string): Promise<User | undefined> {
    const dbUser = await findDbUserByEmail(email);
    if (dbUser) return dbUser;
    return this.findByEmail(email);
  }

  public findById(id: string): User | undefined {
    return this.users.get(id);
  }

  public async findByIdAsync(id: string): Promise<User | undefined> {
    const dbUser = await findDbUserById(id);
    if (dbUser) return dbUser;
    return this.findById(id);
  }

  public getProfile(userId: string): Profile | undefined {
    return this.profiles.get(userId);
  }

  public async getProfileAsync(userId: string): Promise<Profile | undefined> {
    const dbProf = await getDbProfile(userId);
    if (dbProf) return dbProf;
    return this.getProfile(userId);
  }

  public updateProfile(userId: string, updates: Partial<Profile>): Profile {
    const existing = this.getProfile(userId) || {
      userId,
      name: 'User',
      age: 28,
      education: '',
      skills: [],
      experience: '',
      income: '',
      city: '',
      availableTime: '',
      riskTolerance: 'Moderate',
      goalsSummary: '',
      updatedAt: new Date().toISOString()
    };

    const updated: Profile = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.profiles.set(userId, updated);

    // Sync to PostgreSQL DB asynchronously
    saveOrUpdateDbProfile(userId, updated)
      .catch((err) => console.warn('DB profile update warning:', err.message));

    return updated;
  }

  public async updateProfileAsync(userId: string, updates: Partial<Profile>): Promise<Profile> {
    const updated = this.updateProfile(userId, updates);
    try {
      return await saveOrUpdateDbProfile(userId, updates);
    } catch (e) {
      return updated;
    }
  }
}

export const userRepository = new InMemoryUserRepository();

export interface JwtPayload {
  userId: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
}

export class AuthService {
  public generateToken(user: User): string {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const now = Math.floor(Date.now() / 1000);
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      iat: now,
      exp: now + 7 * 24 * 60 * 60 // 7 days
    };
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${encodedPayload}`)
      .digest('base64url');

    return `${header}.${encodedPayload}.${signature}`;
  }

  public verifyToken(token: string): JwtPayload {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }
    const [header, payload, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest('base64url');

    if (signature !== expectedSig) {
      throw new Error('Invalid token signature');
    }

    const decodedPayload: JwtPayload = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Token has expired');
    }

    return decodedPayload;
  }
}

export const authService = new AuthService();
