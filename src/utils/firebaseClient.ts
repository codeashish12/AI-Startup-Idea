import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

let app: FirebaseApp | null = null;

export function initFirebase() {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig as any);
  }
  return app!;
}

export async function signInWithGooglePopup() {
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
