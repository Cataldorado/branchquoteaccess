import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProjects, type ProjectStatus, type CommercialProject } from "@/data/projectFlow";
import { findVertical, findSubVertical } from "@/data/projectFlow";
import { currentUserBranch, customers } from "@/data/mockData";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useCustomer } from "@/contexts/CustomerContext";

const COLUMNS: { key: ProjectStatus; label: string; accent: string }[] = [
  { key: "Draft", label: "New Leads", accent: "bg-brand" },
  { key: "Submitted", label: "Requires Attention", accent: "bg-amber-500" },
  { key: "In Review", label: "In Progress", accent: "bg-sky-500" },
  { key: "Completed", label: "Complete", accent: "bg-emerald-500" },
];

export default function CommercialProjects() {
  const navigate = useNavigate();
  const projects = useProjects();
  const { goHome } = useCustomer();
  const [q, setQ] = useState("");

  const branchProjects = useMemo(
    () => projects.filter((p) => p.branchId === currentUserBranch.id),
    [projects]
  );

  const visible = useMemo(() => {
    if (!q.trim()) return branchProjects;
    const needle = q.toLowerCase();
    return branchProjects.filter((p) =>
      p.name.toLowerCase().includes(needle) ||
      p.id.toLowerCase().includes(needle) ||
      p.siteAddress.toLowerCase().includes(needle)
    );
  }, [branchProjects, q]);

  const grouped = useMemo(() => {
    const map: Record<ProjectStatus, CommercialProject[]> = { Draft: [], Submitted: [], "In Review": [], Completed: [] };
    for (const p of visible) map[p.status].push(p);
    for (const k of Object.keys(map) as ProjectStatus[]) {
      map[k].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    }
    return map;
  }, [visible]);

  const customerName = (id: string) => customers.find((c) => c.id === id)?.name ?? "—";

  return (
    <div className="max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={goHome}>
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Dashboard
          </Button>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Commercial Projects</h1>
            <p className="text-xs text-muted-foreground">{currentUserBranch.name} — {branchProjects.length} project{branchProjects.length === 1 ? "" : "s"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects..." className="pl-8 w-64" />
          </div>
          <Button onClick={() => navigate("/commercial-projects/new")}>
            <Plus className="h-4 w-4 mr-1.5" /> Submit Request
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((col) => {
          const items = grouped[col.key];
          return (
            <div key={col.key} className="flex flex-col min-h-[60vh]">
              <div className="flex items-center justify-between px-3 py-2.5 border-b-2 border-border bg-card rounded-t-md">
                <div className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full", col.accent)} />
                  <h2 className="text-sm font-semibold tracking-tight">{col.label}</h2>
                  <Badge variant="secondary" className="text-2xs">{items.length}</Badge>
                </div>
              </div>
              <div className="flex-1 bg-muted/30 rounded-b-md p-2 space-y-2 overflow-y-auto">
                {items.length === 0 && (
                  <div className="text-center text-xs text-muted-foreground py-8">No projects</div>
                )}
                {items.map((p) => (
                  <ProjectCard key={p.id} project={p} customer={p.customerId ? customerName(p.customerId) : null} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProjectCard({ project, customer }: { project: CommercialProject; customer: string | null }) {
  const sub = findSubVertical(project.vertical, project.subVertical)?.label ?? project.subVertical;
  const vert = findVertical(project.vertical)?.label ?? project.vertical;
  return (
    <Card className="overflow-hidden p-3 shadow-sm hover:shadow-md transition-shadow cursor-default">
      <div className="flex items-start justify-between gap-2">
        <span className="font-semibold text-sm leading-snug truncate">{project.name}</span>
        <span className="text-[11px] text-muted-foreground font-mono whitespace-nowrap">#{project.id}</span>
      </div>
      {project.siteAddress && (
        <div className="text-xs text-muted-foreground mt-0.5 truncate">{project.siteAddress}</div>
      )}
      <div className="mt-2 space-y-0.5 text-[11px] text-muted-foreground">
        {customer && <div><span className="font-medium text-foreground/80">Customer:</span> {customer}</div>}
        <div><span className="font-medium text-foreground/80">Bid Date:</span> {project.bidDate ? format(new Date(project.bidDate + "T00:00:00"), "M/d/yyyy") : "N/A"}</div>
        <div><span className="font-medium text-foreground/80">Created:</span> {format(new Date(project.createdAt), "M/d/yyyy")}</div>
        <div><span className="font-medium text-foreground/80">Type:</span> {vert} — {sub}</div>
      </div>
    </Card>
  );
}