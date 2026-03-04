import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { quotes, branches, formatCurrency, getGMColor, getStatusColor } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

export default function Dashboard() {
  const today = new Date().toISOString().split("T")[0];
  const quotesToday = quotes.filter((q) => q.createdDate === today).length;
  const pendingConversion = quotes.filter((q) => ["Customer Review", "Sales Review"].includes(q.status)).length;
  const expiringSoon = quotes.filter((q) => {
    const days = Math.ceil((new Date(q.expirationDate).getTime() - Date.now()) / 86400000);
    return days >= 0 && days <= 7 && !["Received (Awarded)", "Received (Not Awarded)", "Expired"].includes(q.status);
  }).length;
  const avgGM = Math.round((quotes.reduce((s, q) => s + q.gmPercent, 0) / quotes.length) * 10) / 10;

  const statusCounts = ["Customer Review", "Sales Review", "Received (Awarded)", "Received (Not Awarded)", "Partial", "Expired", "New", "Partially Released"].map((s) => ({
    name: s,
    count: quotes.filter((q) => q.status === s).length,
  }));

  const branchData = branches.map((b) => {
    const bQuotes = quotes.filter((q) => q.branchId === b.id);
    const avgGm = bQuotes.length > 0 ? Math.round((bQuotes.reduce((s, q) => s + q.gmPercent, 0) / bQuotes.length) * 10) / 10 : 0;
    return {
      name: b.name,
      quotes: bQuotes.length,
      won: bQuotes.filter((q) => q.status === "Received (Awarded)").length,
      avgGM: avgGm,
      totalValue: bQuotes.reduce((s, q) => s + q.totalAmount, 0),
    };
  });

  const gmTrend = [
    { week: "W1", gm: 22.1 }, { week: "W2", gm: 23.5 }, { week: "W3", gm: 21.8 },
    { week: "W4", gm: 24.2 }, { week: "W5", gm: 25.1 }, { week: "W6", gm: avgGM },
  ];

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of quote activity and performance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Quotes Today", value: quotesToday, sub: "created" },
          { label: "Pending Conversion", value: pendingConversion, sub: "quotes" },
          { label: "Expiring Soon", value: expiringSoon, sub: "within 7 days" },
          { label: "Avg GM%", value: `${avgGM}%`, sub: "across all quotes" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card rounded-lg border border-border shadow-subtle p-5">
            <div className="text-2xs uppercase tracking-wider text-muted-foreground font-medium">{kpi.label}</div>
            <div className="text-3xl font-semibold font-mono mt-2 tracking-tight">{kpi.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card rounded-lg border border-border shadow-subtle p-5">
          <h3 className="text-sm font-semibold mb-4">Quote Conversion Funnel</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={statusCounts}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid hsl(220, 13%, 91%)' }} />
              <Bar dataKey="count" fill="hsl(222, 47%, 11%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card rounded-lg border border-border shadow-subtle p-5">
          <h3 className="text-sm font-semibold mb-4">GM% Trend (Weekly)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={gmTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="week" tick={{ fontSize: 10 }} />
              <YAxis domain={[15, 30]} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid hsl(220, 13%, 91%)' }} />
              <Line type="monotone" dataKey="gm" stroke="hsl(160, 84%, 39%)" strokeWidth={2} dot={{ r: 3, fill: "hsl(160, 84%, 39%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Branch Activity */}
      <div className="bg-card rounded-lg border border-border shadow-subtle overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold">Branch Activity</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-2xs uppercase tracking-wider font-medium text-muted-foreground h-10 px-5">Branch</TableHead>
              <TableHead className="text-2xs uppercase tracking-wider font-medium text-muted-foreground h-10 px-5 text-right">Quotes</TableHead>
              <TableHead className="text-2xs uppercase tracking-wider font-medium text-muted-foreground h-10 px-5 text-right">Won</TableHead>
              <TableHead className="text-2xs uppercase tracking-wider font-medium text-muted-foreground h-10 px-5 text-right">Avg GM%</TableHead>
              <TableHead className="text-2xs uppercase tracking-wider font-medium text-muted-foreground h-10 px-5 text-right">Total Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {branchData.map((b) => (
              <TableRow key={b.name} className="hover:bg-muted/30 transition-colors">
                <TableCell className="px-5 py-3 text-sm font-medium">{b.name}</TableCell>
                <TableCell className="px-5 py-3 text-sm text-right font-mono">{b.quotes}</TableCell>
                <TableCell className="px-5 py-3 text-sm text-right font-mono">{b.won}</TableCell>
                <TableCell className="px-5 py-3 text-sm text-right">
                  <span className={`font-semibold font-mono ${getGMColor(b.avgGM)}`}>{b.avgGM}%</span>
                </TableCell>
                <TableCell className="px-5 py-3 text-sm text-right font-mono">{formatCurrency(b.totalValue)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
