// hooks/useKeyboardShortcut.js
import { useEffect } from 'react';

// Custom hook for keyboard shortcuts
export const useKeyboardShortcut = (key, callback, deps = []) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === key || event.code === key) {
        event.preventDefault();
        callback(event);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, deps);
};