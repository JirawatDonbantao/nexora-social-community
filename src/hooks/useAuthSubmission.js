import { useEffect, useRef, useState } from "react";
import { getAuthErrorMessage } from "../utils/authErrors";

export function useAuthSubmission() {
  const [pendingMethod, setPendingMethod] = useState("");
  const [error, setError] = useState("");
  const errorRef = useRef(null);
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (error) {
      errorRef.current?.focus();
    }
  }, [error]);

  async function submit(method, action) {
    clearError();
    setPendingMethod(method);

    try {
      await action();
    } catch (authError) {
      if (isMountedRef.current) {
        setError(getAuthErrorMessage(authError));
      }
    } finally {
      if (isMountedRef.current) {
        setPendingMethod("");
      }
    }
  }

  function clearError() {
    if (isMountedRef.current) {
      setError("");
    }
  }

  return {
    clearError,
    error,
    errorRef,
    isPending: Boolean(pendingMethod),
    pendingMethod,
    submit,
  };
}
