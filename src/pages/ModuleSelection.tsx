import { Search, BarChart3, Users } from "lucide-react";
import { useCustomer } from "@/contexts/CustomerContext";
import { cn } from "@/lib/utils";

const tools = [
  {
    id: "quotes",
    label: "Quote Search",
    description: "Search and manage quotes for this customer",
    icon: Search,
    enabled: true,
  },
  {
    id: "dashboard",
    label: "Dashboard",
    description: "View analytics and reports",
    icon: BarChart3,
    enabled: false,
  },
  {
    id: "customers",
    label: "Customers",
    description: "Manage customer details and contacts",
    icon: Users,
    enabled: false,
  },
];

export default function ModuleSelection() {
  const { selectedCustomer, setActiveModule } = useCustomer();

  if (!selectedCustomer) return null;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 -mt-14">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            {selectedCustomer.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Select a tool to get started.
          </p>
        </div>

        <div className="grid gap-3">
          {modules.map((mod) => (
            <button
              key={mod.id}
              disabled={!mod.enabled}
              onClick={() => mod.enabled && setActiveModule(mod.id)}
              className={cn(
                "flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition-all",
                mod.enabled
                  ? "bg-card border-border hover:border-brand/40 hover:shadow-sm cursor-pointer group"
                  : "bg-muted/40 border-border/50 cursor-default opacity-60"
              )}
            >
              <div className={cn(
                "h-11 w-11 rounded-lg flex items-center justify-center shrink-0",
                mod.enabled ? "bg-brand/10 text-brand" : "bg-muted text-muted-foreground"
              )}>
                <mod.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-sm font-medium",
                    mod.enabled ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {mod.label}
                  </span>
                  {!mod.enabled && (
                    <span className="text-2xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full font-medium">
                      Soon
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{mod.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
