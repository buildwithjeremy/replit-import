
import React from 'react';

const RepCard = ({ rep, onClick, showTrainer = false }) => {
  const getProgressPercentage = () => {
    return Math.round((rep.stage / 13) * 100);
  };

  const getStatusColor = () => {
    const progress = getProgressPercentage();
    if (progress < 25) return 'bg-red-100 text-red-800';
    if (progress < 50) return 'bg-yellow-100 text-yellow-800';
    if (progress < 75) return 'bg-blue-100 text-blue-800';
    return 'bg-green-100 text-green-800';
  };

  const getDaysInStage = () => {
    const lastUpdate = new Date(rep.promotionDate);
    const now = new Date();
    const diffTime = Math.abs(now - lastUpdate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(rep)}
    >
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
          <span className="text-indigo-600 font-medium text-sm">{getInitials(rep.name)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">{rep.name}</h3>
          <p className="text-xs text-gray-500">Onboarding Stage {rep.stage}</p>
        </div>
        <div className="flex items-center">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-gray-700">Progress: {getProgressPercentage()}%</span>
          <span className="text-xs text-gray-500">Step {rep.stage} of 13</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs">
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">{getDaysInStage()} days left</span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {rep.stage <= 3 ? 'Starting' : rep.stage <= 8 ? 'Progress' : 'Advanced'}
        </span>
      </div>
    </div>
  );
};

export default RepCard;
