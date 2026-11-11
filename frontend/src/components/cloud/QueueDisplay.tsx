'use client';
import { useState, useEffect } from 'react';
import { getQueue } from '@/lib/cloudApi';

export default function QueueDisplay() {
  const [queue, setQueue] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadQueue = async () => {
    try {
      const data = await getQueue();
      setQueue(data);
    } catch (err) {
      // Тихо игнорируем (если юзер не залогинен)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
    const interval = setInterval(loadQueue, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '15px', color: '#888', textAlign: 'center' }}>
        Загрузка очереди...
      </div>
    );
  }

  if (!queue || queue.total === 0) {
    return (
      <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '15px', border: '1px solid #333', marginBottom: '30px' }}>
        <h3 style={{ margin: '0 0 10px', color: '#fff', fontSize: '18px' }}>Очередь</h3>
        <p style={{ color: '#4caf50', margin: 0, fontWeight: 'bold' }}>
          Очередь пуста. Все серверы свободны!
        </p>
      </div>
    );
  }

  return (
    <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '15px', border: '1px solid #333', marginBottom: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>Очередь</h3>
        <span style={{ background: 'rgba(143,62,209,0.2)', color: '#b4a8ff', padding: '4px 12px', borderRadius: '20px', fontSize: '13px' }}>
          {queue.total} в очереди
        </span>
      </div>

      {queue.myPosition && (
        <div style={{ background: 'rgba(143,62,209,0.15)', border: '1px solid #8f3ed1', borderRadius: '10px', padding: '12px', marginBottom: '15px', textAlign: 'center' }}>
          <p style={{ margin: 0, color: '#b4a8ff', fontSize: '14px' }}>
            Ваша позиция: <strong style={{ color: '#fff', fontSize: '20px' }}>#{queue.myPosition}</strong>
          </p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {queue.queue.slice(0, 5).map((item: any) => (
          <div key={item.position} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '14px' }}>
            <span style={{ color: '#b4a8ff', fontWeight: 'bold' }}>#{item.position}</span>
            <span style={{ color: '#fff', flex: 1, marginLeft: '12px' }}>{item.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
