
import { useAppState } from '@/hooks/use-app-state';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, TrendingUp, Award, Clock } from 'lucide-react';
import TopNav from '@/components/navigation/top-nav';
import BottomNav from '@/components/navigation/bottom-nav';
import StatsCard from '@/components/dashboard/stats-card';
import FunnelChart from '@/components/dashboard/funnel-chart';
import RepCard from '@/components/dashboard/rep-card';

export default function TrainerDashboard() {
  const [, navigate] = useLocation();
  const { state } = useAppState();

  if (!state.isAuthenticated || state.userRole !== 'trainer') {
    navigate('/');
    return null;
  }

  // Find current trainer
  const currentTrainer = state.trainers.find(
    trainer => trainer.email === state.currentUser?.email
  );

  if (!currentTrainer) {
    return <div>Trainer not found</div>;
  }

  // Get assigned reps with safe type checking
  const assignedRepIds = Array.isArray(currentTrainer.assignedRepIds) ? currentTrainer.assignedRepIds : [];
  const assignedReps = state.reps.filter(rep => assignedRepIds.includes(rep.id));

  // Calculate stats
  const totalReps = assignedReps.length;
  const avgProgress = totalReps > 0 
    ? Math.round(assignedReps.reduce((sum, rep) => sum + rep.stage, 0) / totalReps)
    : 0;
  const completedReps = assignedReps.filter(rep => rep.stage >= 13).length;
  const completionRate = totalReps > 0 ? Math.round((completedReps / totalReps) * 100) : 0;

  // Get recent reps (last 5 updated)
  const recentReps = [...assignedReps]
    .sort((a, b) => {
      const dateA = a.updatedAt || new Date(0);
      const dateB = b.updatedAt || new Date(0);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5);

  // Calculate funnel data for assigned reps
  const funnelData = [
    { stage: 'Onboarding', count: assignedReps.filter(r => r.stage <= 3).length },
    { stage: 'Field Training', count: assignedReps.filter(r => r.stage > 3 && r.stage <= 7).length },
    { stage: 'Advanced', count: assignedReps.filter(r => r.stage > 7 && r.stage <= 10).length },
    { stage: 'Independence', count: assignedReps.filter(r => r.stage > 10 && r.stage <= 13).length },
    { stage: 'Graduated', count: assignedReps.filter(r => r.stage > 13).length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 sm:pb-6">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
            Trainer Dashboard
          </h1>
          <p className="text-gray-600 font-body">
            Welcome back, {state.currentUser?.name}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Assigned Reps"
            value={totalReps.toString()}
            icon={Users}
            trend="+2"
          />
          <StatsCard
            title="Avg Progress"
            value={`Stage ${avgProgress}`}
            icon={TrendingUp}
            trend="+1.2"
          />
          <StatsCard
            title="Completed"
            value={completedReps.toString()}
            icon={Award}
            trend="+1"
          />
          <StatsCard
            title="Completion Rate"
            value={`${completionRate}%`}
            icon={Clock}
            trend="+5%"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Funnel Chart */}
          <Card className="bg-white rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading">Your Training Pipeline</CardTitle>
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
                View Your Representatives
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
            {recentReps.length > 0 ? (
              <div className="space-y-4">
                {recentReps.map((rep) => (
                  <RepCard
                    key={rep.id}
                    rep={rep}
                    onClick={() => navigate(`/rep/${rep.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="font-heading font-semibold text-gray-900 mb-2">
                  No representatives assigned
                </h3>
                <p className="text-gray-600 mb-4">
                  Contact your administrator to get representatives assigned to you.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <BottomNav activeTab="dashboard" />
    </div>
  );
}
