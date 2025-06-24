
import { useAppState } from '@/hooks/use-app-state';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Plus, Users, TrendingUp, Award, ChevronRight } from 'lucide-react';
import TopNav from '@/components/navigation/top-nav';
import BottomNav from '@/components/navigation/bottom-nav';
import StatsCard from '@/components/dashboard/stats-card';
import FunnelChart from '@/components/dashboard/funnel-chart';
import RepCard from '@/components/dashboard/rep-card';

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const { state } = useAppState();

  if (!state.isAuthenticated || state.userRole !== 'admin') {
    navigate('/');
    return null;
  }

  // Calculate stats across all trainers and reps
  const totalReps = state.reps.length;
  const activeTrainers = state.trainers.length;
  
  // Handle assignedRepIds safely with type checking
  const avgRepsPerTrainer = state.trainers.length > 0 
    ? Math.round(state.trainers.reduce((sum, trainer) => {
        const repIds = Array.isArray(trainer.assignedRepIds) ? trainer.assignedRepIds : [];
        return sum + repIds.length;
      }, 0) / state.trainers.length)
    : 0;

  const completionRate = totalReps > 0 
    ? Math.round((state.reps.filter(rep => rep.stage >= 13).length / totalReps) * 100)
    : 0;

  // Get recent reps (last 5 updated)
  const recentReps = [...state.reps]
    .sort((a, b) => {
      const dateA = a.updatedAt || new Date(0);
      const dateB = b.updatedAt || new Date(0);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5);

  // Get trainer name for a rep
  const getTrainerName = (repId: string) => {
    const trainer = state.trainers.find(t => {
      const repIds = Array.isArray(t.assignedRepIds) ? t.assignedRepIds : [];
      return repIds.includes(repId);
    });
    return trainer?.name || 'Unassigned';
  };

  // Calculate funnel data
  const funnelData = [
    { stage: 'Onboarding', count: state.reps.filter(r => r.stage <= 3).length },
    { stage: 'Field Training', count: state.reps.filter(r => r.stage > 3 && r.stage <= 7).length },
    { stage: 'Advanced', count: state.reps.filter(r => r.stage > 7 && r.stage <= 10).length },
    { stage: 'Independence', count: state.reps.filter(r => r.stage > 10 && r.stage <= 13).length },
    { stage: 'Graduated', count: state.reps.filter(r => r.stage > 13).length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 sm:pb-6">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 font-body">
            Overview of all field trainers and representatives
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Reps"
            value={totalReps.toString()}
            icon={Users}
            trend="+12%"
          />
          <StatsCard
            title="Active Trainers"
            value={activeTrainers.toString()}
            icon={User}
            trend="+3%"
          />
          <StatsCard
            title="Avg Reps/Trainer"
            value={avgRepsPerTrainer.toString()}
            icon={TrendingUp}
            trend="+8%"
          />
          <StatsCard
            title="Completion Rate"
            value={`${completionRate}%`}
            icon={Award}
            trend="+15%"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Funnel Chart */}
          <Card className="bg-white rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading">Training Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <FunnelChart data={funnelData} />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => navigate('/add-rep')}
                className="w-full justify-start bg-primary-500 hover:bg-primary-600"
              >
                <Plus className="mr-2" size={16} />
                Add New Representative
              </Button>
              <Button
                onClick={() => navigate('/reps')}
                variant="outline"
                className="w-full justify-start"
              >
                <Users className="mr-2" size={16} />
                View All Representatives
              </Button>
              <Button
                onClick={() => navigate('/activity')}
                variant="outline"
                className="w-full justify-start"
              >
                <ChevronRight className="mr-2" size={16} />
                View Activity Log
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reps */}
        <Card className="bg-white rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReps.map((rep) => (
                <RepCard
                  key={rep.id}
                  rep={rep}
                  trainerName={getTrainerName(rep.id)}
                  showTrainer={true}
                  onClick={() => navigate(`/rep/${rep.id}`)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav activeTab="dashboard" />
    </div>
  );
}
