import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { RoleProvider } from "@/contexts/RoleContext";
import { CustomerProvider, useCustomer } from "@/contexts/CustomerContext";
import QuoteSearch from "@/pages/QuoteSearch";
import QuoteDetail from "@/pages/QuoteDetail";
import QuoteCreate from "@/pages/QuoteCreate";
import Dashboard from "@/pages/Dashboard";
import Customers from "@/pages/Customers";
import Branches from "@/pages/Branches";
import CustomerSearch from "@/pages/CustomerSearch";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { selectedCustomer } = useCustomer();

  if (!selectedCustomer) {
    return <CustomerSearch />;
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<QuoteSearch />} />
        <Route path="/quotes/new" element={<QuoteCreate />} />
        <Route path="/quotes/:id" element={<QuoteDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/branches" element={<Branches />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <RoleProvider>
      <CustomerProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </CustomerProvider>
    </RoleProvider>
  </QueryClientProvider>
);

export default App;
