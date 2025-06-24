
import React, { useState } from 'react';
import { zapierService } from '../services/zapierPlaceholder';

const Checklist = ({ rep, onUpdateRep, progressionSteps, currentUser }) => {
  const [updatingTasks, setUpdatingTasks] = useState(new Set());

  const handleTaskToggle = async (stepId, taskId, taskDescription) => {
    const taskKey = `${stepId}-${taskId}`;
    setUpdatingTasks(prev => new Set([...prev, taskKey]));

    try {
      // Find the milestone and task
      const milestoneIndex = rep.milestones.findIndex(m => m.stepId === stepId);
      let milestone;
      
      if (milestoneIndex === -1) {
        // Create new milestone if it doesn't exist
        const stepInfo = progressionSteps.find(s => s.stepId === stepId);
        milestone = {
          stepId,
          title: stepInfo.title,
          completed: false,
          subTasks: stepInfo.subTasks.map((desc, index) => ({
            taskId: `task-${stepId}-${index}`,
            description: desc,
            completed: false
          }))
        };
        rep.milestones.push(milestone);
      } else {
        milestone = rep.milestones[milestoneIndex];
      }

      // Find and toggle the specific task
      const taskIndex = milestone.subTasks.findIndex(t => t.taskId === taskId);
      if (taskIndex !== -1) {
        const task = milestone.subTasks[taskIndex];
        task.completed = !task.completed;
        
        if (task.completed) {
          task.completedAt = new Date().toISOString();
          task.completedBy = currentUser.id;
        } else {
          delete task.completedAt;
          delete task.completedBy;
        }

        // Check if all tasks in milestone are completed
        const allTasksCompleted = milestone.subTasks.every(t => t.completed);
        if (allTasksCompleted && !milestone.completed) {
          milestone.completed = true;
          milestone.completedAt = new Date().toISOString();
          
          // Update rep stage if this milestone advances them
          if (stepId >= rep.stage) {
            rep.stage = stepId + 1;
            rep.promotionDate = new Date().toISOString();
            
            // TODO: Trigger milestone completion automation
            await zapierService.triggerMilestoneText(
              rep.id, 
              milestone.title, 
              rep.phone
            );
          }
        } else if (!allTasksCompleted && milestone.completed) {
          milestone.completed = false;
          delete milestone.completedAt;
        }

        onUpdateRep({ ...rep });
      }
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setUpdatingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskKey);
        return newSet;
      });
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const renderProgressStep = (step, index) => {
    const milestone = rep.milestones.find(m => m.stepId === step.stepId);
    const isCompleted = milestone?.completed || false;
    const completionPercentage = milestone ? 
      Math.round((milestone.subTasks.filter(t => t.completed).length / milestone.subTasks.length) * 100) : 0;

    return (
      <div key={step.stepId} className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {index + 1}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-sm font-medium ${isCompleted ? 'text-green-600' : 'text-gray-600'}`}>
                {completionPercentage}%
              </div>
              {isCompleted && (
                <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {milestone && (
            <div className="mb-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isCompleted ? 'bg-green-500' : 'bg-indigo-600'
                  }`}
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {step.subTasks.map((taskDesc, taskIndex) => {
              const taskId = `task-${step.stepId}-${taskIndex}`;
              const task = milestone?.subTasks.find(t => t.taskId === taskId);
              const isTaskCompleted = task?.completed || false;
              const isUpdating = updatingTasks.has(`${step.stepId}-${taskId}`);

              return (
                <div key={taskId} className="flex items-center space-x-3 py-2">
                  <button
                    onClick={() => handleTaskToggle(step.stepId, taskId, taskDesc)}
                    disabled={isUpdating}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      isTaskCompleted
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-gray-300 hover:border-indigo-400'
                    } ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {isUpdating ? (
                      <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : isTaskCompleted ? (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : null}
                  </button>
                  
                  <div className="flex-1">
                    <span className={`text-sm ${isTaskCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                      {taskDesc}
                    </span>
                    {task?.completedAt && (
                      <div className="text-xs text-gray-500 mt-1">
                        Completed {new Date(task.completedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Rep Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-indigo-600 font-medium">{getInitials(rep.name)}</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{rep.name}</h2>
            <p className="text-sm text-gray-600">Onboarding Progress for {rep.name}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Overall Progress: {Math.round((rep.stage / 13) * 100)}% Steps Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.round((rep.stage / 13) * 100)}%` }}
            ></div>
          </div>
          <div className="mt-2 text-xs text-gray-600">
            {rep.stage} / {progressionSteps.length} Steps Completed
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div>
        {progressionSteps.map((step, index) => renderProgressStep(step, index))}
      </div>
    </div>
  );
};

export default Checklist;
