// src/hooks/useDarkMode.js
import { useEffect } from 'react';

export default function useDarkMode() {
    useEffect(() => {
        const root = document.documentElement;
        root.classList.add('dark');
        return () => root.classList.remove('dark');
    }, []);
}