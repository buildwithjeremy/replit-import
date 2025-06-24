import { Rep } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';

interface FunnelChartProps {
  reps?: Rep[];
  data?: Array<{ stage: string; count: number }>;
}

export default function FunnelChart({ reps, data }: FunnelChartProps) {
  const getFunnelData = () => {
    // If data is provided directly, use it
    if (data) {
      const maxCount = Math.max(...data.map(item => item.count));
      return data.map(stage => ({
        name: stage.stage,
        count: stage.count,
        percentage: maxCount > 0 ? Math.round((stage.count / maxCount) * 100) : 0,
        color: getColorForStage(stage.stage)
      }));
    }

    // Otherwise, calculate from reps (existing logic)
    if (!reps) return [];
    
    const stages = [
      { name: 'Steps 1-3: Onboarding', range: [1, 3], color: 'bg-primary-500' },
      { name: 'Steps 4-7: Field Training', range: [4, 7], color: 'bg-accent-500' },
      { name: 'Steps 8-13: Independence', range: [8, 13], color: 'bg-secondary-500' },
    ];

    return stages.map(stage => {
      const count = reps.filter(rep => 
        rep.stage >= stage.range[0] && rep.stage <= stage.range[1]
      ).length;
      
      const maxCount = Math.max(...stages.map(s => 
        reps.filter(rep => rep.stage >= s.range[0] && rep.stage <= s.range[1]).length
      ));
      
      const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
      
      return {
        ...stage,
        count,
        percentage: Math.round(percentage)
      };
    });
  };

  const getColorForStage = (stage: string) => {
    switch (stage) {
      case 'Onboarding':
        return 'bg-primary-500';
      case 'Field Training':
        return 'bg-accent-500';
      case 'Advanced':
        return 'bg-secondary-500';
      case 'Independence':
        return 'bg-purple-500';
      case 'Graduated':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const funnelData = getFunnelData();

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
      <CardContent className="p-6">
        <h3 className="font-heading font-semibold text-gray-900 mb-4">
          Training Funnel
        </h3>
        <div className="space-y-3">
          {funnelData.map((stage, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 ${stage.color} rounded-full`} />
                <span className="text-sm font-medium text-gray-700">
                  {stage.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${stage.color} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${stage.percentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-8">
                  {stage.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
