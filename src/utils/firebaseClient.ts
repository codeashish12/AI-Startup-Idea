import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

let app: FirebaseApp | null = null;

const AUTHORIZED_FIREBASE_HOSTNAMES = [
  'localhost',
  '127.0.0.1',
  'futureengin.netlify.app',
  'futureengine.ai',
];

export function isAuthorizedFirebaseDomain(hostname: string) {
  const normalized = hostname.toLowerCase();
  if (AUTHORIZED_FIREBASE_HOSTNAMES.includes(normalized)) {
    return true;
  }
  if (/\.netlify\.app$/.test(normalized)) {
    return true;
  }
  return false;
}

export function initFirebase() {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig as any);
  }
  return app!;
}

export async function signInWithGooglePopup() {
  if (typeof window !== 'undefined' && !isAuthorizedFirebaseDomain(window.location.hostname)) {
    throw new Error(
      'Google sign-in is unavailable on this domain. Please add the current domain to Firebase Authentication authorized domains.'
    );
  }

  initFirebase();
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  const idToken = await user.getIdToken();
  return {
    idToken,
    email: user.email || '',
    name: user.displayName || ''
  };
}

export default initFirebase;
