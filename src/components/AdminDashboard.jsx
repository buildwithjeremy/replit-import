
import React, { useState } from 'react';
import RepCard from './RepCard';
import { authService } from '../services/auth';

const AdminDashboard = ({ user, reps, trainers, onViewChecklist }) => {
  const [selectedStage, setSelectedStage] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter reps based on stage and search
  const filteredReps = reps.filter(rep => {
    const matchesStage = selectedStage === 'all' || rep.stage.toString() === selectedStage;
    const matchesSearch = rep.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const getOverallMetrics = () => {
    const totalReps = reps.length;
    const totalTrainers = trainers.filter(t => t.role === 'trainer').length;
    const inProgress = reps.filter(rep => rep.stage < 13).length;
    const avgPromoRate = totalReps > 0 
      ? Math.round((reps.filter(rep => rep.stage >= 10).length / totalReps) * 100)
      : 0;

    return { totalReps, totalTrainers, inProgress, avgPromoRate };
  };

  const getProgressSnapshot = () => {
    const completed = reps.filter(rep => rep.stage >= 13).length;
    const total = reps.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  };

  const getTrainerPerformance = () => {
    return trainers.filter(trainer => trainer.role === 'trainer').map(trainer => {
      const trainerReps = reps.filter(rep => trainer.assignedRepIds.includes(rep.id));
      const avgProgress = trainerReps.length > 0
        ? Math.round(trainerReps.reduce((sum, rep) => sum + rep.stage, 0) / trainerReps.length)
        : 0;
      const avgPromoRate = trainerReps.length > 0
        ? Math.round((trainerReps.filter(rep => rep.stage >= 10).length / trainerReps.length) * 100)
        : 0;
      
      return {
        ...trainer,
        repCount: trainerReps.length,
        avgProgress,
        avgPromoRate
      };
    });
  };

  const metrics = getOverallMetrics();
  const progressSnapshot = getProgressSnapshot();
  const trainerPerformance = getTrainerPerformance();

  const handleSignOut = async () => {
    await authService.signOut();
    window.location.reload();
  };

  const getStageLabel = (stage) => {
    const stageLabels = {
      1: '1/13 Steps',
      2: '2/13 Steps', 
      3: '3/13 Steps',
      4: '4/13 Steps',
      5: '5/13 Steps',
      6: '6/13 Steps',
      7: '7/13 Steps',
      8: '8/13 Steps',
      9: '9/13 Steps',
      10: '10/13 Steps',
      11: '11/13 Steps',
      12: '12/13 Steps',
      13: '13/13 Steps'
    };
    return stageLabels[stage] || `${stage}/13 Steps`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Team performance overview</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 text-sm font-medium">AD</span>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Overall Funnel Metrics */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Overall Funnel Metrics</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-3 mx-auto">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{metrics.totalReps}</div>
                <div className="text-sm text-gray-600">Total Reps</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-3 mx-auto">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{metrics.totalTrainers}</div>
                <div className="text-sm text-gray-600">Total Field Trainers</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mb-3 mx-auto">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{metrics.inProgress}</div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-3 mx-auto">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{metrics.avgPromoRate}%</div>
                <div className="text-sm text-gray-600">Avg. Promo Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Snapshot */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Snapshot</h3>
          <div className="text-center">
            <div className="text-6xl font-bold text-pink-500 mb-2">{progressSnapshot.percentage}%</div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div 
                className="bg-indigo-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${progressSnapshot.percentage}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-600">
              {progressSnapshot.completed} / {progressSnapshot.total} Reps Completed
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Total number of active representatives who have completed their onboarding process.
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search representatives..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Stages</option>
            {[1,2,3,4,5,6,7,8,9,10,11,12,13].map(stage => (
              <option key={stage} value={stage}>{getStageLabel(stage)}</option>
            ))}
          </select>
        </div>

        {/* All Representatives */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">All Representatives</h2>
          {filteredReps.length > 0 ? (
            <div className="space-y-4">
              {filteredReps.map(rep => {
                const trainer = trainers.find(t => t.assignedRepIds.includes(rep.id));
                return (
                  <div key={rep.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 font-medium text-sm">
                            {rep.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{rep.name}</h3>
                          <p className="text-sm text-gray-600">
                            Onboarding Stage {rep.stage} • Trainer: {trainer?.name || 'Unassigned'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {Math.round((rep.stage / 13) * 100)}%
                          </div>
                          <div className="text-xs text-gray-500">{getStageLabel(rep.stage)}</div>
                        </div>
                        <button
                          onClick={() => onViewChecklist(rep)}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.round((rep.stage / 13) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No representatives match your filters.
            </div>
          )}
        </div>

        {/* Trainer Performance */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Trainer Performance</h2>
          <div className="space-y-4">
            {trainerPerformance.map(trainer => (
              <div key={trainer.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-medium text-sm">
                        {trainer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{trainer.name}</h3>
                      <p className="text-sm text-gray-600">Team Onboarding Progress</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      Average Promo Rate: {trainer.avgPromoRate}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {trainer.repCount} reps • Avg Progress: {trainer.avgProgress}/13
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
