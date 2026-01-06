import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin with service account
const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

// Initialize only if not already initialized
const app = getApps().length === 0
    ? initializeApp({ credential: cert(serviceAccount) })
    : getApps()[0];

// Firestore Admin instance (bypasses security rules)
export const adminDb = getFirestore(app);
