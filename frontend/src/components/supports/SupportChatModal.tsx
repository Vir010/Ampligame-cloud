'use client';
import { useState, useEffect, useRef } from 'react';

export default function SupportChatModal({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<any[]>([{ from: 'support', text: 'Здравствуйте! Чем я могу вам помочь?', time: 'Только что' }]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { from: 'user', text: input.trim(), time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'support', text: 'Спасибо за обращение! Оператор ответит вам в ближайшее время.', time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1500);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#1a1a1a', borderRadius: '20px', width: '100%', maxWidth: '400px', height: '500px', display: 'flex', flexDirection: 'column', border: '1px solid #8f3ed1', overflow: 'hidden' }}>
        <div style={{ background: '#8f3ed1', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#fff' }}>Чат поддержки</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' }}>×</button>
        </div>
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
              <div style={{ background: m.from === 'user' ? '#8f3ed1' : '#333', color: '#fff', padding: '10px 15px', borderRadius: '12px' }}>{m.text}</div>
              <div style={{ fontSize: '10px', color: '#888', marginTop: '4px', textAlign: m.from === 'user' ? 'right' : 'left' }}>{m.time}</div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <div style={{ padding: '15px', borderTop: '1px solid #333', display: 'flex', gap: '10px' }}>
          <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} placeholder="Сообщение..." style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #333', background: '#222', color: '#fff' }} />
          <button onClick={handleSend} style={{ padding: '10px 20px', background: '#8f3ed1', border: 'none', borderRadius: '10px', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Отправить</button>
        </div>
      </div>
    </div>
  );
}
