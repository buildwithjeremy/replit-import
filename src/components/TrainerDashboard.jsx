
import React, { useState } from 'react';
import RepCard from './RepCard';
import AddNewRep from './AddNewRep';
import { authService } from '../services/auth';

const TrainerDashboard = ({ user, reps, onUpdateRep, onAddRep, onViewChecklist }) => {
  const [showAddRep, setShowAddRep] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter reps assigned to this trainer
  const trainerReps = reps.filter(rep => 
    user.assignedRepIds.includes(rep.id) &&
    rep.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getQuickStats = () => {
    const activeReps = trainerReps.length;
    const avgProgress = trainerReps.length > 0 
      ? Math.round(trainerReps.reduce((sum, rep) => sum + (rep.stage / 13 * 100), 0) / trainerReps.length)
      : 0;
    const stuckReps = trainerReps.filter(rep => {
      const lastUpdate = new Date(rep.promotionDate);
      const daysSince = Math.ceil((new Date() - lastUpdate) / (1000 * 60 * 60 * 24));
      return daysSince > 7; // Consider stuck if no progress in 7 days
    }).length;
    const promotionRate = trainerReps.length > 0
      ? Math.round((trainerReps.filter(rep => rep.stage >= 10).length / trainerReps.length) * 100)
      : 0;

    return { activeReps, avgProgress, stuckReps, promotionRate };
  };

  const stats = getQuickStats();

  const handleSignOut = async () => {
    await authService.signOut();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Trainer Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 text-sm font-medium">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
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
        {/* Add New Rep Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddRep(true)}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Representative
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-3 mx-auto">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.activeReps}</div>
              <div className="text-sm text-gray-600">Active Representatives</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-3 mx-auto">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.avgProgress}%</div>
              <div className="text-sm text-gray-600">Average Progress</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-3 mx-auto">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.stuckReps}</div>
              <div className="text-sm text-gray-600">Stuck reps</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-3 mx-auto">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.promotionRate}%</div>
              <div className="text-sm text-gray-600">Rep Promotion Rate</div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
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
        </div>

        {/* Assigned Representatives */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Assigned Representatives</h2>
          {trainerReps.length > 0 ? (
            <div className="space-y-4">
              {trainerReps.map(rep => (
                <RepCard 
                  key={rep.id} 
                  rep={rep} 
                  onClick={onViewChecklist}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'No representatives match your search.' : 'No representatives assigned yet.'}
            </div>
          )}
        </div>
      </div>

      {/* Add New Rep Modal */}
      {showAddRep && (
        <AddNewRep
          onClose={() => setShowAddRep(false)}
          onAddRep={(newRep) => {
            onAddRep(newRep);
            setShowAddRep(false);
          }}
          trainerId={user.id}
        />
      )}
    </div>
  );
};

export default TrainerDashboard;
