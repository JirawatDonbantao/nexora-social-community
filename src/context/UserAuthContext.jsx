import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, createFirebaseConfigurationError } from "../firebase";
import { UserAuthContext } from "./authContext";

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(auth));

  function signUp(email, password) {
    if (!auth) return Promise.reject(createFirebaseConfigurationError());
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function logIn(email, password) {
    if (!auth) return Promise.reject(createFirebaseConfigurationError());
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logInWithGoogle() {
    if (!auth) return Promise.reject(createFirebaseConfigurationError());
    return signInWithPopup(auth, new GoogleAuthProvider());
  }

  function logOut() {
    if (!auth) return Promise.reject(createFirebaseConfigurationError());
    return signOut(auth);
  }

  useEffect(() => {
    if (!auth) {
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <UserAuthContext.Provider value={{ user, loading, signUp, logIn, logInWithGoogle, logOut }}>
      {children}
    </UserAuthContext.Provider>
  );
}
