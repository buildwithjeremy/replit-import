
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'neutral';
}

export default function StatsCard({ title, value, icon: Icon, trend, variant = 'primary' }: StatsCardProps) {
  const getVariantClasses = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'text-primary-600';
      case 'secondary':
        return 'text-secondary-600';
      case 'accent':
        return 'text-accent-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Icon className="w-5 h-5 text-gray-500" />
          {trend && (
            <span className="text-xs font-medium text-green-600">{trend}</span>
          )}
        </div>
        <div className={cn(
          "text-2xl font-heading font-bold mb-1",
          getVariantClasses(variant)
        )}>
          {value}
        </div>
        <div className="text-sm text-gray-600">{title}</div>
      </CardContent>
    </Card>
  );
}
