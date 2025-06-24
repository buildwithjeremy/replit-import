
import { AppState, AppAction } from './types';
import { Rep, AuditLog } from '@shared/schema';
import { generateId } from '@/lib/utils';
import { createMilestoneForStep } from './milestone-utils';

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SIGN_IN':
      return {
        ...state,
        isAuthenticated: true,
        currentUser: action.payload,
      };

    case 'SIGN_OUT':
      return {
        ...state,
        isAuthenticated: false,
        currentUser: null,
        userRole: null,
      };

    case 'SET_ROLE':
      return {
        ...state,
        userRole: action.payload,
        currentUser: state.currentUser ? {
          ...state.currentUser,
          role: action.payload
        } : null,
      };

    case 'ADD_REP':
      const newRep: Rep = {
        ...action.payload,
        id: generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return {
        ...state,
        reps: [...state.reps, newRep],
      };

    case 'UPDATE_REP':
      return {
        ...state,
        reps: state.reps.map(rep =>
          rep.id === action.payload.id
            ? { ...rep, ...action.payload.updates, updatedAt: new Date() }
            : rep
        ),
        selectedRep: state.selectedRep?.id === action.payload.id
          ? { ...state.selectedRep, ...action.payload.updates, updatedAt: new Date() }
          : state.selectedRep,
      };

    case 'SELECT_REP':
      return {
        ...state,
        selectedRep: action.payload,
      };

    case 'UPDATE_SUBTASK':
      const { repId, stepId, taskId, completed } = action.payload;
      const updatedReps = state.reps.map(rep => {
        if (rep.id !== repId) return rep;

        const milestones = Array.isArray(rep.milestones) ? rep.milestones : [];
        let existingMilestone = milestones.find((m: any) => m.stepId === stepId);
        
        if (!existingMilestone) {
          const newMilestone = createMilestoneForStep(stepId);
          if (newMilestone) {
            existingMilestone = newMilestone;
            milestones.push(existingMilestone);
          } else {
            existingMilestone = {
              stepId: stepId,
              title: `Step ${stepId}`,
              completed: false,
              subTasks: []
            };
            milestones.push(existingMilestone);
          }
        }

        const updatedMilestones = milestones.map((milestone: any) => {
          if (milestone.stepId !== stepId) return milestone;

          if (!milestone.subTasks) {
            milestone.subTasks = [];
          }

          let taskExists = milestone.subTasks.find((task: any) => task.taskId === taskId);
          if (!taskExists) {
            milestone.subTasks.push({
              taskId: taskId,
              description: `Task ${taskId}`,
              completed: false,
            });
          }

          const updatedSubTasks = milestone.subTasks.map((task: any) => {
            if (task.taskId !== taskId) return task;
            return {
              ...task,
              completed,
              completedAt: completed ? new Date().toISOString() : undefined,
              completedBy: completed ? state.currentUser?.id : undefined,
            };
          });

          const allSubTasksComplete = updatedSubTasks.every((task: any) => task.completed);
          
          return {
            ...milestone,
            completed: allSubTasksComplete,
            completedAt: allSubTasksComplete && !milestone.completed ? new Date().toISOString() : milestone.completedAt,
            completedBy: allSubTasksComplete && !milestone.completed ? state.currentUser?.id : milestone.completedBy,
            subTasks: updatedSubTasks,
          };
        });

        const completedSteps = updatedMilestones.filter((m: any) => m.completed).length;
        const newStage = Math.max(rep.stage, completedSteps + 1);

        return {
          ...rep,
          milestones: updatedMilestones,
          stage: newStage,
          updatedAt: new Date(),
        };
      });

      return {
        ...state,
        reps: updatedReps,
        selectedRep: state.selectedRep?.id === repId 
          ? updatedReps.find(r => r.id === repId) || null 
          : state.selectedRep,
      };

    case 'ADD_AUDIT_LOG':
      const newLog: AuditLog = {
        ...action.payload,
        id: Date.now(),
        timestamp: new Date(),
      };
      return {
        ...state,
        auditLogs: [newLog, ...state.auditLogs],
      };

    default:
      return state;
  }
}
