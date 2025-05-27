import { useState, useCallback, useEffect } from 'react';

export function useCopyToClipboard(resetDelay = 2000) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), resetDelay);
      return () => clearTimeout(timer);
    }
  }, [copied, resetDelay]);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  }, []);

  return { copied, copyToClipboard };
}