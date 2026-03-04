import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { customers, quotes } from "@/data/mockData";

export default function Customers() {
  return (
    <div className="space-y-3">
      <h1 className="text-lg font-semibold">Customers</h1>
      <Card>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-8 px-3">Account #</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-8 px-3">Name</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-8 px-3">Email</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-8 px-3">Phone</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-8 px-3 text-right">Quotes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="px-3 py-2 text-xs font-mono">{c.accountNumber}</TableCell>
                <TableCell className="px-3 py-2 text-xs font-medium">{c.name}</TableCell>
                <TableCell className="px-3 py-2 text-xs text-muted-foreground">{c.contactEmail}</TableCell>
                <TableCell className="px-3 py-2 text-xs text-muted-foreground">{c.contactPhone}</TableCell>
                <TableCell className="px-3 py-2 text-xs text-right font-mono">{quotes.filter((q) => q.customerId === c.id).length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
