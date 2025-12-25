/**
 * Initialize the application with component library
 */

import { useEffect } from 'react';
import { useStore } from '../store';
import { componentLibrary } from '../data/componentLibrary';

export function useInitializeApp() {
  const { loadComponentLibrary } = useStore();

  useEffect(() => {
    // Load component library on app start
    loadComponentLibrary(componentLibrary);
  }, [loadComponentLibrary]);
}
