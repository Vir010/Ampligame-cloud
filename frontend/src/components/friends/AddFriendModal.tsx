'use client';
import { useState } from 'react';
import { getJSON, setJSON } from '@/lib/storage';
import { showToast } from '@/lib/toast';

export default function AddFriendModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [nickname, setNickname] = useState('');

  const handleAdd = () => {
    if (!nickname.trim()) return;
    const friends = getJSON<any[]>('user_friends', []);
    if (friends.some(f => f.name.toLowerCase() === nickname.toLowerCase())) {
      showToast('Этот пользователь уже у вас в друзьях', 'error');
      return;
    }

    friends.push({
      id: 'friend_' + Date.now(),
      name: nickname.trim(),
      status: 'online',
      game: 'Не в игре'
    });
    
    setJSON('user_friends', friends);
    showToast(`Пользователь ${nickname} добавлен в друзья!`, 'success');
    onSuccess();
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#1a1a1a', padding: '30px', borderRadius: '20px', width: '100%', maxWidth: '400px', border: '1px solid #8f3ed1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, color: '#fff' }}>Добавить друга</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' }}>×</button>
        </div>
        
        <input 
          type="text" 
          value={nickname} 
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Введите никнейм друга" 
          style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #333', background: '#222', color: '#fff', marginBottom: '20px' }}
        />
        <button 
          onClick={handleAdd}
          style={{ width: '100%', padding: '12px', background: '#8f3ed1', border: 'none', borderRadius: '10px', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Отправить заявку
        </button>
      </div>
    </div>
  );
}
