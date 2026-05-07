// Commercial Projects (Project Flow) data, types, and lightweight in-memory store.
// Mirrors the Project Flow project so the Submit Request workflow behaves identically.
import { useSyncExternalStore } from "react";

export type ProjectStatus = "Draft" | "Submitted" | "In Review" | "Completed";
export type ProjectVisibility = "public" | "private";

export interface ProjectFile { name: string; size: number; type: string }

export interface CommercialProject {
  id: string;
  name: string;
  visibility: ProjectVisibility;
  customerId: string;
  customerIds: string[];
  siteAddress: string;
  bidDate: string;
  notes: string;
  files: ProjectFile[];
  vertical: string;
  subVertical: string;
  specs: Record<string, any>;
  status: ProjectStatus;
  createdAt: string;
  createdBy: string;
  branchId: string;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  vertical: string;
  subVertical: string;
  values: Record<string, any>;
  createdBy: string;
}

// ---- Verticals ----
export type FieldType = "text" | "number" | "select" | "radio" | "checkbox" | "textarea";
export interface FieldOption { label: string; value: string }
export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  options?: FieldOption[];
  placeholder?: string;
  showIf?: { key: string; equals: string | number | boolean };
}
export interface SubVertical { key: string; label: string; icon?: string; fields: FieldDef[] }
export interface Vertical { key: string; label: string; description: string; icon: string; subVerticals: SubVertical[] }

const sharedFields: FieldDef[] = [
  { key: "squareFootage", label: "Approx. square footage", type: "number", placeholder: "e.g. 2400" },
  { key: "urgency", label: "Urgency", type: "select", options: [
    { label: "Standard", value: "standard" }, { label: "Expedited", value: "expedited" }, { label: "Emergency", value: "emergency" },
  ]},
  { key: "scopeNotes", label: "Scope notes", type: "textarea", placeholder: "Describe scope, constraints, site conditions..." },
];

