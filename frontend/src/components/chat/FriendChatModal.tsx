'use client';
import { useState, useEffect, useRef } from 'react';
import { getMessages, sendMessage, ChatMessage } from '@/lib/chat';

export default function FriendChatModal({ friendId, friendName, onClose }: { friendId: string, friendName: string, onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(getMessages(friendId));
  }, [friendId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const updated = sendMessage(friendId, input.trim());
    setMessages([...updated]);
    setInput('');

    // Имитация ответа
    setTimeout(() => {
      const replies = ['Привет! Как дела?', 'О, круто!', 'Давай поиграем?', 'Согласен', 'Хм, интересно'];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      const withReply = [...getMessages(friendId), { from: 'friend' as const, text: reply, time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) }];
      setMessages(withReply);
      // Сохраняем в localStorage с ответом
      import('@/lib/storage').then(({ setJSON }) => {
        setJSON('chat_messages_' + friendId, withReply);
      });
    }, 1500);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#1a1a1a', borderRadius: '20px', width: '100%', maxWidth: '500px', height: '600px', display: 'flex', flexDirection: 'column', border: '1px solid #8f3ed1', overflow: 'hidden' }}>
        
        {/* Шапка */}
        <div style={{ background: '#8f3ed1', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{friendName[0]}</div>
            <h3 style={{ margin: 0, color: '#fff' }}>{friendName}</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' }}>×</button>
        </div>

        {/* Сообщения */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {messages.length === 0 && <p style={{ color: '#888', textAlign: 'center', marginTop: '20px' }}>Начните переписку</p>}
          {messages.map((m, i) => (
            <div key={i} style={{ alignSelf: m.from === 'me' ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
              <div style={{ background: m.from === 'me' ? '#8f3ed1' : '#333', color: '#fff', padding: '10px 15px', borderRadius: '15px', borderBottomRightRadius: m.from === 'me' ? '4px' : '15px', borderBottomLeftRadius: m.from === 'friend' ? '4px' : '15px' }}>
                {m.text}
              </div>
              <div style={{ fontSize: '10px', color: '#888', marginTop: '4px', textAlign: m.from === 'me' ? 'right' : 'left' }}>{m.time}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Ввод */}
        <div style={{ padding: '15px', borderTop: '1px solid #333', display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Сообщение..." 
            style={{ flex: 1, padding: '12px', borderRadius: '20px', border: '1px solid #333', background: '#222', color: '#fff', outline: 'none' }}
          />
          <button onClick={handleSend} style={{ padding: '12px 20px', background: '#8f3ed1', border: 'none', borderRadius: '20px', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Отправить</button>
        </div>
      </div>
    </div>
  );
}
