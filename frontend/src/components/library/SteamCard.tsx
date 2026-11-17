'use client';

export default function SteamCard({
  gameTitle,
  index,
  image,
}: {
  gameTitle: string;
  index: number;
  image?: string;
}) {
  const letter = (gameTitle || '?').trim()[0]?.toUpperCase() || '?';

  return (
    <div
      style={{
        width: '140px',
        height: '190px',
        borderRadius: '10px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #2a1b3d, #11061f)',
        border: '2px solid #8f3ed1',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 15px rgba(143,62,209,0.3)',
      }}
    >
      {image ? (
        <img
          src={image}
          alt={gameTitle}
          style={{ width: '100%', height: '140px', objectFit: 'cover' }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '140px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '56px',
            fontWeight: 'bold',
            color: '#b4a8ff',
            background: 'linear-gradient(135deg, #1a0033, #0d001a)',
            textShadow: '0 0 20px rgba(143,62,209,0.6)',
          }}
        >
          {letter}
        </div>
      )}
      <div
        style={{
          padding: '8px',
          textAlign: 'center',
          color: '#fff',
          fontSize: '11px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div style={{ fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {gameTitle}
        </div>
        <div style={{ color: '#b4a8ff', fontSize: '10px', marginTop: '3px' }}>
          #{index + 1} / 5
        </div>
      </div>
    </div>
  );
}
