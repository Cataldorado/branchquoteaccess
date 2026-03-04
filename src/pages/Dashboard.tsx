import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { quotes, branches, formatCurrency, getGMColor, getStatusColor } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

export default function Dashboard() {
  const today = new Date().toISOString().split("T")[0];
  const quotesToday = quotes.filter((q) => q.createdDate === today).length;
  const pendingConversion = quotes.filter((q) => ["Sent", "Negotiating"].includes(q.status)).length;
  const expiringSoon = quotes.filter((q) => {
    const days = Math.ceil((new Date(q.expirationDate).getTime() - Date.now()) / 86400000);
    return days >= 0 && days <= 7 && !["Won", "Lost", "Expired"].includes(q.status);
  }).length;
  const avgGM = Math.round((quotes.reduce((s, q) => s + q.gmPercent, 0) / quotes.length) * 10) / 10;

  // Conversion funnel
  const statusCounts = ["Draft", "Sent", "Negotiating", "Won", "Lost", "Expired"].map((s) => ({
    name: s,
    count: quotes.filter((q) => q.status === s).length,
  }));

  // Branch activity
  const branchData = branches.map((b) => {
    const bQuotes = quotes.filter((q) => q.branchId === b.id);
    const avgGm = bQuotes.length > 0 ? Math.round((bQuotes.reduce((s, q) => s + q.gmPercent, 0) / bQuotes.length) * 10) / 10 : 0;
    return {
      name: b.name,
      quotes: bQuotes.length,
      won: bQuotes.filter((q) => q.status === "Won").length,
      avgGM: avgGm,
      totalValue: bQuotes.reduce((s, q) => s + q.totalAmount, 0),
    };
  });

  // GM trend (mock weekly data)
  const gmTrend = [
    { week: "W1", gm: 22.1 }, { week: "W2", gm: 23.5 }, { week: "W3", gm: 21.8 },
    { week: "W4", gm: 24.2 }, { week: "W5", gm: 25.1 }, { week: "W6", gm: avgGM },
  ];

  const COLORS = ["hsl(220, 14%, 80%)", "hsl(217, 91%, 50%)", "hsl(38, 92%, 50%)", "hsl(142, 71%, 45%)", "hsl(220, 14%, 70%)", "hsl(0, 72%, 51%)"];

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Quotes Today", value: quotesToday, sub: "created" },
          { label: "Pending Conversion", value: pendingConversion, sub: "quotes" },
          { label: "Expiring Soon", value: expiringSoon, sub: "within 7 days" },
          { label: "Avg GM%", value: `${avgGM}%`, sub: "across all quotes" },
        ].map((kpi) => (
          <Card key={kpi.label} className="p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{kpi.label}</div>
            <div className="text-2xl font-semibold font-mono mt-1">{kpi.value}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{kpi.sub}</div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <h3 className="text-xs font-semibold mb-3">Quote Conversion Funnel</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={statusCounts}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <Bar dataKey="count" fill="hsl(217, 91%, 50%)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-4">
          <h3 className="text-xs font-semibold mb-3">GM% Trend (Weekly)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={gmTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 88%)" />
              <XAxis dataKey="week" tick={{ fontSize: 10 }} />
              <YAxis domain={[15, 30]} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="gm" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Branch Activity */}
      <Card>
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm font-semibold">Branch Activity</CardTitle>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-8 px-3">Branch</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-8 px-3 text-right">Quotes</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-8 px-3 text-right">Won</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-8 px-3 text-right">Avg GM%</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-8 px-3 text-right">Total Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {branchData.map((b) => (
              <TableRow key={b.name}>
                <TableCell className="px-3 py-2 text-xs font-medium">{b.name}</TableCell>
                <TableCell className="px-3 py-2 text-xs text-right font-mono">{b.quotes}</TableCell>
                <TableCell className="px-3 py-2 text-xs text-right font-mono">{b.won}</TableCell>
                <TableCell className="px-3 py-2 text-xs text-right">
                  <span className={`font-semibold font-mono ${getGMColor(b.avgGM)}`}>{b.avgGM}%</span>
                </TableCell>
                <TableCell className="px-3 py-2 text-xs text-right font-mono">{formatCurrency(b.totalValue)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
