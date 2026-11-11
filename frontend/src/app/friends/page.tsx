'use client';
import { useState, useEffect } from 'react';
import { getJSON, setJSON } from '@/lib/storage';
import FriendChatModal from '@/components/chat/FriendChatModal';
import AddFriendModal from '@/components/friends/AddFriendModal';
import { showToast } from '@/lib/toast';

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState<'online' | 'all' | 'requests'>('all');
  const [friends, setFriends] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [chatFriend, setChatFriend] = useState<any>(null);
  const [showAdd, setShowAdd] = useState(false);

  const loadData = () => {
    const savedFriends = getJSON<any[]>('user_friends', []);
    if (savedFriends.length > 0) {
      setFriends(savedFriends);
    } else {
      const defaults = [
        { id: 'f1', name: 'ShadowMaster', status: 'online', game: 'CS2' },
        { id: 'f2', name: 'DragonSlayer', status: 'offline', game: 'Dota 2' },
        { id: 'f3', name: 'ValorantPro', status: 'online', game: 'Valorant' }
      ];
      setFriends(defaults);
      setJSON('user_friends', defaults);
    }

    const defaultRequests = [{ id: 'req1', name: 'NoobMaster69', message: 'Хочет добавить вас в друзья' }];
    setRequests(getJSON('user_friend_requests', defaultRequests));
  };

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const handleRemoveFriend = (id: string, name: string) => {
    if (!confirm(`Удалить ${name} из друзей?`)) return;
    const updated = friends.filter(f => f.id !== id);
    setFriends(updated);
    setJSON('user_friends', updated);
    showToast(`${name} удален из друзей`, 'info');
  };

  const handleAcceptRequest = (req: any) => {
    const newFriend = { id: req.id, name: req.name, status: 'online', game: 'Не в игре' };
    const updatedFriends = [...friends, newFriend];
    setFriends(updatedFriends);
    setJSON('user_friends', updatedFriends);

    const updatedRequests = requests.filter(r => r.id !== req.id);
    setRequests(updatedRequests);
    setJSON('user_friend_requests', updatedRequests);
    showToast(`Заявка от ${req.name} принята`, 'success');
  };

  const handleDeclineRequest = (reqId: string) => {
    const updated = requests.filter(r => r.id !== reqId);
    setRequests(updated);
    setJSON('user_friend_requests', updated);
    showToast('Заявка отклонена', 'info');
  };

  if (!mounted) return null;

  const displayedFriends = activeTab === 'online' ? friends.filter(f => f.status === 'online') : friends;

  return (
    <div style={{ padding: '30px' }}>
      {chatFriend && <FriendChatModal friendId={chatFriend.id} friendName={chatFriend.name} onClose={() => setChatFriend(null)} />}
      {showAdd && <AddFriendModal onClose={() => setShowAdd(false)} onSuccess={loadData} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h1 style={{ color: '#fff', margin: 0 }}>Мои друзья</h1>
        <button onClick={() => setShowAdd(true)} style={{ padding: '10px 20px', background: '#8f3ed1', color: '#fff', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>+ Добавить друга</button>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
        {[
          { id: 'online', label: 'Онлайн' },
          { id: 'all', label: `Все друзья (${friends.length})` },
          { id: 'requests', label: `Заявки (${requests.length})` }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} style={{ padding: '8px 16px', background: activeTab === tab.id ? 'rgba(143,62,209,0.2)' : 'transparent', border: 'none', color: activeTab === tab.id ? '#8f3ed1' : '#888', cursor: 'pointer', fontWeight: 'bold', borderRadius: '20px' }}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'requests' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {displayedFriends.length === 0 ? <p style={{ color: '#888' }}>Нет друзей в этом разделе</p> : displayedFriends.map(f => (
            <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', background: '#1a1a1a', padding: '15px', borderRadius: '10px', border: '1px solid #222' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#8f3ed1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', position: 'relative', color: '#fff' }}>
                {f.name[0]}
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', borderRadius: '50%', background: f.status === 'online' ? '#4caf50' : '#888', border: '2px solid #1a1a1a' }}></div>
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 5px 0', color: '#fff' }}>{f.name}</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>{f.game}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setChatFriend(f)} style={{ padding: '8px 15px', background: 'transparent', border: '1px solid #8f3ed1', color: '#8f3ed1', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Сообщение</button>
                <button onClick={() => handleRemoveFriend(f.id, f.name)} style={{ padding: '8px 12px', background: 'transparent', border: '1px solid #ff4444', color: '#ff4444', borderRadius: '8px', cursor: 'pointer' }}>×</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'requests' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {requests.length === 0 ? <p style={{ color: '#888' }}>Нет новых заявок</p> : requests.map(req => (
            <div key={req.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', background: '#1a1a1a', padding: '15px', borderRadius: '10px', border: '1px solid #222' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#8f3ed1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff' }}>{req.name[0]}</div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 5px 0', color: '#fff' }}>{req.name}</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>{req.message}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleAcceptRequest(req)} style={{ padding: '8px 15px', background: '#4caf50', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Принять</button>
                <button onClick={() => handleDeclineRequest(req.id)} style={{ padding: '8px 15px', background: 'transparent', border: '1px solid #ff4444', color: '#ff4444', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Отклонить</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
