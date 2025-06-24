
import { useAppStateContext } from './app-state/context';

export function useAppState() {
  return useAppStateContext();
}

export { AppStateProvider } from './app-state/context';
