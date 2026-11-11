'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { applyCosmetics } from '@/lib/cosmetics';
import { getItem } from '@/lib/storage';
import { cleanupStorage } from '@/lib/cleanup';

function applyStoredTheme() {
  if (typeof document === 'undefined') return;
  const theme = getItem('app_theme') || 'default';
  const body = document.body;
  const themeClasses = ['theme-light', 'theme-blue', 'theme-maroon', 'theme-glass', 'theme-dark'];
  themeClasses.forEach(c => body.classList.remove(c));
  if (theme !== 'default') body.classList.add(`theme-${theme}`);
}

export default function AppInit() {
  const pathname = usePathname();

  useEffect(() => {
    // Одноразовая очистка localStorage
    cleanupStorage();

    applyStoredTheme();
    applyCosmetics();

    const timer = setTimeout(() => {
      applyStoredTheme();
      applyCosmetics();
    }, 200);

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'app_theme') applyStoredTheme();
      if (e.key && e.key.includes('user_equipped')) applyCosmetics();
    };
    window.addEventListener('storage', onStorage);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('storage', onStorage);
    };
  }, [pathname]);

  return null;
}
