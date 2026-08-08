import { AuthState, UserProfile } from '../types';

export const AUTH_TOKEN_KEY = 'fe_auth_token';
export const AUTH_STATE_KEY = 'fe_auth';

export const PROTECTED_TABS = new Set(['dashboard', 'profile', 'report', 'saved']);

export interface AuthSessionUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthApiProfile {
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

export interface AuthSuccessResponse {
  token: string;
  user: AuthSessionUser;
  profile?: AuthApiProfile;
}

export function getStoredToken(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
}

export function persistAuthSession(token: string, user: AuthSessionUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  const authState: AuthState = {
    isAuthenticated: true,
    user: { id: user.id, email: user.email, name: user.name },
    token,
  };
  localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(authState));
}

export function clearAuthSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_STATE_KEY);
}

export function loadPersistedAuthState(): AuthState {
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, user: null, token: null };
  }

  const token = getStoredToken();
  const saved = localStorage.getItem(AUTH_STATE_KEY);
  if (!saved) {
    return { isAuthenticated: false, user: null, token: null };
  }

  try {
    const parsed = JSON.parse(saved) as AuthState;
    if (parsed.user) {
      return { isAuthenticated: true, user: parsed.user, token: token ?? parsed.token ?? null };
    }
  } catch {
    clearAuthSession();
  }

  return { isAuthenticated: false, user: null, token: null };
}

export function authHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const token = getStoredToken();
  const headers: Record<string, string> = { ...extra };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export function mapApiProfileToUserProfile(profile: AuthApiProfile): UserProfile {
  return {
    name: profile.name,
    age: profile.age,
    education: profile.education,
    skills: profile.skills || [],
    experience: profile.experience,
    income: profile.income,
    savings: profile.savings,
    city: profile.city,
    availableTime: profile.availableTime,
    riskTolerance: profile.riskTolerance,
    goalsSummary: profile.goalsSummary,
    interests: profile.interests,
  };
}

function parseJsonSafe(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function makeAuthRequest(endpoint: string, body: Record<string, any>): Promise<AuthSuccessResponse> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const contentType = res.headers.get('content-type') || '';
  const responseText = await res.text();
  const isJson = contentType.includes('application/json');

  if (!isJson) {
    throw new Error('Server returned invalid response');
  }

  const data = parseJsonSafe(responseText);
  
  if (!res.ok) {
    throw new Error(data?.error || 'Authentication failed');
  }

  return data as AuthSuccessResponse;
}

export async function loginWithEmail(email: string, password: string): Promise<AuthSuccessResponse> {
  return makeAuthRequest('/api/auth/login', { email, password });
}

export async function signupWithEmail(
  email: string,
  password: string,
  name: string
): Promise<AuthSuccessResponse> {
  return makeAuthRequest('/api/auth/signup', { email, password, name });
}

export function parseAuthError(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as any).message);
  }
  return 'Authentication failed. Please check your credentials or try again later.';
}

export async function verifySession(token: string): Promise<AuthApiProfile | null> {
  const res = await fetch('/api/profile', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    return null;
  }

  return res.json() as Promise<AuthApiProfile>;
}

export async function updateProfileOnServer(profile: UserProfile): Promise<AuthApiProfile> {
  const res = await fetch('/api/profile', {
    method: 'PUT',
    headers: { ...authHeaders({ 'Content-Type': 'application/json' }) },
    body: JSON.stringify(profile),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Profile update failed');
  }

  return (data.profile ?? data) as AuthApiProfile;
}
