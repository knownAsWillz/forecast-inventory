import { PredictionResult } from '@/lib/mlModel';
import { Package, AlertTriangle, TrendingUp, Clock } from 'lucide-react';

interface StatsCardsProps {
  products: PredictionResult[];
}

export default function StatsCards({ products }: StatsCardsProps) {
  const totalProducts = products.length;
  const reorderCount = products.filter(p => p.shouldReorder).length;
  const totalInventory = products.reduce((sum, p) => sum + p.currentInventory, 0);
  const avgLeadTime = Math.round(
    products.reduce((sum, p) => sum + p.daysToReplenish, 0) / products.length
  );

  const stats = [
    {
      label: 'Total Products',
      value: totalProducts,
      icon: Package,
      color: 'primary',
    },
    {
      label: 'Need Reorder',
      value: reorderCount,
      icon: AlertTriangle,
      color: 'destructive',
    },
    {
      label: 'Total Inventory',
      value: totalInventory.toLocaleString(),
      icon: TrendingUp,
      color: 'success',
    },
    {
      label: 'Avg Lead Time',
      value: `${avgLeadTime} days`,
      icon: Clock,
      color: 'accent',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              <div className={`p-2 rounded-lg bg-${stat.color}/10`}>
                <Icon className={`h-5 w-5 text-${stat.color}`} />
              </div>
            </div>
            <div className="text-3xl font-bold text-card-foreground">{stat.value}</div>
          </div>
        );
      })}
    </div>
  );
}
