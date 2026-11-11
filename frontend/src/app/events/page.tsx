'use client';
import { useState, useEffect } from 'react';
import { getJSON, setJSON } from '@/lib/storage';
import { showToast } from '@/lib/toast';

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'tournaments'>('upcoming');
  const [participating, setParticipating] = useState<string[]>([]);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newTournament, setNewTournament] = useState({ name: '', game: 'CS2', prize: '', date: '', maxPlayers: '16' });

  const loadData = () => {
    setParticipating(getJSON<string[]>('user_tournaments', []));
    const saved = getJSON<any[]>('user_custom_tournaments', []);
    setTournaments(saved);
  };

  useEffect(() => { loadData(); }, []);

  const handleJoinTournament = (id: string, name: string) => {
    if (participating.includes(id)) return;
    const updated = [...participating, id];
    setParticipating(updated);
    setJSON('user_tournaments', updated);
    showToast(`Вы участвуете в турнире "${name}"`, 'success');
  };

  const handleCreateTournament = () => {
    if (!newTournament.name.trim() || !newTournament.date.trim()) {
      showToast('Заполните название и дату', 'error');
      return;
    }
    const t = {
      id: 'custom_' + Date.now(),
      name: newTournament.name.trim(),
      game: newTournament.game,
      prize: newTournament.prize || '0 ₽',
      players: `0/${newTournament.maxPlayers}`,
      date: newTournament.date,
      isCustom: true,
    };
    const updated = [t, ...tournaments];
    setTournaments(updated);
    setJSON('user_custom_tournaments', updated);
    setShowCreate(false);
    setNewTournament({ name: '', game: 'CS2', prize: '', date: '', maxPlayers: '16' });
    showToast('Турнир создан!', 'success');
  };

  const news = [
    { time: '12:30', title: 'Team Spirit вышла в гранд-финал', desc: 'Российская команда обыграла BetBoom со счетом 3:1 на ESL One Birmingham', tag: 'Dota 2' },
    { time: '10:15', title: 's1mple возвращается?', desc: 'Легендарный игрок намекнул на возвращение в NAVI в своем твиттере', tag: 'CS2' },
    { time: 'Вчера', title: 'Анонс турнира Valorant Champions', desc: 'Призовой фонд составит рекордные 2.5 миллиона долларов', tag: 'Valorant' },
    { time: 'Вчера', title: 'Обновление патча 7.35 для Dota 2', desc: 'Изменения затронут более 20 героев и предметов', tag: 'Dota 2' },
    { time: '2 дня назад', title: 'G2 выиграла IEM Katowice', desc: 'В финале обыграли FaZe Clan со счетом 3:0', tag: 'CS2' },
  ];

  const streams = [
    { name: 'ShadowMaster', desc: 'CS2 - Ранговый матч | Путь к глобалке', viewers: '1.2K', avatar: '/img/avatars/cs2 img.webp', preview: '/img/streams/gif cs2.gif', game: 'CS2' },
    { name: 'DragonSlayer', desc: 'Dota 2 - Immortal bracket | Проходим на топ-100', viewers: '856', avatar: '/img/avatars/dota.webp', preview: '/img/streams/dota-2.gif', game: 'Dota 2' },
    { name: 'ValorantPro', desc: 'Valorant | Immortal 3 | Тренировка аимов', viewers: '2.1K', avatar: '/img/avatars/val.webp', preview: '/img/streams/valorant.gif', game: 'Valorant' },
  ];

  const events = [
    { day: '15', month: 'Апр', title: 'Релиз GTA VI', desc: 'Долгожданный выход новой части культовой серии', time: '20:00 МСК', platform: 'PC, PS5, Xbox' },
    { day: '22', month: 'Апр', title: 'Киберспортивный турнир по CS2', desc: 'Призовой фонд 1 000 000 ₽', time: '15:00 МСК', platform: 'Регистрация открыта' },
    { day: '05', month: 'Май', title: 'Закрытое бета-тестирование', desc: 'Новая игра от студии CD Projekt Red', time: '12:00 МСК', platform: 'По инвайтам' },
    { day: '12', month: 'Май', title: 'Распродажа Indie-игр', desc: 'Скидки до 80% на независимые проекты', time: '00:01 МСК', platform: '3 дня' },
  ];

  const pastEvents = [
    { day: '01', month: 'Мар', title: 'Релиз Phantom Liberty', desc: 'Новое дополнение для Cyberpunk 2077', time: 'Уже доступно', platform: 'Рейтинг 9.2/10' },
    { day: '15', month: 'Фев', title: 'Зимняя распродажа', desc: 'Скидки до 90%', time: 'Завершено', platform: '500 000 покупок' },
  ];

  const defaultTournaments = [
    { id: 't1', name: 'Ampligame Cup #1', game: 'CS2', prize: '50 000 ₽', players: '16/32', date: '20 апреля' },
    { id: 't2', name: 'Ampligame Elden Ring', game: 'Elden Ring', prize: '100 000 ₽', players: '8/16', date: '25 апреля' },
    { id: 't3', name: 'Valorant Open', game: 'Valorant', prize: '75 000 ₽', players: '12/16', date: '28 апреля' },
  ];

  const allTournaments = [...tournaments, ...defaultTournaments];

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '25px', marginBottom: '30px' }}>
        {/* Киберспорт */}
        <div style={{ background: 'linear-gradient(145deg, #1a1a1a, #222)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(143,62,209,0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #8f3ed1', paddingBottom: '10px', marginBottom: '15px' }}>
            <h2 style={{ color: '#8f3ed1', margin: 0, fontSize: '20px' }}>Киберспорт</h2>
            <span style={{ background: 'rgba(143,62,209,0.2)', color: '#b4a8ff', padding: '4px 10px', borderRadius: '20px', fontSize: '11px' }}>Свежие новости</span>
          </div>
          {news.map((n, i) => (
            <div key={i} style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: i < news.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <div style={{ color: '#8f3ed1', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>{n.time}</div>
              <h3 style={{ color: '#fff', fontSize: '15px', margin: '0 0 5px 0' }}>{n.title}</h3>
              <p style={{ color: '#b4a8ff', fontSize: '13px', margin: '0 0 8px 0', lineHeight: 1.4 }}>{n.desc}</p>
              <span style={{ background: 'rgba(143,62,209,0.2)', color: '#b4a8ff', padding: '2px 8px', borderRadius: '12px', fontSize: '11px' }}>{n.tag}</span>
            </div>
          ))}
        </div>

        {/* Прямые эфиры */}
        <div style={{ background: 'linear-gradient(145deg, #1a1a1a, #222)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(143,62,209,0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #8f3ed1', paddingBottom: '10px', marginBottom: '20px' }}>
            <h3 style={{ color: '#8f3ed1', margin: 0, fontSize: '22px' }}>Прямые эфиры</h3>
            <span style={{ background: 'rgba(143,62,209,0.2)', color: '#b4a8ff', padding: '5px 12px', borderRadius: '20px', fontSize: '12px' }}>3 онлайн</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
            {streams.map((s, i) => (
              <div key={i} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ position: 'relative', height: '140px', background: '#000', overflow: 'hidden' }}>
                  <img src={s.preview} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: 10, left: 10, background: '#ff4444', color: '#fff', padding: '3px 8px', borderRadius: '5px', fontSize: '10px', fontWeight: 'bold', zIndex: 2 }}>LIVE</span>
                  <span style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '3px 8px', borderRadius: '5px', fontSize: '11px', zIndex: 2 }}>{s.viewers} зрителей</span>
                </div>
                <div style={{ padding: '15px', display: 'flex', gap: '12px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={s.avatar} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ color: '#fff', margin: '0 0 5px 0', fontSize: '15px' }}>{s.name}</h4>
                    <p style={{ color: '#b4a8ff', fontSize: '12px', margin: '0 0 8px 0' }}>{s.desc}</p>
                    <span style={{ background: 'rgba(143,62,209,0.2)', color: '#b4a8ff', padding: '2px 8px', borderRadius: '12px', fontSize: '10px' }}>{s.game}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h1 style={{ textAlign: 'center', color: '#fff', marginBottom: '30px' }}>События и мероприятия</h1>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px' }}>
        {[
          { id: 'upcoming', label: 'Предстоящие' },
          { id: 'past', label: 'Прошедшие' },
          { id: 'tournaments', label: 'Турниры' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} style={{ padding: '10px 24px', background: activeTab === tab.id ? '#8f3ed1' : '#222', color: '#fff', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>{tab.label}</button>
        ))}
      </div>

      {activeTab === 'upcoming' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {events.map((ev, i) => (
            <div key={i} style={{ display: 'flex', gap: '20px', background: '#1a1a1a', padding: '20px', borderRadius: '15px', border: '1px solid #333' }}>
              <div style={{ background: '#8f3ed1', borderRadius: '10px', padding: '10px', textAlign: 'center', minWidth: '70px', height: '70px' }}>
                <span style={{ display: 'block', fontSize: '24px', fontWeight: 'bold', color: '#fff', lineHeight: 1 }}>{ev.day}</span>
                <span style={{ fontSize: '13px', color: '#fff' }}>{ev.month}</span>
              </div>
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#fff', fontSize: '16px' }}>{ev.title}</h3>
                <p style={{ margin: '0 0 8px 0', color: '#aaa', fontSize: '13px' }}>{ev.desc}</p>
                <div style={{ display: 'flex', gap: '15px', fontSize: '12px', color: '#888' }}><span>{ev.time}</span><span>{ev.platform}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'past' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {pastEvents.map((ev, i) => (
            <div key={i} style={{ display: 'flex', gap: '20px', background: '#1a1a1a', padding: '20px', borderRadius: '15px', border: '1px solid #333', opacity: 0.7 }}>
              <div style={{ background: '#555', borderRadius: '10px', padding: '10px', textAlign: 'center', minWidth: '70px', height: '70px' }}>
                <span style={{ display: 'block', fontSize: '24px', fontWeight: 'bold', color: '#fff', lineHeight: 1 }}>{ev.day}</span>
                <span style={{ fontSize: '13px', color: '#fff' }}>{ev.month}</span>
              </div>
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#fff', fontSize: '16px' }}>{ev.title}</h3>
                <p style={{ margin: '0 0 8px 0', color: '#aaa', fontSize: '13px' }}>{ev.desc}</p>
                <div style={{ display: 'flex', gap: '15px', fontSize: '12px', color: '#888' }}><span>{ev.time}</span><span>{ev.platform}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'tournaments' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <button onClick={() => setShowCreate(true)} style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #8f3ed1, #a110ce)', color: '#fff', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>+ Создать турнир</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {allTournaments.map(t => (
              <div key={t.id} style={{ background: '#1a1a1a', borderRadius: '15px', overflow: 'hidden', border: '1px solid #333' }}>
                <div style={{ height: '60px', background: 'linear-gradient(135deg, #2a1a3a, #1a1a2a)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8f3ed1', fontWeight: 'bold', fontSize: '18px' }}>{t.game}</div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>{t.name}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px', fontSize: '13px', color: '#b4a8ff' }}>
                    <span>Приз: {t.prize}</span>
                    <span>Участники: {t.players}</span>
                    <span>Дата: {t.date}</span>
                  </div>
                  <button onClick={() => handleJoinTournament(t.id, t.name)} disabled={participating.includes(t.id)} style={{ width: '100%', padding: '10px', background: participating.includes(t.id) ? '#4caf50' : '#8f3ed1', color: '#fff', border: 'none', borderRadius: '10px', cursor: participating.includes(t.id) ? 'default' : 'pointer', fontWeight: 'bold' }}>
                    {participating.includes(t.id) ? 'Вы участвуете' : 'Участвовать'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#1a1a1a', padding: '30px', borderRadius: '20px', width: '100%', maxWidth: '450px', border: '1px solid #8f3ed1' }}>
            <h3 style={{ marginTop: 0, color: '#fff' }}>Создать турнир</h3>
            <input type="text" placeholder="Название турнира" value={newTournament.name} onChange={e => setNewTournament({...newTournament, name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #333', background: '#222', color: '#fff', marginBottom: '10px', boxSizing: 'border-box' }} />
            <select value={newTournament.game} onChange={e => setNewTournament({...newTournament, game: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #333', background: '#222', color: '#fff', marginBottom: '10px', boxSizing: 'border-box' }}>
              <option>CS2</option><option>Dota 2</option><option>Valorant</option><option>Elden Ring</option>
            </select>
            <input type="text" placeholder="Призовой фонд (напр. 50 000 ₽)" value={newTournament.prize} onChange={e => setNewTournament({...newTournament, prize: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #333', background: '#222', color: '#fff', marginBottom: '10px', boxSizing: 'border-box' }} />
            <input type="text" placeholder="Дата (напр. 15 мая)" value={newTournament.date} onChange={e => setNewTournament({...newTournament, date: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #333', background: '#222', color: '#fff', marginBottom: '10px', boxSizing: 'border-box' }} />
            <input type="number" placeholder="Макс. участников" value={newTournament.maxPlayers} onChange={e => setNewTournament({...newTournament, maxPlayers: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #333', background: '#222', color: '#fff', marginBottom: '15px', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleCreateTournament} style={{ flex: 1, padding: '10px', background: '#8f3ed1', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Создать</button>
              <button onClick={() => setShowCreate(false)} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid #333', borderRadius: '8px', color: '#aaa', cursor: 'pointer' }}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
