import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// ─── Auth ──────────────────────────────────────
export { auth };

export function loginWithGoogle() {
  return signInWithPopup(auth, provider);
}

export function logout() {
  return signOut(auth);
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

// ─── Firestore ─────────────────────────────────
const PROFILES_COLLECTION = 'profiles';

export async function fetchProfiles() {
  try {
    const q = query(collection(db, PROFILES_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return [];
  }
}

export async function createProfile(profileData) {
  try {
    const user = auth.currentUser;
    const docRef = await addDoc(collection(db, PROFILES_COLLECTION), {
      ...profileData,
      uid: user ? user.uid : null,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...profileData, uid: user?.uid, createdAt: Date.now() };
  } catch (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
}

export async function deleteProfile(profileId) {
  try {
    await deleteDoc(doc(db, PROFILES_COLLECTION, profileId));
  } catch (error) {
    console.error('Error deleting profile:', error);
    throw error;
  }
}
