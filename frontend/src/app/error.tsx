'use client';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px', textAlign: 'center' }}>
      <svg viewBox="0 0 24 24" width="80" height="80" fill="#ff4444" style={{ marginBottom: '20px' }}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
      <h2 style={{ color: '#fff', marginBottom: '15px' }}>Что-то пошло не так</h2>
      <p style={{ color: '#888', marginBottom: '30px' }}>Произошла ошибка. Попробуйте обновить страницу.</p>
      <button onClick={reset} style={{ padding: '12px 30px', background: 'linear-gradient(135deg, #8f3ed1, #a110ce)', color: '#fff', border: 'none', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer' }}>
        Попробовать снова
      </button>
    </div>
  );
}
