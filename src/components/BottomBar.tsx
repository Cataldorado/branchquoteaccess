import { Sun, Moon, ShieldCheck, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useRole } from "@/contexts/RoleContext";

export function BottomBar() {
  const { setRole, isManager } = useRole();
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <footer className="h-10 border-t border-border bg-card flex items-center px-4 gap-3 shrink-0">
      <div className="flex-1" />

      {/* Role toggle */}
      <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
        <button
          onClick={() => setRole("branch-manager")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            isManager
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Manager</span>
        </button>
        <button
          onClick={() => setRole("branch-associate")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            !isManager
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <User className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Associate</span>
        </button>
      </div>

      {/* Dark mode toggle */}
      <button
        onClick={() => setDark(!dark)}
        className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        title={dark ? "Light mode" : "Dark mode"}
      >
        {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
    </footer>
  );
}
