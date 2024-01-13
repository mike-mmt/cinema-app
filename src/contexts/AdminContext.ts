import { createContext } from "react";


interface T {
  isAdmin: boolean;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}
export const AdminContext = createContext<T | undefined>(undefined);
