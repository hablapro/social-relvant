import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { AuthenticationError } from '../../lib/auth';

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new AuthenticationError('useAuth must be used within an AuthProvider');
  }
  
  return context;
}