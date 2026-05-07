import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, FileText, Upload, X, CheckCircle2, Save, CalendarIcon, Search } from "lucide-react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { DynamicForm } from "@/components/projectFlow/DynamicForm";
import { cn } from "@/lib/utils";
import {
  VERTICALS, findVertical, findSubVertical,
  projectFlowStore, useProjectTemplates,
  type ProjectFile, type ProjectVisibility,
} from "@/data/projectFlow";
import { customers, currentUserBranch, type Customer } from "@/data/mockData";

const STEPS = ["Project Information", "Project Type", "Specifications", "Templates", "Review"];
const TOTAL = STEPS.length;

interface Draft {
  visibility: ProjectVisibility | "";
  customerIds: string[];
  name: string;
  siteAddress: string;
  bidDate: string;
  notes: string;
  files: ProjectFile[];
  vertical: string;
  subVertical: string;
  specs: Record<string, any>;
}

const emptyDraft: Draft = {
  visibility: "", customerIds: [], name: "", siteAddress: "",
  bidDate: "", notes: "", files: [], vertical: "", subVertical: "", specs: {},
};

export default function CommercialProjectNew() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [saveTplOpen, setSaveTplOpen] = useState(false);
  const [tplName, setTplName] = useState("");

  const templates = useProjectTemplates();
  const upd = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));

  const v = findVertical(draft.vertical);
  const sv = findSubVertical(draft.vertical, draft.subVertical);
  const verticalTemplates = useMemo(
    () => templates.filter((t) => t.vertical === draft.vertical && t.subVertical === draft.subVertical),
    [templates, draft.vertical, draft.subVertical]
  );

  const canAdvance = useMemo(() => {
    if (step === 1) {
      if (!draft.visibility) return false;
      if (draft.visibility === "private" && draft.customerIds.length === 0) return false;
      return !!draft.name && !!draft.bidDate;
    }
    if (step === 2) return !!draft.vertical && !!draft.subVertical;
    return true;
  }, [step, draft]);

  const handleNext = () => setStep(Math.min(step + 1, TOTAL));
  const handleSubmit = () => {
    const project = projectFlowStore.addProject({
      name: draft.name,
      visibility: (draft.visibility || "private") as ProjectVisibility,
      customerId: draft.customerIds[0] ?? "",
      customerIds: draft.customerIds,
      siteAddress: draft.siteAddress,
      bidDate: draft.bidDate,
      notes: draft.notes,
      files: draft.files,
      vertical: draft.vertical,
      subVertical: draft.subVertical,
      specs: draft.specs,
      status: "Submitted",
      createdBy: "u_rep1",
      branchId: currentUserBranch.id,
    });
    setSubmittedId(project.id);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const list: ProjectFile[] = Array.from(files).map((f) => ({ name: f.name, size: f.size, type: f.type }));
    upd({ files: [...draft.files, ...list] });
  };

  if (submittedId) return <Confirmation projectId={submittedId} onBack={() => navigate("/commercial-projects")} />;

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/commercial-projects" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4">
        <ArrowLeft className="h-3.5 w-3.5" /> Cancel and return to projects
      </Link>

      <h1 className="text-2xl font-semibold tracking-tight mb-1">New Project Intake</h1>
      <p className="text-sm text-muted-foreground mb-6">Step {step} of {TOTAL} — {STEPS[step - 1]}</p>

      <div className="grid gap-2 mb-6" style={{ gridTemplateColumns: `repeat(${TOTAL}, minmax(0, 1fr))` }}>
        {STEPS.map((s, i) => {
          const idx = i + 1;
          const done = idx < step;
          const active = idx === step;
          return (
            <button
              key={s}
              onClick={() => idx < step && setStep(idx)}
              className={cn(
                "text-left rounded-md border p-2.5 transition-colors",
                done && "border-emerald-500/40 bg-emerald-500/5",
                active && "border-brand bg-brand/5",
                !done && !active && "border-border bg-card"
              )}
            >
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <span className={cn(
                  "h-5 w-5 rounded-full flex items-center justify-center text-[10px]",
                  done && "bg-emerald-500 text-white",
                  active && "bg-brand text-brand-foreground",
                  !done && !active && "bg-muted text-muted-foreground"
                )}>
                  {done ? <Check className="h-3 w-3" /> : idx}
                </span>
                <span className="truncate">{s}</span>
              </div>
            </button>
          );
        })}
      </div>

      <Card className="p-6 mb-4">
        {step === 1 && <StepInfo draft={draft} upd={upd} onFiles={handleFiles} />}
        {step === 2 && <StepVertical draft={draft} upd={upd} />}
        {step === 3 && (
          <StepSpecs
            draft={draft} upd={upd}
            templates={verticalTemplates}
            onSaveTemplate={() => setSaveTplOpen(true)}
          />
        )}
        {step === 4 && <StepTemplates draft={draft} templates={verticalTemplates} onSaveTemplate={() => setSaveTplOpen(true)} />}
        {step === 5 && <StepReview draft={draft} onJump={setStep} />}
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
        </Button>
        {step < TOTAL ? (
          <Button onClick={handleNext} disabled={!canAdvance}>Next <ArrowRight className="h-4 w-4 ml-1.5" /></Button>
        ) : (
          <Button onClick={handleSubmit}>Submit Project <Check className="h-4 w-4 ml-1.5" /></Button>
        )}
      </div>

      <Dialog open={saveTplOpen} onOpenChange={setSaveTplOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Save as template</DialogTitle></DialogHeader>
          <div className="space-y-2">
            <Label>Template name</Label>
            <Input value={tplName} onChange={(e) => setTplName(e.target.value)} placeholder={`${v?.label ?? ""} — ${sv?.label ?? ""}`} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveTplOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              if (!tplName.trim() || !v || !sv) return;
              projectFlowStore.addTemplate({ name: tplName.trim(), vertical: draft.vertical, subVertical: draft.subVertical, values: { ...draft.specs }, createdBy: "u_rep1" });
              setTplName("");
              setSaveTplOpen(false);
            }}>Save Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StepInfo({ draft, upd, onFiles }: { draft: Draft; upd: (p: Partial<Draft>) => void; onFiles: (f: FileList | null) => void }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Project Information</h2>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label className="mb-2 block">Visibility <span className="text-destructive">*</span></Label>
          <RadioGroup
            value={draft.visibility}
            onValueChange={(val) => upd({ visibility: val as ProjectVisibility, customerIds: val === "public" ? [] : draft.customerIds })}
            className="flex gap-6"
          >
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <RadioGroupItem value="public" /> Public
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <RadioGroupItem value="private" /> Private
            </label>
          </RadioGroup>
        </div>

        {draft.visibility === "private" && (
          <div className="md:col-span-2">
            <Label className="mb-1.5 block">Customers <span className="text-destructive">*</span></Label>
            <CustomerMultiSelect
              selected={draft.customerIds}
              onChange={(ids) => upd({ customerIds: ids })}
            />
          </div>
        )}

        <div className="md:col-span-2">
          <Field label="Project name" required>
            <Input value={draft.name} onChange={(e) => upd({ name: e.target.value })} placeholder="e.g. HQ Roof Replacement" />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field label="Site address">
            <Input value={draft.siteAddress} onChange={(e) => upd({ siteAddress: e.target.value })} placeholder="Street, City, State" />
          </Field>
        </div>

        <Field label="Bid date" required>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !draft.bidDate && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {draft.bidDate ? format(new Date(draft.bidDate + "T00:00:00"), "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={draft.bidDate ? new Date(draft.bidDate + "T00:00:00") : undefined}
                onSelect={(d) => upd({ bidDate: d ? d.toISOString().slice(0, 10) : "" })}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </Field>

        <div className="md:col-span-2">
          <Field label="Project Information">
            <Textarea rows={4} value={draft.notes} onChange={(e) => upd({ notes: e.target.value })} placeholder="Brief description, scope, constraints, site conditions..." />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Label className="mb-1.5 block">Attachments (PDF, images, CAD)</Label>
          <label className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-brand/50 transition-colors">
            <Upload className="h-6 w-6 text-muted-foreground" />
            <div className="text-sm font-medium">Drop files or click to browse</div>
            <div className="text-xs text-muted-foreground">Mock upload — files are tracked but not stored</div>
            <input type="file" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
          </label>
          {draft.files.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {draft.files.map((f, i) => (
                <li key={i} className="flex items-center justify-between p-2 bg-muted/40 rounded-md text-sm">
                  <span className="flex items-center gap-2"><FileText className="h-4 w-4" /> {f.name} <span className="text-muted-foreground">({Math.round(f.size/1024)} KB)</span></span>
                  <button onClick={() => upd({ files: draft.files.filter((_, j) => j !== i) })}><X className="h-4 w-4 text-muted-foreground hover:text-foreground" /></button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function CustomerMultiSelect({ selected, onChange }: { selected: string[]; onChange: (ids: string[]) => void }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return customers;
    return customers.filter((c: Customer) =>
      c.name.toLowerCase().includes(needle) ||
      c.accountNumber.toLowerCase().includes(needle) ||
      c.contactEmail.toLowerCase().includes(needle));
  }, [q]);
  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  };
  const selectedList = customers.filter((c) => selected.includes(c.id));
  return (
    <div className="space-y-3">
      {selectedList.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedList.map((c) => (
            <span key={c.id} className="inline-flex items-center gap-1 rounded-full bg-brand/10 text-brand text-xs font-medium px-2.5 py-1">
              {c.name}
              <button onClick={() => toggle(c.id)} className="hover:text-brand/70"><X className="h-3 w-3" /></button>
            </span>
          ))}
        </div>
      )}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search customers by name, account, or email..." className="pl-8" />
      </div>
      <div className="border rounded-md max-h-60 overflow-y-auto divide-y">
        {filtered.length === 0 && <div className="p-3 text-sm text-muted-foreground">No customers match.</div>}
        {filtered.map((c) => {
          const checked = selected.includes(c.id);
          return (
            <label key={c.id} className="flex items-center gap-3 p-2.5 hover:bg-muted/40 cursor-pointer">
              <Checkbox checked={checked} onCheckedChange={() => toggle(c.id)} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{c.name}</div>
                <div className="text-xs text-muted-foreground truncate">{c.accountNumber} · {c.contactEmail}</div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function StepVertical({ draft, upd }: { draft: Draft; upd: (p: Partial<Draft>) => void }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-1">Choose Division</h2>
      <p className="text-sm text-muted-foreground mb-4">Select the primary service area for this project.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {VERTICALS.map((v) => (
          <button
            key={v.key}
            onClick={() => upd({ vertical: v.key, subVertical: "", specs: {} })}
            className={cn(
              "border rounded-lg p-4 text-left transition-all",
              draft.vertical === v.key ? "border-brand bg-brand/5 ring-1 ring-brand" : "border-border hover:border-brand/50"
            )}
          >
            <div className="text-2xl mb-1">{v.icon}</div>
            <div className="font-semibold">{v.label}</div>
            <div className="text-xs text-muted-foreground">{v.description}</div>
          </button>
        ))}
      </div>

      {draft.vertical && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-3">Job Type</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {findVertical(draft.vertical)!.subVerticals.map((sv) => (
              <button
                key={sv.key}
                onClick={() => upd({ subVertical: sv.key, specs: {} })}
                className={cn(
                  "border rounded-lg p-4 text-left transition-all",
                  draft.subVertical === sv.key ? "border-brand bg-brand/5 ring-1 ring-brand" : "border-border hover:border-brand/50"
                )}
              >
                <div className="text-2xl mb-1">{sv.icon ?? "🔧"}</div>
                <div className="font-semibold text-sm">{sv.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StepSpecs({ draft, upd, templates, onSaveTemplate }: { draft: Draft; upd: (p: Partial<Draft>) => void; templates: any[]; onSaveTemplate: () => void }) {
  const sv = findSubVertical(draft.vertical, draft.subVertical);
  if (!sv) return <p className="text-muted-foreground">Select a vertical first.</p>;
  return (
    <div>
      <div className="flex items-end justify-between gap-3 mb-5 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold">{sv.label} Specifications</h2>
          <p className="text-sm text-muted-foreground">Fields adapt to the selected job type.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value="" onValueChange={(id) => {
            const t = templates.find((x) => x.id === id);
            if (t) upd({ specs: { ...t.values } });
          }}>
            <SelectTrigger className="w-56"><SelectValue placeholder={templates.length ? "Load template..." : "No templates"} /></SelectTrigger>
            <SelectContent>
              {templates.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={onSaveTemplate}>
            <Save className="h-4 w-4 mr-1.5" /> Save as template
          </Button>
        </div>
      </div>
      {sv.fields.length === 0 ? (
        <div>
          <Label className="mb-1.5 block">Specification notes</Label>
          <Textarea rows={6} value={draft.specs.notes ?? ""} onChange={(e) => upd({ specs: { ...draft.specs, notes: e.target.value } })} placeholder="Describe the design requirements, materials, slope, R-value, etc." />
        </div>
      ) : (
        <DynamicForm fields={sv.fields} values={draft.specs} onChange={(v) => upd({ specs: v })} />
      )}
    </div>
  );
}

function StepTemplates({ draft, templates, onSaveTemplate }: { draft: Draft; templates: any[]; onSaveTemplate: () => void }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-1">Templates</h2>
      <p className="text-sm text-muted-foreground mb-4">Save your specifications as a reusable template, or skip to review.</p>
      <Button onClick={onSaveTemplate}><Save className="h-4 w-4 mr-1.5" /> Save current spec as template</Button>

      <div className="mt-6">
        <h3 className="text-sm font-semibold mb-2">Existing templates for this sub-vertical</h3>
        {templates.length === 0 && <p className="text-sm text-muted-foreground">None yet.</p>}
        <ul className="space-y-2">
          {templates.map((t) => (
            <li key={t.id} className="flex items-center justify-between p-3 border rounded-md">
              <span className="text-sm font-medium">{t.name}</span>
              <button onClick={() => projectFlowStore.deleteTemplate(t.id)} className="text-xs text-destructive hover:underline">Delete</button>
            </li>
          ))}
        </ul>
      </div>
      <input type="hidden" value={draft.vertical} readOnly />
    </div>
  );
}

function StepReview({ draft, onJump }: { draft: Draft; onJump: (n: number) => void }) {
  const v = findVertical(draft.vertical);
  const sv = findSubVertical(draft.vertical, draft.subVertical);
  const visibleSpecs = sv?.fields.filter((f) => !f.showIf || draft.specs[f.showIf.key] === f.showIf.equals) ?? [];
  const selectedCustomers = customers.filter((c) => draft.customerIds.includes(c.id));
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold">Review & Submit</h2>
      <Section title="Project Information" onEdit={() => onJump(1)}>
        <Row k="Visibility" v={draft.visibility ? draft.visibility.charAt(0).toUpperCase() + draft.visibility.slice(1) : "—"} />
        <Row k="Customers" v={draft.visibility === "private" ? (selectedCustomers.map((c) => c.name).join(", ") || "—") : "Public — assigned after submission"} />
        <Row k="Name" v={draft.name} />
        <Row k="Site address" v={draft.siteAddress || "—"} />
        <Row k="Bid date" v={draft.bidDate ? format(new Date(draft.bidDate + "T00:00:00"), "PPP") : "—"} />
        <Row k="Notes" v={draft.notes || "—"} />
        <Row k="Files" v={draft.files.length ? `${draft.files.length} attached` : "None"} />
      </Section>
      <Section title="Vertical" onEdit={() => onJump(2)}>
        <Row k="Vertical" v={v?.label ?? "—"} />
        <Row k="Sub-vertical" v={sv?.label ?? "—"} />
      </Section>
      <Section title="Specifications" onEdit={() => onJump(3)}>
        {visibleSpecs.length === 0 && (
          <Row k="Notes" v={draft.specs.notes ? String(draft.specs.notes) : "—"} />
        )}
        {visibleSpecs.map((f) => {
          const raw = draft.specs[f.key];
          const display = f.options?.find((o) => o.value === raw)?.label ?? (raw ?? "—");
          return <Row key={f.key} k={f.label} v={String(display)} />;
        })}
      </Section>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}

function Section({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div className="border rounded-md p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">{title}</h3>
        <button onClick={onEdit} className="text-sm text-brand hover:underline">Edit</button>
      </div>
      <div className="space-y-1 text-sm">{children}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <span className="text-muted-foreground">{k}</span>
      <span className="col-span-2">{v}</span>
    </div>
  );
}

function Confirmation({ projectId, onBack }: { projectId: string; onBack: () => void }) {
  return (
    <div className="max-w-2xl mx-auto py-12 text-center">
      <div className="mx-auto h-14 w-14 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center mb-4">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">Project submitted</h1>
      <p className="text-muted-foreground mt-2">Your project has been submitted for review.</p>
      <Card className="p-5 mt-6 text-left">
        <div className="text-sm text-muted-foreground">Project ID</div>
        <div className="font-mono font-semibold">{projectId}</div>
      </Card>
      <div className="mt-6 flex gap-3 justify-center">
        <Button onClick={onBack}>Back to Projects</Button>
      </div>
    </div>
  );
}