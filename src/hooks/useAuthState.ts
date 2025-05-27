import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { AuthenticationError, AUTH_ERRORS } from '../lib/auth/errors';
import type { AuthError } from '../lib/auth/types';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw new AuthenticationError(sessionError.message);
        
        if (mounted) {
          setUser(session?.user ?? null);
          setError(null);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        if (mounted) {
          setUser(null);
          setError(err instanceof AuthenticationError ? err : new AuthenticationError(AUTH_ERRORS.NO_USER));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      
      if (session?.user) {
        setUser(session.user);
        setError(null);
      } else {
        setUser(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw new AuthenticationError(error.message);
      }

      if (!data.user) {
        throw new AuthenticationError(AUTH_ERRORS.INVALID_CREDENTIALS);
      }

      return data.user;
    } catch (err) {
      console.error('Sign in error:', err);
      throw new AuthenticationError(AUTH_ERRORS.INVALID_CREDENTIALS);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin }
      });
      
      if (error) {
        throw new AuthenticationError(error.message);
      }

      if (!data.user) {
        throw new AuthenticationError(AUTH_ERRORS.INVALID_CREDENTIALS);
      }

      return data.user;
    } catch (err) {
      console.error('Sign up error:', err);
      throw new AuthenticationError(AUTH_ERRORS.INVALID_CREDENTIALS);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw new AuthenticationError(error.message);
    } catch (err) {
      console.error('Sign out error:', err);
      throw new AuthenticationError('Sign out failed');
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, signIn, signUp, signOut };
}