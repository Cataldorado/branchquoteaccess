import { createContext, useContext, useState, type ReactNode } from "react";

export type UserRole = "branch-manager" | "branch-associate";

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isManager: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>("branch-manager");

  return (
    <RoleContext.Provider value={{ role, setRole, isManager: role === "branch-manager" }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
