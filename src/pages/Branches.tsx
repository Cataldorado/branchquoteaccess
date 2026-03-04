import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { branches, quotes, formatCurrency } from "@/data/mockData";

export default function Branches() {
  return (
    <div className="space-y-3">
      <h1 className="text-lg font-semibold">Branches</h1>
      <Card>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-8 px-3">ID</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-8 px-3">Name</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-8 px-3">Region</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-8 px-3 text-right">Quotes</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-8 px-3 text-right">Total Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {branches.map((b) => {
              const bq = quotes.filter((q) => q.branchId === b.id);
              return (
                <TableRow key={b.id}>
                  <TableCell className="px-3 py-2 text-xs font-mono">{b.id}</TableCell>
                  <TableCell className="px-3 py-2 text-xs font-medium">{b.name}</TableCell>
                  <TableCell className="px-3 py-2 text-xs text-muted-foreground">{b.region}</TableCell>
                  <TableCell className="px-3 py-2 text-xs text-right font-mono">{bq.length}</TableCell>
                  <TableCell className="px-3 py-2 text-xs text-right font-mono">{formatCurrency(bq.reduce((s, q) => s + q.totalAmount, 0))}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
