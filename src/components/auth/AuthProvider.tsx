import React from 'react';
import { AuthContext } from './AuthContext';
import { useAuthState } from './useAuthState';
import { isSupabaseConfigured } from '../../lib/supabase';
import SupabaseSetup from '../setup/SupabaseSetup';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Show setup screen if Supabase is not configured
  if (!isSupabaseConfigured) {
    return <SupabaseSetup />;
  }

  const authState = useAuthState();
  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
}