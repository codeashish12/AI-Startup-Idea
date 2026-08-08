import { Handler } from '@netlify/functions';
import crypto from 'crypto';

// This will be populated from environment
const JWT_SECRET = process.env.JWT_SECRET || 'future_engine_production_jwt_secret_2026_key';

// Mock user repository for serverless - should connect to DB in production
class UserRepository {
  private users: Map<string, any> = new Map();
  private profiles: Map<string, any> = new Map();

  constructor() {
    // Seed demo user
    const demoId = 'user-demo-001';
    const demoPasswordHash = this.hashPassword('DemoPassword123!');
    const demoUser = {
      id: demoId,
      email: 'aarav@futureengine.ai',
      name: 'Aarav Sharma',
      passwordHash: demoPasswordHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.users.set(demoId, demoUser);
    this.users.set('aarav@futureengine.ai', demoUser);

    const demoProfile = {
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
  }

  hashPassword(password: string): string {
    return crypto.createHmac('sha256', JWT_SECRET).update(password).digest('hex');
  }

  createUser(email: string, password: string, name: string) {
    const existing = this.users.get(email.toLowerCase());
    if (existing) {
      throw new Error('User with this email already exists');
    }

    const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const user = {
      id,
      email: email.toLowerCase(),
      name,
      passwordHash: this.hashPassword(password),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const profile = {
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

  findByEmail(email: string) {
    return this.users.get(email.toLowerCase());
  }

  getProfile(userId: string) {
    return this.profiles.get(userId);
  }
}

class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  generateToken(user: any): string {
    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
    };
    
    // Simple JWT-like token (not fully secure, but works for demo)
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }

  verifyToken(token: string): any {
    try {
      const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        throw new Error('Token expired');
      }
      return payload;
    } catch (e) {
      throw new Error('Invalid token');
    }
  }

  signup(email: string, password: string, name: string) {
    const { user, profile } = this.userRepository.createUser(email, password, name);
    const token = this.generateToken(user);
    return {
      message: 'Account created successfully',
      token,
      user: { id: user.id, email: user.email, name: user.name },
      profile
    };
  }

  login(email: string, password: string) {
    const user = this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const hash = this.userRepository.hashPassword(password);
    if (hash !== user.passwordHash) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken(user);
    const profile = this.userRepository.getProfile(user.id);
    return {
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, name: user.name },
      profile
    };
  }

  googleAuth(email: string, name: string) {
    let user = this.userRepository.findByEmail(email);
    let profile = null;

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-12) + Date.now().toString(36).slice(-6);
      const created = this.userRepository.createUser(email, randomPassword, name || '');
      user = created.user;
      profile = created.profile;
    } else {
      profile = this.userRepository.getProfile(user.id);
    }

    const token = this.generateToken(user);
    return {
      message: 'Google login successful',
      token,
      user: { id: user.id, email: user.email, name: user.name },
      profile
    };
  }
}

const authService = new AuthService();

const handler: Handler = async (event) => {
  const httpMethod = event.httpMethod;
  const path = event.path;

  try {
    // Handle preflight requests
    if (httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
        body: '',
      };
    }

    let body: any = {};
    try {
      body = event.body ? JSON.parse(event.body) : {};
    } catch (e) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid JSON' }),
      };
    }

    // Handle signup
    if (path.includes('/auth/signup') && httpMethod === 'POST') {
      const { email, password, name } = body;
      if (!email || !password || !name) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Email, password, and name are required' }),
        };
      }

      try {
        const result = authService.signup(email, password, name);
        return {
          statusCode: 201,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify(result),
        };
      } catch (e: any) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: e.message || 'Failed to create account' }),
        };
      }
    }

    // Handle login
    if (path.includes('/auth/login') && httpMethod === 'POST') {
      const { email, password } = body;
      if (!email || !password) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Email and password are required' }),
        };
      }

      try {
        const result = authService.login(email, password);
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify(result),
        };
      } catch (e: any) {
        return {
          statusCode: 401,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: e.message || 'Authentication failed' }),
        };
      }
    }

    // Handle Google OAuth
    if (path.includes('/auth/google') && httpMethod === 'POST') {
      const { email, name } = body;
      if (!email) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Missing email from Google sign-in' }),
        };
      }

      try {
        const result = authService.googleAuth(email, name || '');
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify(result),
        };
      } catch (e: any) {
        return {
          statusCode: 500,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: e.message || 'Google auth failed' }),
        };
      }
    }

    return {
      statusCode: 404,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Not found' }),
    };
  } catch (error: any) {
    console.error('Auth function error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export { handler };
