import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import type { FieldDef } from "@/data/projectFlow";

interface Props {
  fields: FieldDef[];
  values: Record<string, any>;
  onChange: (next: Record<string, any>) => void;
}

export function DynamicForm({ fields, values, onChange }: Props) {
  const set = (k: string, v: any) => onChange({ ...values, [k]: v });
  const visible = fields.filter(f => !f.showIf || values[f.showIf.key] === f.showIf.equals);
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {visible.map(f => (
        <div key={f.key} className={f.type === "textarea" ? "md:col-span-2" : ""}>
          <Label className="mb-1.5 block">{f.label}</Label>
          {f.type === "text" && (
            <Input value={values[f.key] ?? ""} placeholder={f.placeholder} onChange={(e) => set(f.key, e.target.value)} />
          )}
          {f.type === "number" && (
            <Input type="number" value={values[f.key] ?? ""} placeholder={f.placeholder} onChange={(e) => set(f.key, e.target.value === "" ? "" : Number(e.target.value))} />
          )}
          {f.type === "textarea" && (
            <Textarea value={values[f.key] ?? ""} placeholder={f.placeholder} onChange={(e) => set(f.key, e.target.value)} rows={4} />
          )}
          {f.type === "select" && (
            <Select value={values[f.key] ?? ""} onValueChange={(v) => set(f.key, v)}>
              <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>
                {f.options?.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
          {f.type === "radio" && (
            <RadioGroup value={values[f.key] ?? ""} onValueChange={(v) => set(f.key, v)} className="flex flex-wrap gap-4 pt-1">
              {f.options?.map(o => (
                <label key={o.value} className="flex items-center gap-2 text-sm cursor-pointer">
                  <RadioGroupItem value={o.value} /> {o.label}
                </label>
              ))}
            </RadioGroup>
          )}
          {f.type === "checkbox" && (
            <div className="flex items-center gap-2 pt-2">
              <Checkbox checked={!!values[f.key]} onCheckedChange={(v) => set(f.key, !!v)} />
              <span className="text-sm">{f.placeholder ?? "Yes"}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}