export const VERTICALS: Vertical[] = [
  {
    key: "landscaping", label: "Landscaping", description: "Irrigation, hardscapes, build-outs", icon: "🌿",
    subVerticals: [
      { key: "irrigation", label: "Irrigation", icon: "💦", fields: [
        { key: "zoneCount", label: "Zone count", type: "number", placeholder: "e.g. 8" },
        { key: "waterSource", label: "Water source", type: "radio", options: [
          { label: "Municipal", value: "municipal" }, { label: "Well", value: "well" }, { label: "Reclaimed", value: "reclaimed" },
        ]},
        { key: "controllerBrand", label: "Controller brand preference", type: "select", options: [
          { label: "No preference", value: "none" }, { label: "Hunter", value: "hunter" }, { label: "Rain Bird", value: "rainbird" }, { label: "Rachio", value: "rachio" }, { label: "Toro", value: "toro" },
        ]},
        { key: "deliveryType", label: "Delivery type", type: "radio", options: [
          { label: "Drip", value: "drip" }, { label: "Spray", value: "spray" }, { label: "Mixed", value: "mixed" },
        ]},
        { key: "existingSystem", label: "Existing system on site?", type: "radio", options: [
          { label: "Yes", value: "yes" }, { label: "No", value: "no" },
        ]},
        { key: "existingCondition", label: "Existing system condition", type: "select",
          showIf: { key: "existingSystem", equals: "yes" },
          options: [
            { label: "Good — minor updates", value: "good" }, { label: "Fair — partial replacement", value: "fair" }, { label: "Poor — full replacement", value: "poor" },
          ]},
      ]},
      { key: "landscape-construction", label: "Landscape Construction", icon: "🌳", fields: sharedFields },
      { key: "hardscapes", label: "Hardscapes", icon: "🧱", fields: sharedFields },
    ],
  },
  {
    key: "roofing", label: "Roofing", description: "Residential & commercial roofing", icon: "🏠",
    subVerticals: [
      { key: "tapered-design", label: "Tapered Design", icon: "📐", fields: [] },
      { key: "residential-roofing", label: "Residential Roofing", icon: "🏡", fields: sharedFields },
      { key: "commercial-roofing", label: "Commercial Roofing", icon: "🏢", fields: [
        { key: "roofType", label: "Roof type", type: "radio", options: [
          { label: "Flat", value: "flat" }, { label: "Pitched", value: "pitched" }, { label: "Both", value: "both" },
        ]},
        { key: "material", label: "Material preference", type: "select", options: [
          { label: "TPO", value: "tpo" }, { label: "EPDM", value: "epdm" }, { label: "Metal", value: "metal" }, { label: "Modified Bitumen", value: "modbit" },
        ]},
        { key: "squareFootage", label: "Square footage", type: "number", placeholder: "e.g. 12000" },
        { key: "tearOffLayers", label: "Layers to tear off", type: "number", placeholder: "0–3" },
        { key: "deckingCondition", label: "Decking condition", type: "select", options: [
          { label: "Sound", value: "sound" }, { label: "Partial replacement", value: "partial" }, { label: "Full replacement", value: "full" }, { label: "Unknown", value: "unknown" },
        ]},
      ]},
    ],
  },
  {
    key: "hvac", label: "HVAC", description: "Heating, cooling, ventilation", icon: "❄️",
    subVerticals: [
      { key: "new-install", label: "New Install", icon: "🛠️", fields: sharedFields },
      { key: "replacement", label: "Replacement", icon: "🔄", fields: [
        { key: "systemType", label: "System type", type: "radio", options: [
          { label: "Split", value: "split" }, { label: "Package", value: "package" }, { label: "Mini-split", value: "mini" },
        ]},
        { key: "tonnage", label: "Tonnage", type: "number", placeholder: "e.g. 3" },
        { key: "fuelSource", label: "Fuel source", type: "select", options: [
          { label: "Electric", value: "electric" }, { label: "Natural gas", value: "natgas" }, { label: "Propane", value: "propane" }, { label: "Heat pump", value: "heatpump" },
        ]},
        { key: "equipmentAge", label: "Existing equipment age (years)", type: "number", placeholder: "e.g. 14" },
        { key: "ductworkIncluded", label: "Ductwork included?", type: "radio", options: [
          { label: "Yes", value: "yes" }, { label: "No", value: "no" },
        ]},
        { key: "ductCondition", label: "Duct condition", type: "select",
          showIf: { key: "ductworkIncluded", equals: "yes" },
          options: [
            { label: "Reuse existing", value: "reuse" }, { label: "Partial replace", value: "partial" }, { label: "Full replace", value: "full" },
          ]},
      ]},
      { key: "maintenance", label: "Maintenance", icon: "🧰", fields: sharedFields },
    ],
  },
  {
    key: "drywall", label: "Drywall", description: "New construction & repairs", icon: "🧱",
    subVerticals: [
      { key: "new-construction", label: "New Construction", icon: "🏗️", fields: sharedFields },
      { key: "repair-patch", label: "Repair & Patch", icon: "🩹", fields: sharedFields },
    ],
  },
  {
    key: "pool-spa", label: "Pool & Spa", description: "Pools, spas, renovations", icon: "💧",
    subVerticals: [
      { key: "new-pool", label: "New Pool", icon: "🏊", fields: sharedFields },
      { key: "renovation", label: "Renovation", icon: "🛁", fields: sharedFields },
      { key: "spa-only", label: "Spa Only", icon: "♨️", fields: sharedFields },
    ],
  },
];

export function findVertical(key?: string) {
  return VERTICALS.find(v => v.key === key);
}
export function findSubVertical(vKey?: string, sKey?: string) {
  return findVertical(vKey)?.subVerticals.find(s => s.key === sKey);
}

// ---- Store ----
const now = Date.now();
const day = 86400000;
const iso = (d: number) => new Date(d).toISOString().slice(0, 10);

