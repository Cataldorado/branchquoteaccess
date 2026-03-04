import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TopHeader() {
  return (
    <header className="h-14 border-b border-border bg-card flex items-center px-6 gap-4 shrink-0">
      <SidebarTrigger className="text-muted-foreground/60 hover:text-foreground transition-colors" />

      <div className="flex-1" />

      <div className="flex items-center gap-3 cursor-pointer group">
        <Avatar className="h-8 w-8 ring-1 ring-border">
          <AvatarFallback className="text-2xs bg-secondary text-secondary-foreground font-medium">JS</AvatarFallback>
        </Avatar>
        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors hidden lg:inline">J. Smith</span>
      </div>
    </header>
  );
}
