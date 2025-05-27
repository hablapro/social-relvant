import React from 'react';
import { SearchType } from '../../types';

interface Props {
  type: SearchType;
  setType: (type: SearchType) => void;
}

export default function TypeSelector({ type, setType }: Props) {
  return (
    <div className="space-x-4">
      <label className="font-medium">Type:</label>
      {(['handle', 'hashtag'] as SearchType[]).map((t) => (
        <label key={t} className="inline-flex items-center">
          <input
            type="radio"
            name="type"
            value={t}
            checked={type === t}
            onChange={(e) => setType(e.target.value as SearchType)}
            className="mr-2"
          />
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </label>
      ))}
    </div>
  );
}