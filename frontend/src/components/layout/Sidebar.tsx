'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang } from '@/lib/i18n';

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useLang();
  const [communityOpen, setCommunityOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
    setCommunityOpen(false);
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Меню">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          {mobileOpen ? <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/> : <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>}
        </svg>
      </button>

      {mobileOpen && <div onClick={() => setMobileOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 998 }} />}

      <nav className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <h2 className="sidebar-menu"></h2>
        <ul>
          <li className={`sidebar-btn ${isActive('/store') || isActive('/') ? 'active' : ''}`}>
            <Link href="/store"><img src="/store.svg" alt="" className="icon" />{t('store')}</Link>
          </li>
          <li className={`sidebar-btn ${isActive('/library') ? 'active' : ''}`}>
            <Link href="/library"><img src="/library.svg" alt="" className="icon" />{t('library')}</Link>
          </li>
          <li className={`sidebar-btn ${isActive('/sale') ? 'active' : ''}`}>
            <Link href="/sale">
              <svg className="icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/></svg>
              {t('sale')}
            </Link>
          </li>
          <li className={`sidebar-btn ${isActive('/cloud') ? 'active' : ''}`}>
            <Link href="/cloud"><img src="/games.svg" alt="" className="icon" />{t('cloud')}</Link>
          </li>
          <li className={`sidebar-btn has-dropdown ${communityOpen ? 'active' : ''}`}>
            <a href="#" className="dropdown-toggle" onClick={(e) => { e.preventDefault(); setCommunityOpen(!communityOpen); }}>
              <img src="/community.svg" alt="" className="icon" />
              <span>{t('community')}</span>
              <span className="arrow" style={{ transform: communityOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}>⛛</span>
            </a>
            <ul className={`dropdown-menu ${communityOpen ? 'active' : ''}`}>
              <li><Link href="/profile" className="dropdown-link">{t('profile')}</Link></li>
              <li><Link href="/friends" className="dropdown-link">{t('friends')}</Link></li>
              <li><Link href="/groups" className="dropdown-link">{t('groups')}</Link></li>
              <li><Link href="/forums" className="dropdown-link">{t('forums')}</Link></li>
              <li><Link href="/events" className="dropdown-link">{t('events')}</Link></li>
            </ul>
          </li>
          <li className={`sidebar-btn bottom ${isActive('/settings') ? 'active' : ''}`}>
            <Link href="/settings"><img src="/setting.svg" alt="" className="icon" />{t('settings')}</Link>
          </li>
          <li className={`sidebar-btn ${isActive('/supports') ? 'active' : ''}`}>
            <Link href="/supports"><img src="/supports.svg" alt="" className="icon" />{t('supports')}</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
