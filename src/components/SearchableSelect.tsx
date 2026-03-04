import { useState, useMemo, useRef, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  allLabel?: string;
}

export function SearchableSelect({ options, value, onValueChange, placeholder = "Select...", allLabel = "All" }: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    if (!search) return options;
    const s = search.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(s));
  }, [options, search]);

  const selectedLabel = value === "all" ? allLabel : options.find((o) => o.value === value)?.label ?? placeholder;

  useEffect(() => {
    if (open) {
      setSearch("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 text-sm justify-between w-full font-normal bg-background">
          <span className="truncate">{selectedLabel}</span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-40" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0" align="start">
        <div className="p-2 border-b border-border">
          <Input
            ref={inputRef}
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 text-sm"
          />
        </div>
        <div className="max-h-[220px] overflow-y-auto p-1">
          <button
            className={cn(
              "flex items-center gap-2 w-full rounded-md px-2.5 py-2 text-sm cursor-pointer hover:bg-muted transition-colors",
              value === "all" && "bg-muted"
            )}
            onClick={() => { onValueChange("all"); setOpen(false); }}
          >
            <Check className={cn("h-3.5 w-3.5", value === "all" ? "opacity-100" : "opacity-0")} />
            {allLabel}
          </button>
          {filtered.map((o) => (
            <button
              key={o.value}
              className={cn(
                "flex items-center gap-2 w-full rounded-md px-2.5 py-2 text-sm cursor-pointer hover:bg-muted transition-colors",
                value === o.value && "bg-muted"
              )}
              onClick={() => { onValueChange(o.value); setOpen(false); }}
            >
              <Check className={cn("h-3.5 w-3.5", value === o.value ? "opacity-100" : "opacity-0")} />
              {o.label}
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="px-2.5 py-4 text-sm text-muted-foreground text-center">No results</div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
