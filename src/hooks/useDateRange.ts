import { useState, useEffect } from 'react';

export function useDateRange(defaultDays = 90) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    // Set default date range on mount
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - defaultDays);

    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  }, [defaultDays]);

  return {
    startDate,
    endDate,
    setStartDate,
    setEndDate
  };
}