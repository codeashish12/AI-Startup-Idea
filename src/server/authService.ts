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

    this.profiles.set(demoId, {
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
    });
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

    return { user, profile };
  }

  public findByEmail(email: string): User | undefined {
    return this.users.get(email.toLowerCase());
  }

  public findById(id: string): User | undefined {
    return this.users.get(id);
  }

  public getProfile(userId: string): Profile | undefined {
    return this.profiles.get(userId);
  }

  public updateProfile(userId: string, updates: Partial<Profile>): Profile {
    const existing = this.getProfile(userId);
    if (!existing) {
      throw new Error('Profile not found');
    }
    const updated: Profile = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.profiles.set(userId, updated);
    return updated;
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
