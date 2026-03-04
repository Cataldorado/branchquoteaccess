import { Search, Bell, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { branches } from "@/data/mockData";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TopHeader() {
  return (
    <header className="h-12 border-b border-border bg-card flex items-center px-3 gap-3 shrink-0">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />

      <div className="flex-1 flex items-center gap-3">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search quotes, customers, PO#..."
            className="h-8 pl-8 text-xs bg-muted/50 border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      <Select defaultValue="BR001">
        <SelectTrigger className="h-8 w-[180px] text-xs border-0 bg-muted/50">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {branches.map((b) => (
            <SelectItem key={b.id} value={b.id} className="text-xs">
              {b.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
        <Bell className="h-4 w-4" />
      </Button>

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