let projects: CommercialProject[] = [
  { id: "p_1001", name: "HQ Roof Replacement", visibility: "private", customerId: "C004", customerIds: ["C004"], siteAddress: "750 Summit Pkwy, Westminster, CO", bidDate: iso(now + 14*day), notes: "Replace aging TPO membrane.", files: [], vertical: "roofing", subVertical: "commercial-roofing", specs: { roofType: "flat", material: "tpo", squareFootage: 14000, tearOffLayers: 1, deckingCondition: "partial" }, status: "In Review", createdAt: new Date(now - 6*day).toISOString(), createdBy: "u_rep1", branchId: "BR001" },
  { id: "p_1002", name: "Lobby HVAC Refresh", visibility: "private", customerId: "C002", customerIds: ["C002"], siteAddress: "890 Industrial Blvd, Boulder, CO", bidDate: iso(now + 30*day), notes: "Replace 2 RTUs.", files: [], vertical: "hvac", subVertical: "replacement", specs: { systemType: "package", tonnage: 5, fuelSource: "electric", equipmentAge: 16 }, status: "Submitted", createdAt: new Date(now - 3*day).toISOString(), createdBy: "u_rep1", branchId: "BR001" },
  { id: "p_1003", name: "Courtyard Irrigation Retrofit", visibility: "public", customerId: "", customerIds: [], siteAddress: "1420 Market St, Denver, CO", bidDate: iso(now + 21*day), notes: "Convert spray to drip.", files: [], vertical: "landscaping", subVertical: "irrigation", specs: { zoneCount: 6, waterSource: "municipal", controllerBrand: "rachio", deliveryType: "drip", existingSystem: "yes", existingCondition: "fair" }, status: "Draft", createdAt: new Date(now - 1*day).toISOString(), createdBy: "u_rep1", branchId: "BR001" },
  { id: "p_1004", name: "Westminster Park Hardscapes", visibility: "private", customerId: "C001", customerIds: ["C001"], siteAddress: "1420 Market St, Denver, CO", bidDate: iso(now + 10*day), notes: "Patio + walkway pavers.", files: [], vertical: "landscaping", subVertical: "hardscapes", specs: { squareFootage: 3200, urgency: "standard" }, status: "Submitted", createdAt: new Date(now - 4*day).toISOString(), createdBy: "u_rep1", branchId: "BR001" },
  { id: "p_1005", name: "Office Drywall Repair", visibility: "private", customerId: "C004", customerIds: ["C004"], siteAddress: "750 Summit Pkwy, Westminster, CO", bidDate: iso(now + 7*day), notes: "Patch + paint.", files: [], vertical: "drywall", subVertical: "repair-patch", specs: { squareFootage: 200, urgency: "expedited" }, status: "Completed", createdAt: new Date(now - 30*day).toISOString(), createdBy: "u_rep1", branchId: "BR001" },
];

let templates: ProjectTemplate[] = [
  { id: "t_1", name: "Standard Drip Retrofit (Small Lot)", vertical: "landscaping", subVertical: "irrigation", values: { zoneCount: 4, waterSource: "municipal", controllerBrand: "rachio", deliveryType: "drip", existingSystem: "yes", existingCondition: "fair" }, createdBy: "u_rep1" },
  { id: "t_2", name: "Standard Commercial TPO Reroof", vertical: "roofing", subVertical: "commercial-roofing", values: { roofType: "flat", material: "tpo", squareFootage: 10000, tearOffLayers: 1, deckingCondition: "partial" }, createdBy: "u_rep1" },
  { id: "t_3", name: "Light Commercial Package Replace", vertical: "hvac", subVertical: "replacement", values: { systemType: "package", tonnage: 5, fuelSource: "electric", equipmentAge: 18, ductworkIncluded: "no" }, createdBy: "u_rep1" },
];

const listeners = new Set<() => void>();
const emit = () => listeners.forEach(l => l());

export const projectFlowStore = {
  getProjects: () => projects,
  getTemplates: () => templates,
  addProject: (p: Omit<CommercialProject, "id" | "createdAt">) => {
    const project: CommercialProject = { ...p, id: `p_${1000 + projects.length + 10}`, createdAt: new Date().toISOString() };
    projects = [...projects, project];
    emit();
    return project;
  },
  addTemplate: (t: Omit<ProjectTemplate, "id">) => {
    const tpl: ProjectTemplate = { ...t, id: `t_${Math.random().toString(36).slice(2, 8)}` };
    templates = [...templates, tpl];
    emit();
    return tpl;
  },
  deleteTemplate: (id: string) => {
    templates = templates.filter(t => t.id !== id);
    emit();
  },
  subscribe: (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; },
};

export function useProjects() {
  return useSyncExternalStore(projectFlowStore.subscribe, projectFlowStore.getProjects);
}
export function useProjectTemplates() {
  return useSyncExternalStore(projectFlowStore.subscribe, projectFlowStore.getTemplates);
}