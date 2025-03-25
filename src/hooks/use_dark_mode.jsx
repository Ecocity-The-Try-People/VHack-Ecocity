import { useEffect, useState } from 'react';

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(() => 
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', isDarkMode);
    
    // Add smooth transitions
    root.classList.add('transition-colors', 'duration-300');
    const timer = setTimeout(() => {
      root.classList.remove('transition-colors', 'duration-300');
    }, 300);
    
    return () => clearTimeout(timer);
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return [isDarkMode, toggleDarkMode];
}