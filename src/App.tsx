import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { RoleProvider } from "@/contexts/RoleContext";
import QuoteSearch from "@/pages/QuoteSearch";
import QuoteDetail from "@/pages/QuoteDetail";
import QuoteCreate from "@/pages/QuoteCreate";
import Dashboard from "@/pages/Dashboard";
import Customers from "@/pages/Customers";
import Branches from "@/pages/Branches";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <RoleProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
        </BrowserRouter>
      </TooltipProvider>
    </RoleProvider>
  </QueryClientProvider>
);

export default App;
