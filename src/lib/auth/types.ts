import { User } from '@supabase/supabase-js';

export interface AuthError {
  message: string;
  code?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
}