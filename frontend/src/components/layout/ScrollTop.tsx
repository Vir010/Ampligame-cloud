'use client';
import { useState, useEffect } from 'react';

export default function ScrollTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{
        position: 'fixed', bottom: '30px', right: '30px',
        width: '50px', height: '50px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #8f3ed1, #a110ce)',
        border: 'none', color: '#fff', cursor: 'pointer',
        boxShadow: '0 5px 20px rgba(143,62,209,0.5)',
        zIndex: 900, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      aria-label="Наверх"
    >
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>
    </button>
  );
}
