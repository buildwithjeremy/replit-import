
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, AppAction } from './types';
import { appReducer } from './reducer';
import { initialState } from './initial-state';

const AppStateContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return React.createElement(
    AppStateContext.Provider,
    { value: { state, dispatch } },
    children
  );
}

export function useAppStateContext() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppStateContext must be used within AppStateProvider');
  }
  return context;
}
