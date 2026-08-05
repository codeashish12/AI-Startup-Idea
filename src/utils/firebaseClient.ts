import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

let app: FirebaseApp | null = null;

const AUTHORIZED_FIREBASE_HOSTNAMES = [
  'localhost',
  '127.0.0.1',
  'futureengin.netlify.app',
  'futureengine.ai',
];

export function initFirebase() {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig as any);
  }
  return app!;
}

function isFirebaseDomainAllowed(hostname: string) {
  const normalized = hostname.toLowerCase();
  if (AUTHORIZED_FIREBASE_HOSTNAMES.includes(normalized)) {
    return true;
  }
  if (/\.netlify\.app$/.test(normalized)) {
    return true;
  }
  return false;
}

function normalizeFirebaseUser(user: FirebaseUser, fallbackName?: string) {
  return {
    uid: user.uid,
    email: user.email || '',
    name: user.displayName || fallbackName || user.email?.split('@')[0] || 'User',
  };
}

export async function signInWithGooglePopup() {
  if (typeof window !== 'undefined' && !isFirebaseDomainAllowed(window.location.hostname)) {
    throw new Error(
      'Google sign-in is blocked on this domain. Add the current domain to Firebase Authentication authorized domains in your Firebase Console.'
    );
  }

  initFirebase();
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = normalizeFirebaseUser(result.user);
  const idToken = await result.user.getIdToken();
  return {
    idToken,
    email: user.email,
    name: user.name,
    uid: user.uid,
  };
}

export async function signInWithEmailPassword(email: string, password: string) {
  initFirebase();
  const auth = getAuth();
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const user = normalizeFirebaseUser(credential.user);
  const idToken = await credential.user.getIdToken();
  return {
    idToken,
    email: user.email,
    name: user.name,
    uid: user.uid,
  };
}

export async function createUserWithEmailPassword(email: string, password: string, name: string) {
  initFirebase();
  const auth = getAuth();
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  if (credential.user && name) {
    await updateProfile(credential.user, { displayName: name });
  }
  const user = normalizeFirebaseUser(credential.user, name);
  const idToken = await credential.user.getIdToken();
  return {
    idToken,
    email: user.email,
    name: user.name,
    uid: user.uid,
  };
}

export async function signOutFirebase() {
  if (typeof window === 'undefined') return;
  initFirebase();
  const auth = getAuth();
  await signOut(auth);
}

export default initFirebase;
