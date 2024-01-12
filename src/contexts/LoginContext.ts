import { createContext } from "react";

export interface LoginContextType {
  isLoggedIn: boolean;
  userId?: string;
  jwt?: string;
}
interface T {
  loginState: LoginContextType;
  setLoginState: React.Dispatch<React.SetStateAction<LoginContextType>>;
}
export const LoginContext = createContext<T | undefined>(undefined);
