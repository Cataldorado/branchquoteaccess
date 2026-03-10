import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Customer } from "@/data/mockData";

export interface QuoteSearchFilters {
  search: string;
  showExpired: boolean;
  showOtherBranches: boolean;
}

const defaultFilters: QuoteSearchFilters = {
  search: "",
  showExpired: false,
  showOtherBranches: false,
};

export interface CustomerTab {
  customer: Customer;
  activeModule: string | null;
  quoteSearchFilters: QuoteSearchFilters;
}

interface CustomerContextType {
  tabs: CustomerTab[];
  activeTabIndex: number | null;
  selectedCustomer: Customer | null;
  isSearching: boolean;
  setSelectedCustomer: (customer: Customer | null) => void;
  clearCustomer: () => void;
  addCustomerTab: (customer: Customer) => void;
  closeTab: (index: number) => void;
  switchTab: (index: number) => void;
  openSearch: () => void;
  setActiveModule: (module: string | null) => void;
  getQuoteSearchFilters: () => QuoteSearchFilters;
  setQuoteSearchFilters: (filters: Partial<QuoteSearchFilters>) => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [tabs, setTabs] = useState<CustomerTab[]>([]);
  const [activeTabIndex, setActiveTabIndex] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(true);

  const selectedCustomer = activeTabIndex !== null ? tabs[activeTabIndex]?.customer ?? null : null;

  const addCustomerTab = useCallback((customer: Customer) => {
    const existingIndex = tabs.findIndex(t => t.customer.id === customer.id);
    if (existingIndex !== -1) {
      setActiveTabIndex(existingIndex);
      setIsSearching(false);
      return;
    }
    setTabs(prev => [...prev, { customer, activeModule: null, quoteSearchFilters: { ...defaultFilters } }]);
    setActiveTabIndex(tabs.length);
    setIsSearching(false);
  }, [tabs]);

  const closeTab = useCallback((index: number) => {
    setTabs(prev => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) {
        setActiveTabIndex(null);
        setIsSearching(true);
      } else if (activeTabIndex !== null) {
        if (index === activeTabIndex) {
          setActiveTabIndex(Math.min(index, next.length - 1));
        } else if (index < activeTabIndex) {
          setActiveTabIndex(activeTabIndex - 1);
        }
      }
      return next;
    });
  }, [activeTabIndex]);

  const switchTab = useCallback((index: number) => {
    setActiveTabIndex(index);
    setIsSearching(false);
  }, []);

  const openSearch = useCallback(() => {
    setIsSearching(true);
  }, []);

  const setActiveModule = useCallback((module: string | null) => {
    if (activeTabIndex === null) return;
    setTabs(prev => prev.map((tab, i) => i === activeTabIndex ? { ...tab, activeModule: module } : tab));
  }, [activeTabIndex]);

  const getQuoteSearchFilters = useCallback((): QuoteSearchFilters => {
    if (activeTabIndex === null) return { ...defaultFilters };
    return tabs[activeTabIndex]?.quoteSearchFilters ?? { ...defaultFilters };
  }, [activeTabIndex, tabs]);

  const setQuoteSearchFilters = useCallback((filters: Partial<QuoteSearchFilters>) => {
    if (activeTabIndex === null) return;
    setTabs(prev => prev.map((tab, i) =>
      i === activeTabIndex
        ? { ...tab, quoteSearchFilters: { ...tab.quoteSearchFilters, ...filters } }
        : tab
    ));
  }, [activeTabIndex]);

  const setSelectedCustomer = useCallback((customer: Customer | null) => {
    if (customer) {
      addCustomerTab(customer);
    }
  }, [addCustomerTab]);

  const clearCustomer = useCallback(() => {
    if (activeTabIndex !== null) {
      closeTab(activeTabIndex);
    }
  }, [activeTabIndex, closeTab]);

  return (
    <CustomerContext.Provider value={{
      tabs, activeTabIndex, selectedCustomer, isSearching,
      setSelectedCustomer, clearCustomer, addCustomerTab, closeTab,
      switchTab, openSearch, setActiveModule,
      getQuoteSearchFilters, setQuoteSearchFilters,
    }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error("useCustomer must be used within CustomerProvider");
  return ctx;
}
