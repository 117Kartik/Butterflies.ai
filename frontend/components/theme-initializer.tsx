'use client';

import { useEffect } from 'react';

export default function ThemeInitializer() {
  useEffect(() => {
    document.documentElement.classList.toggle('dark', localStorage.theme === 'dark');
  }, []);
  return null;
}
