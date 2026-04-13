import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase-config';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        // Option: Fetch additional profile data from 'guru' collection if exists
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role: firebaseUser.email.includes('admin') ? 'admin' : 'guru',
          displayName: firebaseUser.displayName || 'Ustadzah / Guru'
        });
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

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
