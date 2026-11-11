'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCurrentUser, logout, User } from '@/lib/auth';
import { getItem } from '@/lib/storage';
import { applyCosmetics } from '@/lib/cosmetics';
import { useLang } from '@/lib/i18n';
import AuthModal from '@/components/auth/AuthModal';
import BalanceModal from '@/components/balance/BalanceModal';

const STATUS_COLORS = { online: '#4caf50', away: '#ffaa00', dnd: '#ff4444', invisible: '#888' };

export default function TopBar() {
  const { t } = useLang();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState(1000);
  const [avatar, setAvatar] = useState('/img/default-avatar.svg');
  const [status, setStatus] = useState('online');
  const [showAuth, setShowAuth] = useState(false);
  const [showBalance, setShowBalance] = useState(false);

  useEffect(() => {
    setMounted(true);
    refresh();
    applyCosmetics();
    const interval = setInterval(refresh, 1500);
    return () => clearInterval(interval);
  }, []);

  function refresh() {
    setUser(getCurrentUser());
    setBalance(parseInt(getItem('user_balance') || '1000'));
    setAvatar(getItem('user_avatar') || '/img/default-avatar.svg');
    setStatus(getItem('user_status') || 'online');
  }

  const handleLogout = () => { logout(); setUser(null); window.location.href = '/'; };
  const handleAuthSuccess = () => { setShowAuth(false); refresh(); window.location.reload(); };

  if (!mounted) return null;

  return (
    <>
      <div style={{ position: 'fixed', top: '20px', right: '30px', display: 'flex', alignItems: 'center', gap: '20px', zIndex: 1000 }}>
        {user ? (
          <>
            <Link href="/profile" style={{ position: 'relative', display: 'block', width: '50px', height: '50px' }}>
              <div className="avatar-circle" style={{ width: '100%', height: '100%', position: 'relative' }}>
                <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                <span className="avatar-status" style={{ position: 'absolute', bottom: '0', right: '0', width: '12px', height: '12px', borderRadius: '50%', background: STATUS_COLORS[status as keyof typeof STATUS_COLORS] || '#4caf50', border: '2px solid #1a1a1a' }}></span>
              </div>
            </Link>
            <div className="balance-card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px 20px', borderRadius: '50px', background: 'rgba(26,26,26,0.8)', border: '1px solid #333' }}>
              <span className="balance-label" style={{ fontSize: '13px', color: '#b4a8ff' }}>{t('balance')}</span>
              <span className="balance-amount" style={{ fontSize: '20px', fontWeight: 'bold', color: '#8f3ed1' }}>{balance.toLocaleString('ru-RU')} ₽</span>
              <button onClick={() => setShowBalance(true)} style={{ background: 'linear-gradient(135deg, #8f3ed1, #a110ce)', border: 'none', borderRadius: '20px', color: 'white', padding: '8px 16px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                {t('top_up')}
              </button>
              <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #ff4444', borderRadius: '20px', color: '#ff4444', padding: '8px 12px', cursor: 'pointer', fontSize: '12px' }}>
                {t('logout')}
              </button>
            </div>
          </>
        ) : (
          <button onClick={() => setShowAuth(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'linear-gradient(135deg, #8f3ed1, #a110ce)', border: 'none', borderRadius: '50px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 5px 20px rgba(143,62,209,0.4)' }}>
            {t('login')}
          </button>
        )}
      </div>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={handleAuthSuccess} />}
      {showBalance && <BalanceModal onClose={() => setShowBalance(false)} onSuccess={refresh} />}
    </>
  );
}
