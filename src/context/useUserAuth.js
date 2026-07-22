import { useContext } from "react";
import { UserAuthContext } from "./authContext";

export function useUserAuth() {
  const context = useContext(UserAuthContext);

  if (!context) {
    throw new Error("useUserAuth ต้องถูกใช้งานภายใน UserAuthContextProvider");
  }

  return context;
}
