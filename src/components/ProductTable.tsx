import { useState, useMemo } from 'react';
import { PredictionResult } from '@/lib/mlModel';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface ProductTableProps {
  products: PredictionResult[];
}

type SortField = 'title' | 'currentInventory' | 'avgSalesPerWeek' | 'daysToReplenish' | 'shouldReorder';
type SortDirection = 'asc' | 'desc';

export default function ProductTable({ products }: ProductTableProps) {
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      let compareValue = 0;

      switch (sortField) {
        case 'title':
          compareValue = a.title.localeCompare(b.title);
          break;
        case 'currentInventory':
          compareValue = a.currentInventory - b.currentInventory;
          break;
        case 'avgSalesPerWeek':
          compareValue = a.avgSalesPerWeek - b.avgSalesPerWeek;
          break;
        case 'daysToReplenish':
          compareValue = a.daysToReplenish - b.daysToReplenish;
          break;
        case 'shouldReorder':
          compareValue = (a.shouldReorder ? 1 : 0) - (b.shouldReorder ? 1 : 0);
          break;
      }

      return sortDirection === 'asc' ? compareValue : -compareValue;
    });
  }, [products, sortField, sortDirection]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortDirection === 'asc' ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('title')}
                  className="flex items-center font-semibold text-card-foreground hover:text-primary transition-colors"
                >
                  Product Name
                  <SortIcon field="title" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('currentInventory')}
                  className="flex items-center font-semibold text-card-foreground hover:text-primary transition-colors"
                >
                  Inventory
                  <SortIcon field="currentInventory" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('avgSalesPerWeek')}
                  className="flex items-center font-semibold text-card-foreground hover:text-primary transition-colors"
                >
                  Avg Sales/Week
                  <SortIcon field="avgSalesPerWeek" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('daysToReplenish')}
                  className="flex items-center font-semibold text-card-foreground hover:text-primary transition-colors"
                >
                  Lead Time (Days)
                  <SortIcon field="daysToReplenish" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('shouldReorder')}
                  className="flex items-center font-semibold text-card-foreground hover:text-primary transition-colors"
                >
                  Recommendation
                  <SortIcon field="shouldReorder" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedProducts.map((product) => (
              <tr
                key={product.id}
                className={`transition-colors hover:bg-muted/30 ${
                  product.shouldReorder ? 'bg-destructive/5' : ''
                }`}
              >
                <td className="px-6 py-4">
                  <span className="font-medium text-card-foreground">{product.title}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-card-foreground">{product.currentInventory}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-card-foreground">{product.avgSalesPerWeek}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-card-foreground">{product.daysToReplenish}</span>
                </td>
                <td className="px-6 py-4">
                  {product.shouldReorder ? (
                    <Badge variant="destructive" className="font-semibold">
                      Reorder Now
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="font-semibold">
                      Stock OK
                    </Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
