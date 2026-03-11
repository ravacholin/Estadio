import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { UserProfile } from '../types';

const LOCAL_STORAGE_KEY = 'serEstarProfile';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const loadProfile = async (): Promise<UserProfile | null> => {
  // Try to load from Firestore if authenticated
  if (auth.currentUser) {
    const path = `users/${auth.currentUser.uid}`;
    try {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const profile = docSnap.data() as UserProfile;
        // Sync to local storage
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
        return profile;
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('the client is offline')) {
        console.error("Please check your Firebase configuration.");
      } else {
        handleFirestoreError(error, OperationType.GET, path);
      }
    }
  }

  // Fallback to local storage
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved) as UserProfile;
  }

  return null;
};

export const saveProfile = async (profile: UserProfile): Promise<void> => {
  // Save to local storage
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));

  // Save to Firestore if authenticated
  if (auth.currentUser) {
    const path = `users/${auth.currentUser.uid}`;
    try {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(docRef, profile);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }
};

export const clearProfile = async (): Promise<void> => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  // We don't delete from Firestore to allow recovery, just sign out
  if (auth.currentUser) {
    await auth.signOut();
  }
};
