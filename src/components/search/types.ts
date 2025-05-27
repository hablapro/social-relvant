import type { Profile } from '../../types';

export interface SearchResultsProps {
  results: {
    profile?: Profile;
    posts?: any[];
  } | null;
  error: string | null;
}