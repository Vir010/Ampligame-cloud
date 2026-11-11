'use client';

export default function Footer() {
  return (
    <footer style={{ 
      padding: '40px 20px', 
      marginTop: '40px',
      borderTop: '1px solid rgba(143, 62, 209, 0.2)',
      textAlign: 'center',
      color: '#888',
      fontSize: '13px',
    }}>
      <div style={{ marginBottom: '15px' }}>
        <span style={{ fontWeight: 'bold', background: 'linear-gradient(135deg, #8f3ed1, #00c8ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '18px', letterSpacing: '2px' }}>
          AMPLIGAME
        </span>
      </div>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '10px' }}>
        <a href="/supports" style={{ color: '#888', textDecoration: 'none' }}>Поддержка</a>
        <a href="/supports" style={{ color: '#888', textDecoration: 'none' }}>Правила</a>
        <a href="/supports" style={{ color: '#888', textDecoration: 'none' }}>Политика</a>
        <a href="/supports" style={{ color: '#888', textDecoration: 'none' }}>Условия</a>
      </div>
      <p style={{ margin: 0 }}>© 2026 AMPLIGAME. Все права защищены.</p>
    </footer>
  );
}
