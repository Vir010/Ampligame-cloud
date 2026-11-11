'use client';
import { useState } from 'react';

export default function ProductDescription({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ marginBottom: '25px' }}>
      <div 
        style={{ 
          maxHeight: expanded ? 'none' : '120px', 
          overflow: 'hidden', 
          position: 'relative',
          color: '#ccc',
          fontSize: '15px',
          lineHeight: 1.6,
          transition: 'max-height 0.3s ease'
        }}
      >
        {text}
        {!expanded && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', background: 'linear-gradient(transparent, #222)' }}></div>
        )}
      </div>
      <button 
        onClick={() => setExpanded(!expanded)}
        style={{ marginTop: '10px', background: 'transparent', border: '1px solid #8f3ed1', color: '#8f3ed1', padding: '6px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
      >
        {expanded ? 'Скрыть' : 'Показать полностью'}
      </button>
    </div>
  );
}
