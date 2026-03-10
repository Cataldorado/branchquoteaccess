import { createContext, useContext, useState, type ReactNode } from "react";
import type { Customer } from "@/data/mockData";

interface CustomerContextType {
  selectedCustomer: Customer | null;
  setSelectedCustomer: (customer: Customer | null) => void;
  clearCustomer: () => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const clearCustomer = () => setSelectedCustomer(null);

  return (
    <CustomerContext.Provider value={{ selectedCustomer, setSelectedCustomer, clearCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error("useCustomer must be used within CustomerProvider");
  return ctx;
}
