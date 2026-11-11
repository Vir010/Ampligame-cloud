'use client';
import { useState, useEffect } from 'react';
import { getJSON, setJSON } from '@/lib/storage';

export default function ProductReviews({ gameId, gameTitle }: { gameId: string, gameTitle: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    const all = getJSON<any[]>('user_reviews', []);
    setReviews(all.filter(r => r.gameId === gameId));
  }, [gameId]);

  const handleAdd = () => {
    if (!newReview.trim()) return;
    const all = getJSON<any[]>('user_reviews', []);
    all.push({ gameId, gameTitle, rating, text: newReview.trim(), date: new Date().toLocaleDateString('ru-RU') });
    setJSON('user_reviews', all);
    setReviews(all.filter(r => r.gameId === gameId));
    setNewReview('');
    alert('Обзор опубликован!');
  };

  return (
    <div style={{ marginTop: '40px', background: '#1a1a1a', padding: '30px', borderRadius: '20px', border: '1px solid #333' }}>
      <h2 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '15px' }}>Обзоры ({reviews.length})</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
        {reviews.map((r, i) => (
          <div key={i} style={{ background: '#222', padding: '15px', borderRadius: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#ffaa00' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
              <span style={{ color: '#888', fontSize: '12px' }}>{r.date}</span>
            </div>
            <p style={{ margin: 0, color: '#ccc' }}>{r.text}</p>
          </div>
        ))}
      </div>
      <div style={{ background: '#222', padding: '20px', borderRadius: '10px' }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#fff', fontSize: '16px' }}>Написать обзор</h3>
        <div style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
          {[1, 2, 3, 4, 5].map(star => (
            <button key={star} onClick={() => setRating(star)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', color: star <= rating ? '#ffaa00' : '#555' }}>★</button>
          ))}
        </div>
        <textarea value={newReview} onChange={e => setNewReview(e.target.value)} placeholder="Поделитесь впечатлениями..." style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #333', background: '#111', color: '#fff', minHeight: '80px', marginBottom: '15px', fontFamily: 'inherit' }} />
        <button onClick={handleAdd} style={{ padding: '10px 24px', background: '#8f3ed1', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>Опубликовать</button>
      </div>
    </div>
  );
}
