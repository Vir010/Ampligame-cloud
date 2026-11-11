'use client';
import { useState, useEffect } from 'react';
import { COSMETICS } from '@/data/cosmetics';
import { getItem } from '@/lib/storage';
import { getOwnedCosmetics, getEquippedCosmetics, buyCosmetic, equipCosmetic } from '@/lib/cosmetics';

export default function PointsShop({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'frames' | 'backgrounds' | 'inventory'>('frames');
  const [points, setPoints] = useState(0);
  const [owned, setOwned] = useState<string[]>([]);
  const [equipped, setEquipped] = useState<Record<string, string>>({});

  useEffect(() => {
    setPoints(parseInt(getItem('user_points') || '0'));
    setOwned(getOwnedCosmetics());
    setEquipped(getEquippedCosmetics());
  }, []);

  const handleAction = (item: any, type: string) => {
    if (equipped[type] === item.id) return;
    
    if (owned.includes(item.id) || item.price === 0) {
      equipCosmetic(type, item.id);
      setEquipped(getEquippedCosmetics());
      alert('Применено!');
    } else {
      if (buyCosmetic(item.id, item.price)) {
        setPoints(parseInt(getItem('user_points') || '0'));
        setOwned(getOwnedCosmetics());
        equipCosmetic(type, item.id);
        setEquipped(getEquippedCosmetics());
        alert('Куплено и применено!');
      } else {
        alert('Недостаточно очков!');
      }
    }
  };

  const renderPreview = (item: any, type: string) => {
    if (type === 'frames') {
      return (
        <div className={`avatar-circle ${item.css}`} style={{ width: '50px', height: '50px', position: 'relative', margin: '0 auto' }}>
          <img src="/img/default-avatar.svg" alt="" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
        </div>
      );
    }
    if (type === 'backgrounds') {
      // Визуальное превью градиентов
      let bgStyle: any = { width: '100%', height: '50px', borderRadius: '5px', border: '1px solid rgba(255,255,255,0.2)' };
      if (item.css === 'custom-bg-aurora') bgStyle.background = 'linear-gradient(135deg, #0a1a2a, #1a0a2a, #2a1a0a, #0a2a1a)';
      if (item.css === 'custom-bg-nebula') bgStyle.background = 'radial-gradient(circle at 30% 40%, #8f3ed1, #1a0033, #0d001a)';
      if (item.css === 'custom-bg-matrix') bgStyle.background = 'linear-gradient(180deg, #000000, #001a00, #000000)';
      return <div style={bgStyle}></div>;
    }
    if (type === 'inventory') {
      return (
        <div className={`inventory-grid ${item.css}`} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', width: '100%', maxWidth: '80px', margin: '0 auto' }}>
          <div className="inventory-item" style={{ height: '20px', borderRadius: '3px', fontSize: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Item</div>
          <div className="inventory-item" style={{ height: '20px', borderRadius: '3px', fontSize: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Item</div>
        </div>
      );
    }
    return null;
  };

  const renderItems = (items: any[], type: string) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
      {items.map(item => {
        const isOwned = owned.includes(item.id) || item.price === 0;
        const isEquipped = equipped[type] === item.id;
        
        return (
          <div key={item.id} style={{ background: '#222', padding: '15px', borderRadius: '10px', textAlign: 'center', border: isEquipped ? '2px solid #4caf50' : '1px solid #333', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
               {renderPreview(item, type)}
            </div>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#fff' }}>{item.name}</h4>
            <button 
              onClick={() => handleAction(item, type)}
              disabled={isEquipped}
              style={{ width: '100%', padding: '8px', background: isEquipped ? '#4caf50' : isOwned ? '#8f3ed1' : 'transparent', border: isEquipped ? 'none' : '1px solid #8f3ed1', color: '#fff', borderRadius: '5px', cursor: isEquipped ? 'default' : 'pointer', fontSize: '12px', fontWeight: 'bold' }}
            >
              {isEquipped ? 'Активно' : isOwned ? 'Применить' : `${item.price} очков`}
            </button>
          </div>
        );
      })}
    </div>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#1a1a1a', padding: '30px', borderRadius: '20px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #8f3ed1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#fff' }}>Магазин оформления</h2>
          <div style={{ background: '#222', padding: '8px 15px', borderRadius: '20px', color: '#ffaa00', fontWeight: 'bold' }}>
            Очки: {points}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button onClick={() => setActiveTab('frames')} style={{ padding: '10px 20px', background: activeTab === 'frames' ? '#8f3ed1' : '#222', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>Рамки</button>
          <button onClick={() => setActiveTab('backgrounds')} style={{ padding: '10px 20px', background: activeTab === 'backgrounds' ? '#8f3ed1' : '#222', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>Фоны</button>
          <button onClick={() => setActiveTab('inventory')} style={{ padding: '10px 20px', background: activeTab === 'inventory' ? '#8f3ed1' : '#222', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>Инвентарь</button>
        </div>

        {activeTab === 'frames' && renderItems(COSMETICS.frames, 'frames')}
        {activeTab === 'backgrounds' && renderItems(COSMETICS.backgrounds, 'backgrounds')}
        {activeTab === 'inventory' && renderItems(COSMETICS.inventory, 'inventory')}
      </div>
    </div>
  );
}
