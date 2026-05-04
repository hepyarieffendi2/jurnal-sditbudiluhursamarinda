import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase-config';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

const AuthContext = createContext();

// Role hierarchy: kepsek > kurikulum > guru
export const ROLES = {
  GURU: 'guru',
  KURIKULUM: 'kurikulum',
  KEPSEK: 'kepsek'
};

// Helper: Check if user has at least the required role level
export const hasRole = (userRole, requiredRole) => {
  const hierarchy = { guru: 1, kurikulum: 2, kepsek: 3 };
  return (hierarchy[userRole] || 0) >= (hierarchy[requiredRole] || 0);
};

// Helper: Check if user can manage content (kurikulum or kepsek)
export const canManageContent = (userRole) => hasRole(userRole, ROLES.KURIKULUM);

// Helper: Check if user can manage accounts (kurikulum or kepsek)
export const canManageAccounts = (userRole) => hasRole(userRole, ROLES.KURIKULUM);

// Helper: Check if user is kepsek
export const isKepsek = (userRole) => userRole === ROLES.KEPSEK;

// Role display names
export const getRoleLabel = (role) => {
  switch (role) {
    case ROLES.KEPSEK: return 'Kepala Sekolah';
    case ROLES.KURIKULUM: return 'Tim Kurikulum';
    case ROLES.GURU: return 'Guru Kelas';
    default: return 'Guru Kelas';
  }
};

// Role badge colors
export const getRoleColor = (role) => {
  switch (role) {
    case ROLES.KEPSEK: return { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' };
    case ROLES.KURIKULUM: return { bg: '#EDE9FE', text: '#5B21B6', border: '#DDD6FE' };
    case ROLES.GURU: return { bg: '#DBEAFE', text: '#1E40AF', border: '#BFDBFE' };
    default: return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' };
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        try {
          // Try to fetch user profile from Firestore 'users' collection
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: userData.role || ROLES.GURU,
              displayName: userData.displayName || firebaseUser.displayName || 'Guru',
              kelasId: userData.kelasId || null,
              kelasName: userData.kelasName || null,
              status: userData.status || 'active'
            });
          } else {
            // Auto-create user doc for first-time users (backward compatibility)
            // Detect role from email for legacy accounts
            let detectedRole = ROLES.GURU;
            if (firebaseUser.email.includes('admin') || firebaseUser.email.includes('kurikulum')) {
              detectedRole = ROLES.KURIKULUM;
            } else if (firebaseUser.email.includes('kepsek') || firebaseUser.email.includes('kepsek')) {
              detectedRole = ROLES.KEPSEK;
            }

            const newUserData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: detectedRole,
              displayName: firebaseUser.displayName || 'Ustadzah / Guru',
              kelasId: null,
              kelasName: null,
              status: 'active',
              createdAt: new Date().toISOString()
            };

            await setDoc(userDocRef, newUserData);
            setUser(newUserData);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // Fallback: set basic user data from Firebase Auth
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: firebaseUser.email.includes('admin') ? ROLES.KURIKULUM : ROLES.GURU,
            displayName: firebaseUser.displayName || 'Ustadzah / Guru',
            kelasId: null,
            kelasName: null
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      let message = 'Gagal masuk. Periksa email dan kata sandi Anda.';
      if (error.code === 'auth/user-not-found') message = 'Email tidak terdaftar.';
      if (error.code === 'auth/wrong-password') message = 'Kata sandi salah.';
      if (error.code === 'auth/invalid-credential') message = 'Email atau kata sandi salah.';
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Admin function: Get all users
  const getAllUsers = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  // Admin function: Update user role
  const updateUserRole = async (uid, newRole) => {
    try {
      await updateDoc(doc(db, 'users', uid), { role: newRole, updatedAt: new Date().toISOString() });
      return { success: true };
    } catch (error) {
      console.error("Error updating role:", error);
      return { success: false, message: error.message };
    }
  };

  // Admin function: Update user profile
  const updateUserProfile = async (uid, data) => {
    try {
      await updateDoc(doc(db, 'users', uid), { ...data, updatedAt: new Date().toISOString() });
      return { success: true };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { success: false, message: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, login, logout, loading, 
      getAllUsers, updateUserRole, updateUserProfile 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
