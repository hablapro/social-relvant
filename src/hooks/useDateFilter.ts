import { useState, useMemo } from 'react';

export function useDateFilter() {
  const [days, setDays] = useState<'30' | '90' | '180'>('90');

  const dateRange = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - parseInt(days));
    return { start, end };
  }, [days]);

  return {
    days,
    setDays,
    dateRange
  };
}