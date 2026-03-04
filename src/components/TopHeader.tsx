import { ChevronDown } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TopHeader() {
  return (
    <header className="h-12 border-b border-border bg-card flex items-center px-3 gap-3 shrink-0">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />

      <div className="flex-1" />

      <div className="flex items-center gap-2 cursor-pointer">
        <Avatar className="h-7 w-7">
          <AvatarFallback className="text-[10px] bg-primary text-primary-foreground font-semibold">JS</AvatarFallback>
        </Avatar>
        <span className="text-xs font-medium hidden lg:inline">J. Smith</span>
        <ChevronDown className="h-3 w-3 text-muted-foreground hidden lg:inline" />
      </div>
    </header>
  );
}
