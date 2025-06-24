
import { AppUser, Rep, FieldTrainer, AuditLog } from '@shared/schema';

export type AppState = {
  isAuthenticated: boolean;
  currentUser: AppUser | null;
  userRole: 'trainer' | 'admin' | null;
  reps: Rep[];
  trainers: FieldTrainer[];
  auditLogs: AuditLog[];
  selectedRep: Rep | null;
};

export type AppAction =
  | { type: 'SIGN_IN'; payload: AppUser }
  | { type: 'SIGN_OUT' }
  | { type: 'SET_ROLE'; payload: 'trainer' | 'admin' }
  | { type: 'ADD_REP'; payload: Omit<Rep, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_REP'; payload: { id: string; updates: Partial<Rep> } }
  | { type: 'SELECT_REP'; payload: Rep | null }
  | { type: 'UPDATE_SUBTASK'; payload: { repId: string; stepId: number; taskId: string; completed: boolean } }
  | { type: 'ADD_AUDIT_LOG'; payload: Omit<AuditLog, 'id' | 'timestamp'> };
