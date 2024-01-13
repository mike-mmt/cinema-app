import { createContext } from "react";


interface T {
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}
export const LoginContext = createContext<T | undefined>(undefined);
