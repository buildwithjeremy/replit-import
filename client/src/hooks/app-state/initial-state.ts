
import { AppState } from './types';
import dummyReps from '@/data/dummy-reps.json';
import dummyTrainers from '@/data/dummy-trainers.json';
import { Rep, FieldTrainer } from '@shared/schema';

export const initialState: AppState = {
  isAuthenticated: false,
  currentUser: null,
  userRole: null,
  reps: dummyReps.map(rep => ({
    ...rep,
    promotionDate: rep.promotionDate ? new Date(rep.promotionDate) : null,
    createdAt: rep.createdAt ? new Date(rep.createdAt) : null,
    updatedAt: rep.updatedAt ? new Date(rep.updatedAt) : null
  })) as Rep[],
  trainers: dummyTrainers.map(trainer => ({
    ...trainer,
    assignedRepIds: Array.isArray(trainer.assignedRepIds) ? trainer.assignedRepIds : [],
    createdAt: trainer.createdAt ? new Date(trainer.createdAt) : null
  })) as FieldTrainer[],
  auditLogs: [],
  selectedRep: null,
};
