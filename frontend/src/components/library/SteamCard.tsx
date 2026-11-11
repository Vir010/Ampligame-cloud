'use client';

export default function SteamCard({ gameTitle, index }: { gameTitle?: string, index: number }) {
  const safeTitle = gameTitle && gameTitle.length > 0 ? gameTitle : 'Unknown Game';
  const firstLetter = safeTitle[0].toUpperCase();

  const colors = [
    ['#8f3ed1', '#a110ce'],
    ['#00c8ff', '#0077aa'],
    ['#ffaa00', '#ff6600'],
    ['#4caf50', '#2e7d32'],
    ['#ff4444', '#aa2222']
  ];
  const [c1, c2] = colors[(index || 0) % colors.length];

  return (
    <div style={{
      width: '130px', height: '180px',
      borderRadius: '12px',
      background: `linear-gradient(135deg, ${c1}, ${c2})`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
      border: '1px solid rgba(255,255,255,0.15)',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'transform 0.3s',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 60%)',
      }}></div>

      <span style={{ fontSize: '60px', fontWeight: '900', opacity: 0.15, position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        {firstLetter}
      </span>

      <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff', zIndex: 1, textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>
        {firstLetter}
      </span>

      <div style={{ position: 'absolute', bottom: '10px', left: '10px', right: '10px', textAlign: 'center' }}>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {safeTitle}
        </div>
        <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
          #{(index || 0) + 1} / 5
        </div>
      </div>
    </div>
  );
}
