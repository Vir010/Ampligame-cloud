'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getJSON, setJSON, getItem } from '@/lib/storage';
import { getCurrentUser } from '@/lib/auth';
import { showToast } from '@/lib/toast';
import { Topic } from '../page';

export interface Reply {
  id: string;
  topicId: string;
  author: string;
  content: string;
  date: string;
}

export default function ForumTopicPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.id as string;

  const [topic, setTopic] = useState<Topic | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Загружаем тему
    const topics = getJSON<Topic[]>('user_forum_topics', []);
    const foundTopic = topics.find(t => t.id === topicId);
    
    if (!foundTopic) {
      // Если темы нет (например, переход по старой ссылке), берем дефолтную
      const defaults: Topic[] = [
        { id: 't1', title: 'Лучшие игры 2025 года', content: 'Обсудим?', author: 'ShadowMaster', category: 'general', replies: 156, views: 2300, date: '5 минут назад' },
        { id: 't2', title: 'Проблемы с производительностью', content: 'Помогите', author: 'DragonSlayer', category: 'help', replies: 89, views: 1500, date: '1 час назад' },
      ];
      const fallbackTopic = defaults.find(t => t.id === topicId);
      if (fallbackTopic) {
        setTopic(fallbackTopic);
      } else {
        router.push('/forums');
        return;
      }
    } else {
      setTopic(foundTopic);
      
      // Увеличиваем счетчик просмотров
      const updatedTopics = topics.map(t => t.id === topicId ? { ...t, views: t.views + 1 } : t);
      setJSON('user_forum_topics', updatedTopics);
    }

    // Загружаем ответы
    const savedReplies = getJSON<Reply[]>('user_forum_replies', []);
    const topicReplies = savedReplies.filter(r => r.topicId === topicId);
    
    // Если ответов нет, но тема "дефолтная" — добавим пару фейковых
    if (topicReplies.length === 0 && (topicId === 't1' || topicId === 't2')) {
      const fakeReplies: Reply[] = [
        { id: 'r1', topicId, author: 'ValorantPro', content: 'Согласен, Elden Ring топ!', date: '2 минуты назад' },
        { id: 'r2', topicId, author: 'Gamer123', content: 'А мне Cyberpunk зашел после патчей.', date: '1 минуту назад' },
      ];
      setReplies(fakeReplies);
    } else {
      setReplies(topicReplies);
    }
  }, [topicId, router]);

  const handleSendReply = () => {
    if (!newReply.trim()) return;
    const user = getCurrentUser();
    const authorName = user ? user.username : 'Гость';

    const reply: Reply = {
      id: 'reply_' + Date.now(),
      topicId,
      author: authorName,
      content: newReply.trim(),
      date: 'Только что'
    };

    // Сохраняем ответ
    const allReplies = getJSON<Reply[]>('user_forum_replies', []);
    const updatedReplies = [...allReplies, reply];
    setJSON('user_forum_replies', updatedReplies);
    setReplies([...replies, reply]);
    setNewReply('');

    // Обновляем счетчик ответов в теме
    const topics = getJSON<Topic[]>('user_forum_topics', []);
    const updatedTopics = topics.map(t => t.id === topicId ? { ...t, replies: t.replies + 1 } : t);
    setJSON('user_forum_topics', updatedTopics);

    showToast('Ответ отправлен', 'success');
  };

  if (!mounted || !topic) return <div style={{ padding: '40px', color: '#fff' }}>Загрузка...</div>;

  return (
    <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto' }}>
      <Link href="/forums" style={{ display: 'inline-block', marginBottom: '20px', color: '#8f3ed1', textDecoration: 'none', fontWeight: 'bold' }}>
        ← Назад к форумам
      </Link>

      {/* Заголовок темы */}
      <div style={{ background: '#1a1a1a', padding: '30px', borderRadius: '15px', border: '1px solid #333', marginBottom: '20px' }}>
        <h1 style={{ color: '#fff', marginTop: 0, marginBottom: '15px' }}>{topic.title}</h1>
        <div style={{ display: 'flex', gap: '15px', fontSize: '13px', color: '#888', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
          <span>Автор: <strong style={{ color: '#b4a8ff' }}>{topic.author}</strong></span>
          <span>Дата: {topic.date}</span>
          <span>👁 {topic.views} просмотров</span>
          <span>💬 {replies.length} ответов</span>
        </div>
        <p style={{ color: '#ccc', fontSize: '15px', lineHeight: 1.6, margin: 0 }}>{topic.content}</p>
      </div>

      {/* Список ответов */}
      <h3 style={{ color: '#fff', marginBottom: '15px' }}>Ответы ({replies.length})</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
        {replies.length === 0 ? (
          <p style={{ color: '#888' }}>Пока нет ответов. Будьте первым!</p>
        ) : (
          replies.map((r, i) => (
            <div key={r.id} style={{ background: '#1a1a1a', padding: '20px', borderRadius: '12px', border: '1px solid #222' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#8f3ed1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>
                  {r.author[0]}
                </div>
                <div>
                  <strong style={{ color: '#fff', fontSize: '14px' }}>{r.author}</strong>
                  <span style={{ color: '#888', fontSize: '12px', marginLeft: '10px' }}>{r.date}</span>
                </div>
              </div>
              <p style={{ color: '#ccc', fontSize: '14px', margin: 0, paddingLeft: '40px' }}>{r.content}</p>
            </div>
          ))
        )}
      </div>

      {/* Форма ответа */}
      <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '15px', border: '1px solid #8f3ed1' }}>
        <h3 style={{ color: '#fff', marginTop: 0, marginBottom: '15px', fontSize: '16px' }}>Оставить ответ</h3>
        <textarea 
          value={newReply} 
          onChange={e => setNewReply(e.target.value)} 
          placeholder="Напишите ваш ответ..." 
          style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #333', background: '#222', color: '#fff', minHeight: '100px', marginBottom: '15px', fontFamily: 'inherit', boxSizing: 'border-box' }}
        />
        <button onClick={handleSendReply} style={{ padding: '12px 30px', background: 'linear-gradient(135deg, #8f3ed1, #a110ce)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
          Отправить
        </button>
      </div>
    </div>
  );
}
