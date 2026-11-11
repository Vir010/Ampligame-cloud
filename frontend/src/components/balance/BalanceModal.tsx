'use client';
import { useState } from 'react';
import { getItem, setItem } from '@/lib/storage';

export default function BalanceModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [amount, setAmount] = useState('');
  
  const presets = [100, 500, 1000, 2500, 5000, 10000];

  const handleAdd = (val: number) => {
    if (val <= 0) return;
    const current = parseInt(getItem('user_balance') || '0');
    setItem('user_balance', String(current + val));
    alert(`Баланс пополнен на ${val} ₽`);
    onSuccess();
    onClose();
  };

  return (
    <div className="balance-modal show" style={{ display: 'flex', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, alignItems: 'center', justifyContent: 'center' }}>
      <div className="balance-modal-content" style={{ background: '#1a1a1a', padding: '30px', borderRadius: '20px', maxWidth: '400px', width: '100%', border: '1px solid #8f3ed1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>Пополнение баланса</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' }}>×</button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          {presets.map(p => (
            <button key={p} onClick={() => handleAdd(p)} style={{ padding: '15px', background: 'rgba(143,62,209,0.1)', border: '1px solid #8f3ed1', borderRadius: '10px', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
              {p} ₽
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="number" 
            placeholder="Своя сумма" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #333', background: '#222', color: '#fff' }}
          />
          <button 
            onClick={() => handleAdd(parseInt(amount))}
            style={{ padding: '12px 20px', background: '#8f3ed1', border: 'none', borderRadius: '10px', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
  );
}
