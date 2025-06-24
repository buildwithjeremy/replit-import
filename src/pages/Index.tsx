
import React, { useState, useEffect } from 'react';
import Auth from '../components/Auth';
import TrainerDashboard from '../components/TrainerDashboard';
import AdminDashboard from '../components/AdminDashboard';
import Checklist from '../components/Checklist';
import { authService } from '../services/auth';

// Import dummy data
import dummyRepsData from '../data/dummyReps.json';
import dummyTrainersData from '../data/dummyTrainers.json';
import progressionStepsData from '../data/progressionSteps.json';

const Index = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedRep, setSelectedRep] = useState(null);
  const [reps, setReps] = useState(dummyRepsData);
  const [trainers, setTrainers] = useState(dummyTrainersData);

  // Check if user is already signed in on component mount
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleAuthChange = (user) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleViewChecklist = (rep) => {
    setSelectedRep(rep);
    setCurrentView('checklist');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedRep(null);
  };

  const handleUpdateRep = (updatedRep) => {
    setReps(prevReps => 
      prevReps.map(rep => 
        rep.id === updatedRep.id ? updatedRep : rep
      )
    );
    setSelectedRep(updatedRep);
  };

  const handleAddRep = (newRep) => {
    setReps(prevReps => [...prevReps, newRep]);
    
    // Update trainer's assigned rep IDs
    setTrainers(prevTrainers =>
      prevTrainers.map(trainer => 
        trainer.id === newRep.fieldTrainerId
          ? { ...trainer, assignedRepIds: [...trainer.assignedRepIds, newRep.id] }
          : trainer
      )
    );
  };

  // If not signed in, show auth
  if (!currentUser) {
    return <Auth onAuthChange={handleAuthChange} />;
  }

  // Show checklist view
  if (currentView === 'checklist' && selectedRep) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header with back button */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center py-4">
              <button
                onClick={handleBackToDashboard}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Rep Checklist</h1>
            </div>
          </div>
        </div>
        
        <Checklist
          rep={selectedRep}
          onUpdateRep={handleUpdateRep}
          progressionSteps={progressionStepsData}
          currentUser={currentUser}
        />
      </div>
    );
  }

  // Show appropriate dashboard based on user role
  if (currentUser.role === 'admin') {
    return (
      <AdminDashboard
        user={currentUser}
        reps={reps}
        trainers={trainers}
        onViewChecklist={handleViewChecklist}
      />
    );
  } else {
    return (
      <TrainerDashboard
        user={currentUser}
        reps={reps}
        onUpdateRep={handleUpdateRep}
        onAddRep={handleAddRep}
        onViewChecklist={handleViewChecklist}
      />
    );
  }
};

export default Index;
